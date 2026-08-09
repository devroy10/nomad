export function restartFix(serviceId: string): {
  action: string;
  detail: Record<string, unknown>;
} {
  return { action: "restart", detail: { serviceId } };
}

export function rollbackFix(versionId: string): {
  action: string;
  detail: Record<string, unknown>;
} {
  return { action: "rollback", detail: { versionId } };
}
