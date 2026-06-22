import { NextResponse } from "next/server";
import { removeSubscription } from "@/lib/repo/push";

// POST /api/v1/push/unsubscribe — désabonnement (public). Body : { endpoint }
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }
  const endpoint = String(body.endpoint ?? "");
  if (!endpoint) return NextResponse.json({ data: null, error: "Endpoint requis." }, { status: 400 });

  await removeSubscription(endpoint);
  return NextResponse.json({ data: { unsubscribed: true }, error: null });
}
