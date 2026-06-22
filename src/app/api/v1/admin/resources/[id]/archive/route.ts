import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { archiveResource } from "@/lib/repo/resources";

// POST /api/v1/admin/resources/:id/archive — suppression logique (:id = slug).
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const guard = await guardApi(PERMISSIONS.RESOURCES_MANAGE);
  if ("response" in guard) return guard.response;

  const ok = await archiveResource(params.id);
  if (!ok) return NextResponse.json({ data: null, error: "Ressource introuvable." }, { status: 404 });

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "archive",
    entity: "resources",
    entityId: params.id,
  });
  return NextResponse.json({ data: { id: params.id, archived: true }, error: null });
}
