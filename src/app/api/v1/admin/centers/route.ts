import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { createCenter } from "@/lib/repo/centers";
import { parseCenterInput } from "@/lib/repo/parse";

// POST /api/v1/admin/centers — création d'un centre.
export async function POST(req: Request) {
  const guard = await guardApi(PERMISSIONS.CENTERS_MANAGE);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }
  const parsed = parseCenterInput(body);
  if ("error" in parsed) return NextResponse.json({ data: null, error: parsed.error }, { status: 400 });

  const slug = await createCenter(parsed.input);
  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "create",
    entity: "centers",
    entityId: slug,
  });
  return NextResponse.json({ data: { slug }, error: null }, { status: 201 });
}
