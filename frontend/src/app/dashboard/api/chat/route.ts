import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://api:3000";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const res = await fetch(`${API_INTERNAL_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    cache: "no-store",
  });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
