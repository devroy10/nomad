import { NextRequest } from "next/server";
import { API_INTERNAL_URL } from "@/lib/api-internal-url";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = `${API_INTERNAL_URL}/api/incidents${req.nextUrl.search}`;
  const res = await fetch(url, { cache: "no-store" });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
