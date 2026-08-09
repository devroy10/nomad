import { logs } from "@nomad/db";
import { getDb } from "../lib/db.js";
import { levelFromSeverity } from "../lib/levels.js";
import type { ParsedSyslog } from "./parser.js";

export async function insertLog(parsed: ParsedSyslog): Promise<void> {
  await getDb()
    .insert(logs)
    .values({
      service: parsed.appName ?? "unknown",
      level: levelFromSeverity(parsed.severity),
      facility: parsed.facility,
      severity: parsed.severity,
      hostname: parsed.hostname,
      appName: parsed.appName,
      procId: parsed.procId,
      msgId: parsed.msgId,
      message: parsed.message,
      structuredData: parsed.structuredData,
      timestamp: parsed.timestamp,
    });
}
