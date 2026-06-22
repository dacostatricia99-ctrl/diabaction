import { NextResponse } from "next/server";
import type { PermissionKey } from "@/lib/rbac";
import { getSession } from "@/lib/auth/guards";
import { sessionCan, type SessionUser } from "@/lib/auth/session";

/** Garde RBAC pour route handlers : renvoie l'utilisateur, ou une réponse 401/403. */
export async function guardApi(
  permission: PermissionKey
): Promise<{ user: SessionUser } | { response: NextResponse }> {
  const user = await getSession();
  if (!user) {
    return { response: NextResponse.json({ data: null, error: "Authentification requise." }, { status: 401 }) };
  }
  if (!sessionCan(user, permission)) {
    return { response: NextResponse.json({ data: null, error: "Accès refusé." }, { status: 403 }) };
  }
  return { user };
}
