import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { type PartnerStatus } from "@/data/impact";
import { setPartnerStatus } from "@/lib/repo/partners";

const STATUSES: PartnerStatus[] = ["actif", "suspendu"];

// PATCH /api/v1/admin/partners/:id/status — activer / suspendre un partenaire.
// Persiste dans la table `partners` (ou overlay démo), action auditée.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await guardApi(PERMISSIONS.PARTNERS_MANAGE);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }

  const status = String(body.status ?? "") as PartnerStatus;
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ data: null, error: "Statut invalide." }, { status: 400 });
  }
  const ok = await setPartnerStatus(params.id, status);
  if (!ok) {
    return NextResponse.json({ data: null, error: "Partenaire introuvable." }, { status: 404 });
  }

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "partner_status",
    entity: "partners",
    entityId: params.id,
    changes: { status },
  });

  return NextResponse.json({ data: { id: params.id, status }, error: null });
}
