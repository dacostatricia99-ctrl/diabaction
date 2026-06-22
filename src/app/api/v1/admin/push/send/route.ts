import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { broadcast } from "@/lib/push";
import { departments } from "@/data/demo";

// POST /api/v1/admin/push/send — diffusion d'une notification (ciblage optionnel).
// Body : { title, body, url?, department?, topic? }
export async function POST(req: Request) {
  const guard = await guardApi(PERMISSIONS.NOTIFICATIONS_SEND);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const message = String(body.body ?? "").trim();
  if (!title || !message) {
    return NextResponse.json({ data: null, error: "Titre et message sont requis." }, { status: 400 });
  }
  const url = String(body.url ?? "").trim() || "/";
  const departmentRaw = String(body.department ?? "");
  const department = departments.includes(departmentRaw) ? departmentRaw : undefined;
  const topic = String(body.topic ?? "").trim() || undefined;

  let result;
  try {
    result = await broadcast({ title, body: message, url }, { department, topic });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message ?? "Envoi impossible." },
      { status: 503 }
    );
  }

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "push_send",
    entity: "push_subscriptions",
    changes: { title, department: department ?? "tous", topic: topic ?? "tous", ...result },
  });

  return NextResponse.json({ data: result, error: null });
}
