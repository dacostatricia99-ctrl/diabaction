import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/guards";
import { saveSubscription } from "@/lib/repo/push";
import { departments } from "@/data/demo";

// POST /api/v1/push/subscribe — opt-in aux notifications (public).
// Body : { subscription: { endpoint, keys: { p256dh, auth } }, department?, topics? }
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }

  const sub = body.subscription as { endpoint?: string; keys?: { p256dh?: string; auth?: string } } | undefined;
  if (!sub?.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return NextResponse.json({ data: null, error: "Abonnement invalide." }, { status: 400 });
  }

  const departmentRaw = typeof body.department === "string" ? body.department : undefined;
  const department = departmentRaw && departments.includes(departmentRaw) ? departmentRaw : undefined;
  const topics = Array.isArray(body.topics)
    ? body.topics.map((t) => String(t)).filter((t) => t === "enfants" || t === "depistages" || t === "general")
    : [];

  const user = await getSession();

  await saveSubscription({
    endpoint: sub.endpoint,
    keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    userId: user?.id,
    department,
    topics,
  });

  return NextResponse.json({ data: { subscribed: true }, error: null }, { status: 201 });
}
