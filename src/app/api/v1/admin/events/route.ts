import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { createEvent } from "@/lib/repo/events";
import { parseEventInput } from "@/lib/repo/parse";

// POST /api/v1/admin/events — création d'un événement.
export async function POST(req: Request) {
  const guard = await guardApi(PERMISSIONS.EVENTS_MANAGE);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }
  const parsed = parseEventInput(body);
  if ("error" in parsed) return NextResponse.json({ data: null, error: parsed.error }, { status: 400 });

  const slug = await createEvent(parsed.input);
  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "create",
    entity: "events",
    entityId: slug,
  });
  return NextResponse.json({ data: { slug }, error: null }, { status: 201 });
}
