// Espaces connectés (Lot 3) — source de vérité unique pour les zones privées,
// la redirection post-connexion par rôle et la navigation des espaces membre/pro.
// Réutilisé par le middleware, le chrome public, le login et les layouts d'espace.
import { ROLES, PERMISSIONS, type RoleKey, type PermissionKey } from "@/lib/rbac";

// Zones nécessitant une session (chrome public masqué, garde middleware).
export const PRIVATE_PREFIXES = ["/admin", "/membre", "/pro", "/partenaire"] as const;

/** Le chemin appartient-il à une zone privée (espace connecté ou admin) ? */
export function isPrivateArea(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Page d'atterrissage la mieux adaptée aux rôles de l'utilisateur après connexion. */
export function landingForRoles(roles: RoleKey[]): string {
  if (roles.includes(ROLES.SUPER_ADMIN) || roles.includes(ROLES.ADMIN)) return "/admin";
  if (roles.includes(ROLES.HEALTH_PROFESSIONAL)) return "/pro";
  if (roles.includes(ROLES.MEMBER)) return "/membre";
  if (roles.includes(ROLES.PARTNER)) return "/partenaire";
  return "/";
}

export type SpaceNavItem = {
  href: string;
  label: string;
  icon: string;
  permission: PermissionKey;
};

export type SpaceArea = "membre" | "pro" | "partenaire";

type SpaceDef = {
  title: string;
  subtitle: string;
  // Permission minimale pour accéder à l'espace (garde du layout).
  guard: PermissionKey;
  nav: SpaceNavItem[];
};

export const spaceConfig: Record<SpaceArea, SpaceDef> = {
  membre: {
    title: "Espace membre",
    subtitle: "Votre adhésion, vos avantages et vos tarifs préférentiels.",
    guard: PERMISSIONS.MEMBERSHIP_STATUS_VIEW,
    nav: [
      { href: "/membre", label: "Tableau de bord", icon: "home", permission: PERMISSIONS.MEMBERSHIP_STATUS_VIEW },
      { href: "/membre/adhesion", label: "Mon adhésion", icon: "shield", permission: PERMISSIONS.MEMBERSHIP_STATUS_VIEW },
      { href: "/membre/avantages", label: "Avantages & tarifs", icon: "check", permission: PERMISSIONS.MEMBER_BENEFITS_VIEW },
      { href: "/membre/profil", label: "Mon profil", icon: "users", permission: PERMISSIONS.PROFILE_MANAGE },
    ],
  },
  pro: {
    title: "Espace professionnel de santé",
    subtitle: "Ressources, protocoles et formations validés.",
    guard: PERMISSIONS.RESOURCES_VIEW_PRO,
    nav: [
      { href: "/pro", label: "Tableau de bord", icon: "home", permission: PERMISSIONS.RESOURCES_VIEW_PRO },
      { href: "/pro/ressources", label: "Ressources pro", icon: "book", permission: PERMISSIONS.RESOURCES_VIEW_PRO },
      { href: "/pro/protocoles", label: "Protocoles", icon: "shield", permission: PERMISSIONS.PROTOCOLS_VIEW },
      { href: "/pro/formations", label: "Formations", icon: "graduation", permission: PERMISSIONS.RESOURCES_VIEW_PRO },
      { href: "/pro/profil", label: "Mon profil", icon: "users", permission: PERMISSIONS.PROFILE_MANAGE },
    ],
  },
  partenaire: {
    title: "Espace partenaire",
    subtitle: "Tableaux de bord agrégés et exports. Aucune donnée nominative.",
    guard: PERMISSIONS.DASHBOARD_VIEW_AGGREGATED,
    nav: [
      { href: "/partenaire", label: "Tableau de bord", icon: "graduation", permission: PERMISSIONS.DASHBOARD_VIEW_AGGREGATED },
      { href: "/partenaire/exports", label: "Exports", icon: "book", permission: PERMISSIONS.REPORTS_EXPORT },
      { href: "/partenaire/profil", label: "Mon profil", icon: "users", permission: PERMISSIONS.PROFILE_MANAGE },
    ],
  },
};
