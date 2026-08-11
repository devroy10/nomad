import { NextRequest } from "next/server";
import { API_INTERNAL_URL } from "@/lib/api-internal-url";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { incidentId } = (await req.json()) as { incidentId?: string };
  if (!incidentId) {
    return Response.json({ error: "incidentId is required" }, { status: 400 });
  }

  const res = await fetch(`${API_INTERNAL_URL}/api/fixes/${incidentId}/apply`, {
    method: "POST",
    cache: "no-store",
  });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
