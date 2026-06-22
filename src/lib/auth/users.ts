import { scryptSync, timingSafeEqual } from "crypto";
import { ROLES, type RoleKey } from "@/lib/rbac";

// Comptes de démonstration. En production : table `users` + `user_roles` (Prisma).
// Mots de passe stockés en scrypt (salt:hash). Identifiants de démo ci-dessous.
//
//   super@diabaction.cg       / Super1234!        (ROLE_SUPER_ADMIN)
//   admin@diabaction.cg       / Admin1234!        (ROLE_ADMIN)
//   membre@diabaction.cg      / Membre1234!       (ROLE_MEMBER)
//   pro@diabaction.cg         / Pro1234!          (ROLE_HEALTH_PROFESSIONAL)
//   partenaire@diabaction.cg  / Partenaire1234!   (ROLE_PARTNER)

export type DemoUser = {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string; // format salt:hash (hex)
  roles: RoleKey[];
};

export const demoUsers: DemoUser[] = [
  {
    id: "u-super",
    email: "super@diabaction.cg",
    fullName: "Super Administrateur",
    passwordHash:
      "983e0834d65e9f0b9208e5f3f223bb00:3b547eeaeaf46e0ffcb476e8b518e7cfb3c7fcaea2c0cbe31c9f50fce8d50e4f4923e9df75f40334f0c4eb5330179063c380222d2983d87c34905237d9ac720f",
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    id: "u-admin",
    email: "admin@diabaction.cg",
    fullName: "Administrateur",
    passwordHash:
      "6367a0959b4c85185f65129a1304dc72:1b93dd695b86c2d46637f896c7ae87dbbbdf706cb780325b34e56bc0730dc5776321cf6a4585ca7ae889ccc6087c1e6e4feb610bf26dfd8c38a4bb903238de1b",
    roles: [ROLES.ADMIN],
  },
  {
    id: "u-membre",
    email: "membre@diabaction.cg",
    fullName: "Membre Démo",
    passwordHash:
      "40ee2b10a47255c2d4e09cb048b9f8c2:8411b33ede295f2259fcbf73640ba8be32ca8db78fcaeb82b226845a61a88db9850b209f5725f5a73e4d9b3aed5da44abcf4c358ca41f18ef55d2a06a6263fa1",
    roles: [ROLES.MEMBER],
  },
  {
    id: "u-pro",
    email: "pro@diabaction.cg",
    fullName: "Professionnel de santé",
    passwordHash:
      "32a5968859370503cafc4fcf53b14065:370eac371750be54ec11bfe60268cdb025d32625ed4ab0adc9949336125dccf0e9241aacd1b3eb7c3c6a747fefb14fa83ad88b43de3815eefbd32c0a07bc9e53",
    roles: [ROLES.HEALTH_PROFESSIONAL],
  },
  {
    id: "u-partenaire",
    email: "partenaire@diabaction.cg",
    fullName: "Partenaire Institutionnel",
    passwordHash:
      "3f44022745fd59b07797ed77067cd9ba:253c353ff6ca42c4cb8df08b96494ba9bb68e319383712f056a3d9c4716672bbf20339334edbe9224f6815a1b03974492f717f2d55d8e0047e68fddff7f4292a",
    roles: [ROLES.PARTNER],
  },
];

/** Vérifie un mot de passe contre un hash scrypt `salt:hash`, à temps constant. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export function findUserByEmail(email: string) {
  return demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
