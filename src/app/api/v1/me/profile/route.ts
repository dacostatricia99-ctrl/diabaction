import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";

// PUT /api/v1/me/profile — mise à jour du profil de l'utilisateur connecté
// (membre / professionnel). Démo : pas de persistance, journalisé en audit.
// En production : écriture table `member_profiles` (Prisma).
export async function PUT(req: Request) {
  const guard = await guardApi(PERMISSIONS.PROFILE_MANAGE);
  if ("response" in guard) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }

  const profile = {
    firstName: String(body.firstName ?? "").trim(),
    lastName: String(body.lastName ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    city: String(body.city ?? "").trim(),
    email: String(body.email ?? "").trim(),
  };

  if (!profile.firstName || !profile.lastName) {
    return NextResponse.json({ data: null, error: "Nom et prénom sont requis." }, { status: 400 });
  }

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "profile_update",
    entity: "member_profiles",
    entityId: guard.user.id,
    changes: { city: profile.city },
  });

  return NextResponse.json({ data: profile, error: null });
}
