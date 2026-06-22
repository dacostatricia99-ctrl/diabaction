import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { archiveProduct } from "@/lib/repo/products";

// POST /api/v1/admin/products/:id/archive — suppression logique (:id = slug).
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const guard = await guardApi(PERMISSIONS.PRODUCTS_MANAGE);
  if ("response" in guard) return guard.response;

  const ok = await archiveProduct(params.id);
  if (!ok) return NextResponse.json({ data: null, error: "Produit introuvable." }, { status: 404 });

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "archive",
    entity: "products",
    entityId: params.id,
  });
  return NextResponse.json({ data: { id: params.id, archived: true }, error: null });
}
