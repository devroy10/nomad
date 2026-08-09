import http from "node:http";
import { emitError } from "./syslog.js";
import { ensureHeartbeat, enterFailure, heal, state, writeStatus } from "./state.js";

const PORT = Number(process.env.PORT ?? 4000);

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/status")) {
    writeStatus(res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/break") {
    const next = enterFailure();
    const body = JSON.stringify({ ok: true, ...next });
    res.writeHead(200, { "content-type": "application/json" });
    res.end(body);
    return;
  }

  if (req.method === "POST" && url.pathname === "/heal") {
    const next = heal();
    const body = JSON.stringify({ ok: true, ...next });
    res.writeHead(200, { "content-type": "application/json" });
    res.end(body);
    return;
  }

  if (req.method === "POST" && url.pathname === "/simulate-error") {
    emitError("manual simulated error", { source: "simulate" });
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found", path: url.pathname }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[target] listening on 0.0.0.0:${PORT}`);
  ensureHeartbeat();
  console.log(`[target] initial state: ${JSON.stringify(state)}`);
});
