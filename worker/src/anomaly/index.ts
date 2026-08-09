import { and, eq, gte, sql } from "drizzle-orm";
import { incidents, logs } from "@nomad/db";
import { getDb } from "../lib/db.js";
import { diagnoseIncident } from "../diagnosis/index.js";

const BURST_WINDOW_MS = 60_000;
const BURST_THRESHOLD = 5;
const DEDUP_WINDOW_MS = 5 * 60_000;

const ACTIVE_STATUSES = sql`${incidents.status} IN ('open','diagnosing','fix_suggested')`;

async function hasActiveIncident(service: string): Promise<boolean> {
  const since = new Date(Date.now() - DEDUP_WINDOW_MS);
  const rows = await getDb()
    .select({ id: incidents.id })
    .from(incidents)
    .where(
      and(eq(incidents.service, service), gte(incidents.createdAt, since), ACTIVE_STATUSES),
    )
    .limit(1);
  return rows.length > 0;
}

export async function scanForAnomalies(): Promise<void> {
  const db = getDb();
  const since = new Date(Date.now() - BURST_WINDOW_MS);

  const rows = await db
    .select({
      service: logs.service,
      level: logs.level,
      count: sql<number>`count(*)`,
    })
    .from(logs)
    .where(
      and(
        gte(logs.timestamp, since),
        sql`${logs.level} IN ('error','critical')`,
      ),
    )
    .groupBy(logs.service, logs.level);

  for (const row of rows) {
    const count = Number(row.count);
    if (count < BURST_THRESHOLD) continue;

    if (await hasActiveIncident(row.service)) continue;

    const [incident] = await db
      .insert(incidents)
      .values({
        service: row.service,
        level: row.level === "critical" ? "critical" : "error",
        symptom: `${count} ${row.level} log lines from "${row.service}" in the last minute`,
        status: "open",
      })
      .returning({ id: incidents.id });

    if (incident) {
      console.log(
        `[anomaly] incident ${incident.id} opened for "${row.service}" (${count} ${row.level})`,
      );
      void diagnoseIncident(incident.id);
    }
  }
}

export function startAnomalyScanner(intervalMs = 15_000): NodeJS.Timeout {
  void scanForAnomalies();
  return setInterval(() => {
    void scanForAnomalies().catch((error) => {
      console.error("[anomaly] scan failed:", error);
    });
  }, intervalMs);
}
