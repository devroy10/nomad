import dgram from "node:dgram";

const SYSLOG_URL = process.env.SYSLOG_URL ?? "worker:5140";
const APP_NAME = "target";
const HOSTNAME = "target";
const FACILITY = 17; // local4 (user-space apps)
const MSG_ID = "ID47";

let socket: dgram.Socket | null = null;

function getSocket(): dgram.Socket {
  if (!socket) socket = dgram.createSocket("udp4");
  return socket;
}

function parseTarget(): { host: string; port: number } {
  const [host, portRaw] = SYSLOG_URL.split(":");
  return { host: host ?? "worker", port: Number(portRaw ?? 5140) };
}

function buildLine(
  severity: number,
  structuredData: Record<string, string>,
  message: string,
): Buffer {
  const timestamp = new Date().toISOString();
  const pri = FACILITY * 8 + severity;
  const sd = Object.entries(structuredData)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  const line = `<${pri}>1 ${timestamp} ${HOSTNAME} ${APP_NAME} ${process.pid} ${MSG_ID} [exampleSDID@32473 ${sd}] ${message}`;
  return Buffer.from(line, "utf8");
}

export function sendLog(
  severity: number,
  structuredData: Record<string, string>,
  message: string,
): void {
  const { host, port } = parseTarget();
  const payload = buildLine(severity, structuredData, message);
  getSocket().send(payload, port, host, (error) => {
    if (error) {
      console.error("[target] syslog send failed:", error.message);
    }
  });
}

export function emitInfo(message: string, data: Record<string, string> = {}): void {
  sendLog(5, { mode: "healthy", ...data }, message);
}

export function emitError(message: string, data: Record<string, string> = {}): void {
  sendLog(3, { mode: "failure", ...data }, message);
}

export function emitCritical(message: string, data: Record<string, string> = {}): void {
  sendLog(2, { mode: "failure", ...data }, message);
}
