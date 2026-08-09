import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://api:3000";

export async function GET(req: NextRequest) {
  const url = `${API_INTERNAL_URL}/api/incidents${req.nextUrl.search}`;
  const res = await fetch(url, { cache: "no-store" });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
