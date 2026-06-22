import { prisma, dbEnabled } from "@/lib/db";
import { findUserByEmail as findDemoUser, type DemoUser } from "@/lib/auth/users";
import type { RoleKey } from "@/lib/rbac";

// Repository d'authentification — utilisateurs en base si actif, sinon démo.

export async function getAuthUserByEmail(email: string): Promise<DemoUser | undefined> {
  if (!dbEnabled()) return findDemoUser(email);
  try {
    const u = await prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { roles: { include: { role: true } } },
    });
    if (!u || !u.passwordHash) return undefined;
    return {
      id: u.id,
      email: u.email ?? email,
      fullName: u.fullName ?? "",
      passwordHash: u.passwordHash,
      roles: u.roles.map((r) => r.role.key as RoleKey),
    };
  } catch (err) {
    console.error("[repo/users] repli démo:", err);
    return findDemoUser(email);
  }
}
