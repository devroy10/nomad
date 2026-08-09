import type { Level } from "@nomad/shared";

/** Map syslog severity (0-7) to a Nomad level. */
export function levelFromSeverity(severity: number): Level {
  if (severity <= 1) return "critical";
  if (severity <= 3) return "error";
  if (severity === 4) return "warning";
  return "info";
}
