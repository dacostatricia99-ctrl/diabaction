import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

// POST /api/v1/auth/logout — invalide la session (suppression du cookie).
export async function POST() {
  const res = NextResponse.json({ data: { ok: true }, error: null });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
