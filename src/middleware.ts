import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { can, PERMISSIONS, type PermissionKey } from "@/lib/rbac";

// Garde de routes au niveau du middleware (Edge). Le contrôle fin (composants,
// données) reste appliqué côté serveur — voir docs/03-rbac-securite.md.
const RULES: { prefix: string; permission: PermissionKey }[] = [
  { prefix: "/admin", permission: PERMISSIONS.CENTERS_MANAGE },
  { prefix: "/membre", permission: PERMISSIONS.MEMBERSHIP_STATUS_VIEW },
  { prefix: "/pro", permission: PERMISSIONS.RESOURCES_VIEW_PRO },
  { prefix: "/partenaire", permission: PERMISSIONS.DASHBOARD_VIEW_AGGREGATED },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = RULES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`));
  if (!rule) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!can(user.roles, rule.permission)) {
    const url = req.nextUrl.clone();
    url.pathname = "/acces-refuse";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/membre/:path*", "/pro/:path*", "/partenaire/:path*"],
};
