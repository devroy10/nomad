import { createDb } from "./client.js";
import { logs, incidents } from "./schema.js";

const LEVELS = ["info", "warning", "error", "critical"] as const;
const SERVICES = ["api-gateway", "worker-pool", "target-app", "db-primary"] as const;
const HOSTNAMES = [
  "container-7a3b", "container-2f8c", "container-9d1e",
  "container-4k6m", "container-0p5q", "node-eu-01",
  "node-eu-02", "node-us-01",
] as const;
const APPS = ["node@22", "pg@18", "fastify", "syslogd", "nginx"] as const;

const SYSLOG_TEMPLATES: Record<string, string[]> = {
  "api-gateway": [
    'request completed {method} {path} {status} {latency}ms',
    'rate limit exceeded for IP {ip}',
    'upstream connection timeout after {timeout}ms',
    'TLS handshake completed in {tls}ms',
    'health check {status} from {hostname}',
    'gracefully shutting down worker {worker}',
    'OOM detected in process {pid}',
    'connection pool exhausted, queued {count}',
  ],
  "worker-pool": [
    'syslog batch processed: {count} lines in {duration}ms',
    'anomaly score {score} for service {service}',
    'Claude diagnosis complete in {duration}ms',
    'remediation action queued: {action}',
    'failed to parse syslog line from {hostname}',
    'circuit breaker opened for {service}',
    'dead letter queue depth: {count}',
    'retry attempt {n}/{max} for incident {id}',
  ],
  "target-app": [
    'GET /health → {status} ({latency}ms)',
    'POST /api/users → {status} ({latency}ms)',
    'GET /api/items → {status} ({latency}ms)',
    'POST /api/orders → {status} ({latency}ms)',
    'unhandled rejection at {file}:{line}',
    'memory usage: {mem}MB / {limit}MB',
    'websocket connection dropped from {ip}',
    'cache miss for key {key}, regenerating',
  ],
  "db-primary": [
    'slow query detected: {query} ({duration}ms)',
    'autovacuum started on table {table}',
    'checkpoint starting: {reason}',
    'connection received from {hostname}',
    'replication lag: {lag}ms behind primary',
    'WAL segment {seg} archived in {duration}ms',
    'deadlock detected between pid {a} and {b}',
    'index scan on {table} took {duration}ms',
  ],
};

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[rand(0, arr.length - 1)]!;
}

function weightedLevel(): string {
  const r = Math.random();
  if (r < 0.70) return "info";
  if (r < 0.90) return "warning";
  if (r < 0.98) return "error";
  return "critical";
}

function fillTemplate(tmpl: string): string {
  return tmpl
    .replace(/\{method\}/g, pick(["GET", "POST", "PUT", "DELETE"]))
    .replace(/\{path\}/g, pick(["/api/health", "/api/users", "/api/orders", "/api/items", "/api/admin"]))
    .replace(/\{status\}/g, () => pick(["200", "201", "400", "404", "500", "502", "503"]))
    .replace(/\{latency\}/g, () => String(rand(1, 5000)))
    .replace(/\{duration\}/g, () => String(rand(1, 30000)))
    .replace(/\{timeout\}/g, () => String(rand(1000, 60000)))
    .replace(/\{tls\}/g, () => String(rand(1, 200)))
    .replace(/\{count\}/g, () => String(rand(1, 10000)))
    .replace(/\{score\}/g, () => (Math.random() * 10).toFixed(2))
    .replace(/\{service\}/g, () => pick(SERVICES))
    .replace(/\{hostname\}/g, () => pick(HOSTNAMES))
    .replace(/\{ip\}/g, () =>
      `10.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`,
    )
    .replace(/\{worker\}/g, () => String(rand(1, 8)))
    .replace(/\{pid\}/g, () => String(rand(1000, 99999)))
    .replace(/\{action\}/g, () => pick(["restart", "rollback", "scale-up", "drain"]))
    .replace(/\{n\}/g, () => String(rand(1, 5)))
    .replace(/\{max\}/g, () => String(rand(3, 10)))
    .replace(/\{id\}/g, () => crypto.randomUUID().slice(0, 8))
    .replace(/\{file\}/g, () => pick(["handler.ts", "worker.ts", "router.ts", "auth.ts"]))
    .replace(/\{line\}/g, () => String(rand(1, 500)))
    .replace(/\{mem\}/g, () => String(rand(100, 4000)))
    .replace(/\{limit\}/g, () => String(rand(2048, 8192)))
    .replace(/\{key\}/g, () => `cache:${crypto.randomUUID().slice(0, 12)}`)
    .replace(/\{query\}/g, () => pick(["SELECT * FROM users", "DELETE FROM sessions", "UPDATE orders SET"]))
    .replace(/\{table\}/g, () => pick(["logs", "incidents", "fixes", "users", "orders"]))
    .replace(/\{reason\}/g, () => pick(["time", "WAL", "shutdown"]))
    .replace(/\{lag\}/g, () => String(rand(0, 5000)))
    .replace(/\{seg\}/g, () => `0000000${rand(1000, 9999)}`)
    .replace(/\{a\}/g, () => String(rand(1000, 9999)))
    .replace(/\{b\}/g, () => String(rand(1000, 9999)));
}

