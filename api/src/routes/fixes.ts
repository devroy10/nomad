import { asc, eq } from "drizzle-orm";
import { fixes, incidents } from "@nomad/db";
import type { FastifyInstance } from "fastify";
import { getDb } from "../lib/db.js";
import { reactivateAppVersion, restartServiceStack } from "../lib/zerops.js";

type FixAction =
  | { kind: "heal-target" }
  | { kind: "restart"; serviceId: string }
  | { kind: "rollback"; versionId: string };

function parseAction(raw: string, detail: Record<string, unknown> | null): FixAction {
  if (raw === "heal-target") return { kind: "heal-target" };
  if (raw === "restart" && typeof detail?.serviceId === "string") {
    return { kind: "restart", serviceId: detail.serviceId };
  }
  if (raw === "rollback" && typeof detail?.versionId === "string") {
    return { kind: "rollback", versionId: detail.versionId };
  }
  throw new Error(`Unsupported fix action: ${raw}`);
}

async function executeAction(action: FixAction): Promise<string> {
  switch (action.kind) {
    case "heal-target": {
      const targetUrl = process.env.TARGET_URL ?? "http://target:4000";
      const res = await fetch(`${targetUrl}/heal`, { method: "POST" });
      if (!res.ok) {
        throw new Error(`target /heal failed (${res.status})`);
      }
      return "Healed the target demo service via its /heal endpoint.";
    }
    case "restart":
      await restartServiceStack(action.serviceId);
      return `Restarted service stack ${action.serviceId} via the Zerops REST API.`;
    case "rollback":
      await reactivateAppVersion(action.versionId);
      return `Reactivated app version ${action.versionId} via the Zerops REST API.`;
  }
}

export async function fixesRoutes(app: FastifyInstance) {
  app.get("/:incidentId", async (req, reply) => {
    const { incidentId } = req.params as { incidentId: string };
    const rows = await getDb()
      .select()
      .from(fixes)
      .where(eq(fixes.incidentId, incidentId))
      .orderBy(asc(fixes.createdAt));
    return reply.send({ fixes: rows });
  });

  app.post("/:incidentId/apply", async (req, reply) => {
    const { incidentId } = req.params as { incidentId: string };
    const db = getDb();

    const incident = await db
      .select()
      .from(incidents)
      .where(eq(incidents.id, incidentId))
      .limit(1);

    const row = incident[0];
    if (!row) {
      return reply.code(404).send({ error: "incident not found" });
    }

    const fixRows = await db
      .select()
      .from(fixes)
      .where(eq(fixes.incidentId, incidentId))
      .orderBy(asc(fixes.createdAt))
      .limit(1);

    const fix = fixRows[0];
    if (!fix) {
      return reply.code(404).send({ error: "no suggested fix for this incident" });
    }

    let outcome: string;
    try {
      const action = parseAction(fix.action, fix.detail as Record<string, unknown> | null);
      outcome = await executeAction(action);
    } catch (error) {
      await db
        .update(fixes)
        .set({ status: "failed" })
        .where(eq(fixes.id, fix.id));
      return reply.code(502).send({
        error: "fix failed to apply",
        detail: error instanceof Error ? error.message : String(error),
      });
    }

    await Promise.all([
      db.update(fixes).set({ status: "applied" }).where(eq(fixes.id, fix.id)),
      db
        .update(incidents)
        .set({
          status: "fixed",
          fixApplied: fix.action,
          resolvedAt: new Date(),
        })
        .where(eq(incidents.id, incidentId)),
    ]);

    return reply.send({ ok: true, outcome, fixId: fix.id });
  });
}
