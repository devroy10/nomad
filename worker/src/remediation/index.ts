export type FixSuggestion = {
  action: string;
  detail: Record<string, unknown>;
};

/**
 * Decide the remediation action for an incident.
 *
 * - The in-project `target` demo service can be healed over the private
 *   network (no Zerops token needed) — this is the demo's reliable path.
 * - Real services get a `restart` suggestion; applying it requires the
 *   ZEROPS_API_TOKEN project env var and a service id.
 */
export function decideFix(service: string): FixSuggestion {
  if (service === "target") {
    return {
      action: "heal-target",
      detail: {
        target: process.env.TARGET_URL ?? "http://target:4000",
        via: "private-network",
      },
    };
  }

  return {
    action: "restart",
    detail: {
      note: "Requires ZEROPS_API_TOKEN and the service id to apply.",
    },
  };
}
