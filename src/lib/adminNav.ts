import { PERMISSIONS, type PermissionKey } from "@/lib/rbac";

// Modules de l'espace admin, chacun gardé par une permission.
export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  permission: PermissionKey;
};

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Vue d'ensemble", icon: "home", permission: PERMISSIONS.CENTERS_MANAGE },
  { href: "/admin/centres", label: "Centres", icon: "map-pin", permission: PERMISSIONS.CENTERS_MANAGE },
  { href: "/admin/evenements", label: "Événements", icon: "calendar", permission: PERMISSIONS.EVENTS_MANAGE },
  { href: "/admin/produits", label: "Produits", icon: "shield", permission: PERMISSIONS.PRODUCTS_MANAGE },
  { href: "/admin/ressources", label: "Ressources", icon: "book", permission: PERMISSIONS.RESOURCES_MANAGE },
  { href: "/admin/adhesions", label: "Adhésions", icon: "users", permission: PERMISSIONS.MEMBERSHIP_REQUESTS_MANAGE },
  { href: "/admin/programmes-enfants", label: "Programme enfants", icon: "heart", permission: PERMISSIONS.CHILDREN_PROGRAM_MANAGE },
  { href: "/admin/indicateurs", label: "Indicateurs", icon: "graduation", permission: PERMISSIONS.METRICS_MANAGE },
  { href: "/admin/partenaires", label: "Partenaires", icon: "users", permission: PERMISSIONS.PARTNERS_MANAGE },
  { href: "/admin/notifications", label: "Notifications", icon: "bell", permission: PERMISSIONS.NOTIFICATIONS_SEND },
  // Réservés SUPER_ADMIN
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "users", permission: PERMISSIONS.USERS_MANAGE },
  { href: "/admin/roles", label: "Rôles & permissions", icon: "shield", permission: PERMISSIONS.ROLES_MANAGE },
  { href: "/admin/audit", label: "Journal d'audit", icon: "book", permission: PERMISSIONS.AUDIT_LOGS_VIEW },
  { href: "/admin/parametres", label: "Paramètres", icon: "shield", permission: PERMISSIONS.PLATFORM_CONFIGURE },
];
