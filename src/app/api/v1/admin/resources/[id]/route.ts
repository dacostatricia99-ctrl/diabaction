import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { updateResource } from "@/lib/repo/resources";
import { parseResourceInput } from "@/lib/repo/parse";

// PUT /api/v1/admin/resources/:id — modification d'une ressource (:id = slug).
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const guard = await guardApi(PERMISSIONS.RESOURCES_MANAGE);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }
  const parsed = parseResourceInput(body);
  if ("error" in parsed) return NextResponse.json({ data: null, error: parsed.error }, { status: 400 });

  const ok = await updateResource(params.id, parsed.input);
  if (!ok) return NextResponse.json({ data: null, error: "Ressource introuvable." }, { status: 404 });

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "update",
    entity: "resources",
    entityId: params.id,
  });
  return NextResponse.json({ data: { slug: params.id }, error: null });
}
