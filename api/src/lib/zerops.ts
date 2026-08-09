const ZEROPS_API_BASE =
  process.env.ZEROPS_API_BASE ?? "https://api.app-prg1.zerops.io/api/rest/public";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.ZEROPS_API_TOKEN;
  if (!token) {
    throw new Error(
      "ZEROPS_API_TOKEN is not configured — set it as a project env var to enable real remediation",
    );
  }

  const res = await fetch(`${ZEROPS_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Zerops API ${init?.method ?? "GET"} ${path} failed: ${res.status} ${body}`,
    );
  }

  return res.json() as Promise<T>;
}

/**
 * Restart a service stack.
 * Endpoint shape is confirmed against Swagger at setup time (see docs/03 §1a).
 */
export async function restartServiceStack(serviceId: string): Promise<unknown> {
  return request(`/service-stack/${serviceId}/restart`, { method: "POST" });
}

/**
 * Roll back by reactivating an older app version.
 * Zerops keeps the last 10 versions; reactivating an older one is the rollback.
 */
export async function reactivateAppVersion(
  versionId: string,
): Promise<unknown> {
  return request(`/app-version/${versionId}/reactivate`, { method: "POST" });
}

export async function isZeropsConfigured(): Promise<boolean> {
  return Boolean(process.env.ZEROPS_API_TOKEN);
}
