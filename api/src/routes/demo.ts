import type { FastifyInstance } from "fastify";

const TARGET_URL = process.env.TARGET_URL ?? "http://target:4000";

export async function demoRoutes(app: FastifyInstance) {
  app.post("/break", async (req, reply) => {
    const res = await fetch(`${TARGET_URL}/break`, { method: "POST" });
    if (!res.ok) {
      const detail = await res.text();
      return reply
        .code(502)
        .send({ error: `target /break failed (${res.status}): ${detail}` });
    }
    const detail = (await res.json()) as unknown;
    return reply.send({ ok: true, detail });
  });

  app.post("/heal", async (req, reply) => {
    const res = await fetch(`${TARGET_URL}/heal`, { method: "POST" });
    if (!res.ok) {
      const detail = await res.text();
      return reply
        .code(502)
        .send({ error: `target /heal failed (${res.status}): ${detail}` });
    }
    const detail = (await res.json()) as unknown;
    return reply.send({ ok: true, detail });
  });
}
