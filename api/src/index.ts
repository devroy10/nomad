import Fastify from "fastify";
import { chatRoutes } from "./routes/chat.js";
import { demoRoutes } from "./routes/demo.js";
import { fixesRoutes } from "./routes/fixes.js";
import { healthRoutes } from "./routes/health.js";
import { incidentsRoutes } from "./routes/incidents.js";
import { logsRoutes } from "./routes/logs.js";

const app = Fastify({ logger: { level: "info" } });

app.register(healthRoutes, { prefix: "/health" });
app.register(incidentsRoutes, { prefix: "/api/incidents" });
app.register(logsRoutes, { prefix: "/api/logs" });
app.register(chatRoutes, { prefix: "/api/chat" });
app.register(demoRoutes, { prefix: "/api/demo" });
app.register(fixesRoutes, { prefix: "/api/fixes" });

const port = Number(process.env.PORT ?? 3000);

try {
  await app.listen({ host: "0.0.0.0", port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
