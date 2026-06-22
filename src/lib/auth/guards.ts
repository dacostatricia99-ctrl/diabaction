import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PermissionKey } from "@/lib/rbac";
import {
  SESSION_COOKIE,
  verifySessionToken,
  sessionCan,
  type SessionUser,
} from "@/lib/auth/session";

/** Session courante (server components, route handlers). */
export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Exige une session ; redirige vers /connexion sinon. */
export async function requireUser(returnTo = "/admin"): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect(`/connexion?next=${encodeURIComponent(returnTo)}`);
  return user;
}

/** Exige une permission ; redirige (login) ou affiche 403 (interdiction). */
export async function requirePermission(
  permission: PermissionKey,
  returnTo = "/admin"
): Promise<SessionUser> {
  const user = await requireUser(returnTo);
  if (!sessionCan(user, permission)) redirect("/acces-refuse");
  return user;
}
