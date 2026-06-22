import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { updateMetric } from "@/lib/repo/metrics";

// PATCH /api/v1/admin/metrics — saisie/validation d'un indicateur agrégé.
// Persiste dans la table `metrics` (ou overlay démo), action auditée.
export async function PATCH(req: Request) {
  const guard = await guardApi(PERMISSIONS.METRICS_MANAGE);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }

  const key = String(body.key ?? "");
  const value = Number(body.value);
  if (!Number.isFinite(value) || value < 0) {
    return NextResponse.json({ data: null, error: "Valeur invalide." }, { status: 400 });
  }
  const ok = await updateMetric(key, value);
  if (!ok) {
    return NextResponse.json({ data: null, error: "Indicateur introuvable." }, { status: 404 });
  }

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "metric_validate",
    entity: "metrics",
    entityId: key,
    changes: { value },
  });

  return NextResponse.json({ data: { key, value }, error: null });
}
