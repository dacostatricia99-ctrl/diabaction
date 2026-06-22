import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { updateProduct } from "@/lib/repo/products";
import { parseProductInput } from "@/lib/repo/parse";

// PUT /api/v1/admin/products/:id — modification d'un produit (:id = slug).
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const guard = await guardApi(PERMISSIONS.PRODUCTS_MANAGE);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }
  const parsed = parseProductInput(body);
  if ("error" in parsed) return NextResponse.json({ data: null, error: parsed.error }, { status: 400 });

  const ok = await updateProduct(params.id, parsed.input);
  if (!ok) return NextResponse.json({ data: null, error: "Produit introuvable." }, { status: 404 });

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "update",
    entity: "products",
    entityId: params.id,
  });
  return NextResponse.json({ data: { slug: params.id }, error: null });
}