interface LogRow {
  service: string;
  level: string;
  facility: number;
  severity: number;
  hostname: string | null;
  appName: string | null;
  procId: string | null;
  msgId: string | null;
  message: string;
  structuredData: Record<string, string> | null;
  timestamp: Date;
}

function generateLogRow(ts: Date): LogRow {
  const service = pick(SERVICES);
  const level = weightedLevel();
  const templates = SYSLOG_TEMPLATES[service]!;
  const message = fillTemplate(pick(templates));

  return {
    service,
    level,
    facility: pick([1, 3, 16, 23]),
    severity: rand(0, 7),
    hostname: pick(HOSTNAMES),
    appName: pick(APPS),
    procId: String(rand(1000, 99999)),
    msgId: crypto.randomUUID(),
    message,
    structuredData: null,
    timestamp: ts,
  };
}

function generateTimestamps(count: number, days: number): Date[] {
  const now = Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;
  const range = now - start;

  return Array.from({ length: count }, () => {
    const offset = Math.random() * range;
    return new Date(start + offset);
  }).sort((a, b) => a.getTime() - b.getTime());
}

async function seed() {
  const TOTAL_ROWS = 26_800;

  const { pool, db } = createDb();

  try {
    console.log(`Clearing existing data...`);
    await db.delete(logs).execute();
    await db.delete(incidents).execute();

    console.log(`Generating ${TOTAL_ROWS.toLocaleString()} log entries...`);
    const timestamps = generateTimestamps(TOTAL_ROWS, 30);
    const rows: LogRow[] = timestamps.map((ts) => generateLogRow(ts));

    console.log(`Inserting rows in batches...`);
    const BATCH = 500;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      await db.insert(logs).values(batch).execute();
      const pct = Math.round(((i + batch.length) / rows.length) * 100);
      process.stdout.write(`\r  ${pct}% (${(i + batch.length).toLocaleString()} / ${TOTAL_ROWS.toLocaleString()})`);
    }

    console.log(`\n\nCreating sample incidents...`);
    const incidentRows = [
      {
        service: "target-app",
        level: "error" as const,
        symptom: "GET /api/orders consistently returning 500 after deploy",
        rootCause: "Missing DATABASE_URL env after config rotation",
        status: "open" as const,
        fixApplied: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        service: "worker-pool",
        level: "critical" as const,
        symptom: "OOM killed repeatedly, syslog processing backlog growing",
        rootCause: "Memory leak in anomaly detection rule engine",
        status: "diagnosing" as const,
        fixApplied: null,
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        service: "api-gateway",
        level: "warning" as const,
        symptom: "Connection pool exhausted, requests queuing",
        rootCause: null,
        status: "open" as const,
        fixApplied: null,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        service: "db-primary",
        level: "error" as const,
        symptom: "Slow queries on logs table, >5s response times",
        rootCause: "Missing index on logs.timestamp after migration",
        status: "fix_suggested" as const,
        fixApplied: "CREATE INDEX CONCURRENTLY logs_timestamp_btree ON logs (timestamp)",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        service: "target-app",
        level: "critical" as const,
        symptom: "Crash loop — restarting every 30s",
        rootCause: "Zerops service scaled to 0 after quota exceeded",
        status: "fixed" as const,
        fixApplied: "Scaled service back to min 1 container via Zerops API",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
      },
    ];

    await db.insert(incidents).values(incidentRows).execute();

    console.log(`\nSeed complete!`);
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
