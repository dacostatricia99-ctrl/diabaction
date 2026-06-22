import { SignJWT, jwtVerify } from "jose";
import type { RoleKey, PermissionKey } from "@/lib/rbac";
import { can } from "@/lib/rbac";

export const SESSION_COOKIE = "diab_session";
const MAX_AGE = 60 * 60 * 8; // 8 h

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  roles: RoleKey[];
};

function secret() {
  const s = process.env.AUTH_SECRET || "dev-secret-change-me-please-32chars-min";
  return new TextEncoder().encode(s);
}

/** Signe un jeton de session (JWT HS256) — compatible Node et Edge. */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, roles: user.roles })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

/** Vérifie un jeton et retourne l'utilisateur, ou null si invalide/expiré. */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      roles: (payload.roles as RoleKey[]) ?? [],
    };
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};

/** Helper métier : l'utilisateur de session a-t-il la permission ? */
export function sessionCan(user: SessionUser | null, permission: PermissionKey): boolean {
  if (!user) return false;
  return can(user.roles, permission);
}
