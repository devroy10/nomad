import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://api:3000";

export async function POST(req: NextRequest) {
  const { action } = (await req.json()) as { action?: string };

  if (action !== "break" && action !== "heal") {
    return Response.json({ error: "action must be 'break' or 'heal'" }, { status: 400 });
  }

  const res = await fetch(`${API_INTERNAL_URL}/api/demo/${action}`, {
    method: "POST",
    cache: "no-store",
  });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
