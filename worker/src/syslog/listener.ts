import dgram from "node:dgram";
import { insertLog } from "./store.js";
import { parseSyslog } from "./parser.js";

export function startSyslogListener(port: number): dgram.Socket {
  const socket = dgram.createSocket("udp4");

  socket.on("error", (error) => {
    console.error("[syslog] listener error:", error);
  });

  socket.on("message", (msg) => {
    const line = msg.toString("utf8").trim();
    if (!line) return;

    const parsed = parseSyslog(line);
    if (!parsed) {
      console.warn("[syslog] dropped unparseable line:", line.slice(0, 200));
      return;
    }

    insertLog(parsed).catch((error) => {
      console.error("[syslog] failed to persist log:", error);
    });
  });

  socket.bind(port, "0.0.0.0", () => {
    console.log(`[syslog] UDP listener on 0.0.0.0:${port}`);
  });

  return socket;
}
