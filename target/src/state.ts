import type http from "node:http";
import { emitCritical, emitError, emitInfo } from "./syslog.js";

export interface TargetState {
  healthy: boolean;
  mode: "healthy" | "failure";
  since: Date | null;
}

export const state: TargetState = { healthy: true, mode: "healthy", since: null };

let heartbeats: NodeJS.Timeout[] = [];

function clearTimers() {
  for (const timer of heartbeats) clearInterval(timer);
  heartbeats = [];
}

/** Trigger a burst of error/critical logs, then keep a slow trickle. */
export function enterFailure(): TargetState {
  state.healthy = false;
  state.mode = "failure";
  state.since = new Date();

  clearTimers();

  const burstMessages = [
    "connection reset by peer",
    "database pool exhausted (timeout waiting for connection)",
    "5xx error rate above threshold",
    "worker died with exit code 137",
    "upstream connect error: ECONNREFUSED",
    "heap out of memory — OOMKilled",
    "ETIMEDOUT while contacting auth service",
    "uncaught exception: Cannot read properties of undefined",
    "replica lag > 30s",
    "HTTP 503 on /api/health",
    "outgoing request failed: socket hang up",
    "rate limit exceeded, circuit breaker OPEN",
  ];

  let i = 0;
  const burst = setInterval(() => {
    const message = burstMessages[i % burstMessages.length] ?? "error";
    emitError(message, { source: "burst" });
    i++;
    if (i >= burstMessages.length) clearInterval(burst);
  }, 250);

  heartbeats.push(burst);

  const trickle = setInterval(() => {
    emitError("retrying failed request (attempt up)", { source: "trickle" });
  }, 4000);
  heartbeats.push(trickle);

  emitCritical("target entered failure mode", { source: "switch" });

  return { ...state };
}

export function heal(): TargetState {
  state.healthy = true;
  state.mode = "healthy";
  state.since = null;

  clearTimers();

  const heartbeat = setInterval(() => {
    emitInfo("heartbeat ok", { source: "heartbeat" });
  }, 10_000);
  heartbeats.push(heartbeat);

  emitInfo("recovered — target healthy again", { source: "heal" });

  return { ...state };
}

export function ensureHeartbeat(): void {
  if (heartbeats.length > 0) return;
  const heartbeat = setInterval(() => {
    emitInfo("heartbeat ok", { source: "heartbeat" });
  }, 10_000);
  heartbeats.push(heartbeat);
  emitInfo("target started", { source: "startup" });
}

export function writeStatus(res: http.ServerResponse): void {
  const body = JSON.stringify({
    service: "target",
    healthy: state.healthy,
    mode: state.mode,
    since: state.since,
  });
  res.writeHead(200, { "content-type": "application/json" });
  res.end(body);
}
