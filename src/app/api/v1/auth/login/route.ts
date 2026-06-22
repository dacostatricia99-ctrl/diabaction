import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/users";
import { getAuthUserByEmail } from "@/lib/repo/users";
import { createSessionToken, SESSION_COOKIE, cookieOptions } from "@/lib/auth/session";
import { addAuditLog } from "@/lib/audit";
import { rateLimit, rateLimitReset, clientIp } from "@/lib/rateLimit";

// Fenêtre anti-brute-force : 8 tentatives par IP toutes les 10 minutes.
const LOGIN_LIMIT = 8;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

// POST /api/v1/auth/login — authentification par identifiants.
export async function POST(request: Request) {
  const rlKey = `login:${clientIp(request)}`;
  const rl = rateLimit(rlKey, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { data: null, error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ data: null, error: "Requête invalide." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  const user = await getAuthUserByEmail(email);

  // Message générique pour ne pas révéler l'existence du compte.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ data: null, error: "Identifiants invalides." }, { status: 401 });
  }

  // Authentification réussie : on relâche la limite pour cette IP.
  rateLimitReset(rlKey);

  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    name: user.fullName,
    roles: user.roles,
  });

  await addAuditLog({
    actorId: user.id,
    actorName: user.fullName,
    action: "login",
    entity: "users",
    entityId: user.id,
  });

  const res = NextResponse.json({
    data: { id: user.id, email: user.email, name: user.fullName, roles: user.roles },
    error: null,
  });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions);
  return res;
}
