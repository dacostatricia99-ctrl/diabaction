import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { setEventStatus } from "@/lib/repo/events";
import type { EventStatus } from "@/data/demo";

const STATUSES = ["brouillon", "publie", "termine", "annule"];

// PATCH /api/v1/admin/events/:id/status — changement de statut d'un événement.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await guardApi(PERMISSIONS.EVENTS_MANAGE);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }
  const status = String(body.status ?? "");
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ data: null, error: "Statut invalide." }, { status: 400 });
  }

  const ok = await setEventStatus(params.id, status as EventStatus);
  if (!ok) {
    return NextResponse.json({ data: null, error: "Événement introuvable." }, { status: 404 });
  }

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "status_change",
    entity: "events",
    entityId: params.id,
    changes: { status },
  });

  return NextResponse.json({ data: { id: params.id, status }, error: null });
}
