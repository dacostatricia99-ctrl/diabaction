import type { PermissionKey } from "@/lib/rbac";
import { getSession } from "@/lib/auth/guards";
import { sessionCan } from "@/lib/auth/session";

/** Affiche ses enfants uniquement si la session courante a la permission.
 *  Garde RBAC au niveau du composant (server) — voir docs/03-rbac-securite.md. */
export async function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const user = await getSession();
  return sessionCan(user, permission) ? <>{children}</> : <>{fallback}</>;
}
