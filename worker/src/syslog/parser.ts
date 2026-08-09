export interface ParsedSyslog {
  facility: number;
  severity: number;
  timestamp: Date;
  hostname: string | null;
  appName: string | null;
  procId: string | null;
  msgId: string | null;
  structuredData: Record<string, string> | null;
  message: string;
}

const NIL = "-";

function orNull(value: string | undefined): string | null {
  return value && value !== NIL ? value : null;
}

/**
 * Parse an RFC 5424 (and tolerant RFC 3164) syslog line.
 *
 *   <PRI>1 TIMESTAMP HOSTNAME APP-NAME PROCID MSGID [SD ID@32473 key="v"] MSG
 *
 * Malformed lines return null (the listener drops them) — never throws.
 */
export function parseSyslog(line: string): ParsedSyslog | null {
  if (!line.startsWith("<")) return null;

  const priEnd = line.indexOf(">");
  if (priEnd === -1) return null;

  const pri = Number(line.slice(1, priEnd));
  if (!Number.isInteger(pri) || pri < 0 || pri > 191) return null;

  const facility = Math.floor(pri / 8);
  const severity = pri % 8;

  const rest = line.slice(priEnd + 1);
  if (rest.length === 0) return null;

  const firstChar = rest[0];
  if (firstChar === "1") {
    return parseRfc5424(rest.slice(1), facility, severity);
  }

  return parseRfc3164(rest, facility, severity);
}

function parseRfc5424(
  rest: string,
  facility: number,
  severity: number,
): ParsedSyslog {
  const parts = rest.trim().split(" ");
  const [timestampRaw, hostname, appName, procId, msgId] = parts;
  const remainder = parts.slice(5).join(" ");

  const timestamp = new Date(timestampRaw ?? "");
  if (Number.isNaN(timestamp.getTime())) {
    return {
      facility,
      severity,
      timestamp: new Date(),
      hostname: orNull(hostname),
      appName: orNull(appName),
      procId: orNull(procId),
      msgId: orNull(msgId),
      structuredData: null,
      message: remainder.replace(/^-\s*/, ""),
    };
  }

  let structuredData: Record<string, string> | null = null;
  let message = remainder;

  if (remainder.startsWith("[")) {
    const closeIdx = remainder.indexOf("]");
    if (closeIdx !== -1) {
      const sdBlock = remainder.slice(1, closeIdx);
      structuredData = parseStructuredData(sdBlock);
      message = remainder
        .slice(closeIdx + 1)
        .replace(/^\s*-\s*/, "")
        .replace(/^\s+/, "");
    } else {
      structuredData = {};
      message = "";
    }
  } else if (remainder.startsWith("-")) {
    message = remainder.replace(/^-\s*/, "");
  }

  return {
    facility,
    severity,
    timestamp,
    hostname: orNull(hostname),
    appName: orNull(appName),
    procId: orNull(procId),
    msgId: orNull(msgId),
    structuredData,
    message,
  };
}

function parseRfc3164(
  rest: string,
  facility: number,
  severity: number,
): ParsedSyslog {
  const parts = rest.split(" ");
  const [month, day, time, hostname, ...msgParts] = parts;

  if (!month || !day || !time) {
    return {
      facility,
      severity,
      timestamp: new Date(),
      hostname: null,
      appName: null,
      procId: null,
      msgId: null,
      structuredData: null,
      message: rest,
    };
  }

  const now = new Date();
  const timestamp = new Date(
    `${now.getUTCFullYear()}-${month}-${day}T${time}Z`,
  );

  return {
    facility,
    severity,
    timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp,
    hostname: orNull(hostname),
    appName: null,
    procId: null,
    msgId: null,
    structuredData: null,
    message: msgParts.join(" "),
  };
}

function parseStructuredData(block: string): Record<string, string> {
  const result: Record<string, string> = {};
  const keyValue = /(\w+)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = keyValue.exec(block)) !== null) {
    result[match[1] ?? ""] = match[2] ?? "";
  }
  return result;
}
