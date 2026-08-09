import http from "node:http";
import { startAnomalyScanner } from "./anomaly/index.js";
import { startSyslogListener } from "./syslog/listener.js";

const SYSLOG_PORT = Number(process.env.SYSLOG_PORT ?? 5140);
const HTTP_PORT = Number(process.env.PORT ?? 3001);

startSyslogListener(SYSLOG_PORT);
startAnomalyScanner(15_000);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(
    JSON.stringify({
      ok: true,
      service: "worker",
      syslogPort: SYSLOG_PORT,
      uptime: process.uptime(),
    }),
  );
});

server.listen(HTTP_PORT, "0.0.0.0", () => {
  console.log(`[worker] HTTP health server on 0.0.0.0:${HTTP_PORT}`);
});
