import { and, desc, eq, gte } from "drizzle-orm";
import { fixes, incidents, logs } from "@nomad/db";
import { getDb } from "../lib/db.js";
import { diagnose } from "../lib/ai.js";
import { decideFix } from "../remediation/index.js";

const CONTEXT_WINDOW_MS = 5 * 60_000;

export async function diagnoseIncident(incidentId: string): Promise<void> {
  const db = getDb();

  const incidentRows = await db
    .select()
    .from(incidents)
    .where(eq(incidents.id, incidentId))
    .limit(1);

  const incident = incidentRows[0];
  if (!incident) return;

  await db
    .update(incidents)
    .set({ status: "diagnosing" })
    .where(eq(incidents.id, incidentId));

  const recentLogs = await db
    .select({
      message: logs.message,
      level: logs.level,
      timestamp: logs.timestamp,
    })
    .from(logs)
    .where(
      and(
        eq(logs.service, incident.service),
        gte(logs.timestamp, new Date(Date.now() - CONTEXT_WINDOW_MS)),
      ),
    )
    .orderBy(desc(logs.timestamp))
    .limit(50);

  const contextLines = recentLogs.map(
    (l) => `[${l.level}] ${l.timestamp.toISOString()} ${l.message}`,
  );

  const diagnosis = await diagnose(incident.service, incident.symptom, contextLines);
  const fix = decideFix(incident.service);

  await Promise.all([
    db
      .update(incidents)
      .set({ rootCause: diagnosis.rootCause, status: "fix_suggested" })
      .where(eq(incidents.id, incidentId)),
    db.insert(fixes).values({
      incidentId,
      action: fix.action,
      status: "suggested",
      detail: {
        ...fix.detail,
        confidence: diagnosis.confidence,
        fix: diagnosis.fix,
        reasoning: diagnosis.reasoning,
      },
    }),
  ]);

  console.log(
    `[diagnosis] incident ${incidentId} → ${fix.action} (confidence ${diagnosis.confidence})`,
  );
}
