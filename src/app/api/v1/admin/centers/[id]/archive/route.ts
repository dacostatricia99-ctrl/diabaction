import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { archiveCenter } from "@/lib/repo/centers";

// POST /api/v1/admin/centers/:id/archive — suppression logique (archivage).
// :id correspond au slug du centre.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const guard = await guardApi(PERMISSIONS.CENTERS_MANAGE);
  if ("response" in guard) return guard.response;

  const ok = await archiveCenter(params.id);
  if (!ok) {
    return NextResponse.json({ data: null, error: "Centre introuvable." }, { status: 404 });
  }

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "archive",
    entity: "centers",
    entityId: params.id,
  });

  return NextResponse.json({ data: { id: params.id, archived: true }, error: null });
}
