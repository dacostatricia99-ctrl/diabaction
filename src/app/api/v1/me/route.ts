import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/guards";
import { landingForRoles } from "@/lib/spaces";

// GET /api/v1/me — état de session léger pour le chrome public (lien « Mon espace »).
// Ne renvoie aucune donnée sensible. Non mis en cache.
export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ data: { authenticated: false }, error: null });
  }
  return NextResponse.json({
    data: { authenticated: true, name: user.name, landing: landingForRoles(user.roles) },
    error: null,
  });
}
