// RBAC centralisé — voir docs/03-rbac-securite.md
// Source de vérité unique : rôles, permissions et matrice. Réutilisé par le seed,
// les gardes d'API, le middleware et les composants <Can>.

export const ROLES = {
  VISITOR: "ROLE_VISITOR",
  MEMBER: "ROLE_MEMBER",
  HEALTH_PROFESSIONAL: "ROLE_HEALTH_PROFESSIONAL",
  PARTNER: "ROLE_PARTNER",
  ADMIN: "ROLE_ADMIN",
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
} as const;

export type RoleKey = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<RoleKey, string> = {
  ROLE_VISITOR: "Visiteur",
  ROLE_MEMBER: "Membre",
  ROLE_HEALTH_PROFESSIONAL: "Professionnel de santé",
  ROLE_PARTNER: "Partenaire institutionnel",
  ROLE_ADMIN: "Administrateur",
  ROLE_SUPER_ADMIN: "Super-administrateur",
};

// Toutes les permissions atomiques de la plateforme.
export const PERMISSIONS = {
  // Lecture publique
  CENTERS_VIEW: "centers.view",
  EVENTS_VIEW: "events.view",
  PRODUCTS_VIEW: "products.view",
  RESOURCES_VIEW_PUBLIC: "resources.view.public",
  CHILDREN_PROGRAM_VIEW: "children_program.view",
  MEMBERSHIP_REQUEST: "membership.request",
  CONTACT_SEND: "contact.send",
  // Membre
  MEMBER_BENEFITS_VIEW: "member.benefits.view",
  MEMBER_PRICES_VIEW: "member.preferential_prices.view",
  PROFILE_MANAGE: "profile.manage",
  MEMBERSHIP_STATUS_VIEW: "membership.status.view",
  NOTIFICATIONS_RECEIVE: "notifications.receive",
  // Professionnel de santé
  RESOURCES_VIEW_PRO: "resources.view.professional",
  RESOURCES_DOWNLOAD_VALIDATED: "resources.download.validated",
  PROTOCOLS_VIEW: "protocols.view",
  // Partenaire
  DASHBOARD_VIEW_AGGREGATED: "dashboard.view.aggregated",
  REPORTS_EXPORT: "reports.export",
  // Admin
  CENTERS_MANAGE: "centers.manage",
  EVENTS_MANAGE: "events.manage",
  PRODUCTS_MANAGE: "products.manage",
  RESOURCES_MANAGE: "resources.manage",
  MEMBERSHIP_REQUESTS_MANAGE: "membership_requests.manage",
  CHILDREN_PROGRAM_MANAGE: "children_program.manage",
  METRICS_MANAGE: "metrics.manage",
  PARTNERS_MANAGE: "partners.manage",
  // Notifications (envoi/diffusion — admin)
  NOTIFICATIONS_SEND: "notifications.send",
  // Super-admin
  USERS_MANAGE: "users.manage",
  ROLES_MANAGE: "roles.manage",
  PERMISSIONS_MANAGE: "permissions.manage",
  PLATFORM_CONFIGURE: "platform.configure",
  AUDIT_LOGS_VIEW: "audit_logs.view",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const P = PERMISSIONS;

const PUBLIC: PermissionKey[] = [
  P.CENTERS_VIEW,
  P.EVENTS_VIEW,
  P.PRODUCTS_VIEW,
  P.RESOURCES_VIEW_PUBLIC,
  P.CHILDREN_PROGRAM_VIEW,
  P.MEMBERSHIP_REQUEST,
  P.CONTACT_SEND,
];

const MEMBER: PermissionKey[] = [
  P.MEMBER_BENEFITS_VIEW,
  P.MEMBER_PRICES_VIEW,
  P.PROFILE_MANAGE,
  P.MEMBERSHIP_STATUS_VIEW,
  P.NOTIFICATIONS_RECEIVE,
];

const HEALTH_PRO: PermissionKey[] = [
  P.PROFILE_MANAGE,
  P.NOTIFICATIONS_RECEIVE,
  P.RESOURCES_VIEW_PRO,
  P.RESOURCES_DOWNLOAD_VALIDATED,
  P.PROTOCOLS_VIEW,
];

const PARTNER: PermissionKey[] = [
  P.PROFILE_MANAGE,
  P.NOTIFICATIONS_RECEIVE,
  P.DASHBOARD_VIEW_AGGREGATED,
  P.REPORTS_EXPORT,
];

const ADMIN: PermissionKey[] = [
  ...PUBLIC,
  P.CENTERS_MANAGE,
  P.EVENTS_MANAGE,
  P.PRODUCTS_MANAGE,
  P.RESOURCES_MANAGE,
  P.MEMBERSHIP_REQUESTS_MANAGE,
  P.CHILDREN_PROGRAM_MANAGE,
  P.METRICS_MANAGE,
  P.PARTNERS_MANAGE,
  P.DASHBOARD_VIEW_AGGREGATED,
  P.REPORTS_EXPORT,
  P.NOTIFICATIONS_SEND,
];

// ADMIN ne gère PAS rôles/users/permissions/audit : réservés SUPER_ADMIN.
const SUPER_ADMIN: PermissionKey[] = [
  ...ADMIN,
  P.USERS_MANAGE,
  P.ROLES_MANAGE,
  P.PERMISSIONS_MANAGE,
  P.PLATFORM_CONFIGURE,
  P.AUDIT_LOGS_VIEW,
];

// Matrice rôle → permissions.
export const ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]> = {
  ROLE_VISITOR: PUBLIC,
  ROLE_MEMBER: [...PUBLIC, ...MEMBER],
  ROLE_HEALTH_PROFESSIONAL: [...PUBLIC, ...HEALTH_PRO],
  ROLE_PARTNER: [...PUBLIC, ...PARTNER],
  ROLE_ADMIN: ADMIN,
  ROLE_SUPER_ADMIN: SUPER_ADMIN,
};

/** Un ensemble de rôles dispose-t-il de la permission demandée ? */
export function can(roles: RoleKey[], permission: PermissionKey): boolean {
  return roles.some((r) => ROLE_PERMISSIONS[r]?.includes(permission));
}
