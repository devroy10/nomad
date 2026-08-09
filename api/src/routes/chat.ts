import { desc, eq } from "drizzle-orm";
import { incidents } from "@nomad/db";
import type { FastifyInstance } from "fastify";
import { askAboutIncidents } from "../lib/ai.js";
import { getDb } from "../lib/db.js";

export async function chatRoutes(app: FastifyInstance) {
  app.post("/", async (req, reply) => {
    const body = (req.body ?? {}) as { question?: string };
    const question = body.question?.trim();
    if (!question) {
      return reply.code(400).send({ error: "question is required" });
    }

    const recent = await getDb()
      .select()
      .from(incidents)
      .where(eq(incidents.status, "open"))
      .orderBy(desc(incidents.createdAt))
      .limit(10);

    const summary = recent
      .map(
        (i) =>
          `- [${i.level}] ${i.service}: ${i.symptom} | status=${i.status} | rootCause=${i.rootCause ?? "unknown"}`,
      )
      .join("\n");

    const { answer } = await askAboutIncidents(question, summary || "(no open incidents)");

    return reply.send({ answer });
  });
}
