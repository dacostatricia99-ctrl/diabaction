import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { archiveEvent } from "@/lib/repo/events";

// POST /api/v1/admin/events/:id/archive — suppression logique (:id = slug).
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const guard = await guardApi(PERMISSIONS.EVENTS_MANAGE);
  if ("response" in guard) return guard.response;

  const ok = await archiveEvent(params.id);
  if (!ok) return NextResponse.json({ data: null, error: "Événement introuvable." }, { status: 404 });

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "archive",
    entity: "events",
    entityId: params.id,
  });
  return NextResponse.json({ data: { id: params.id, archived: true }, error: null });
}
