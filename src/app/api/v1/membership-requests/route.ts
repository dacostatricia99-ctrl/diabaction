import { NextResponse } from "next/server";

// POST /api/v1/membership-requests — demande d'adhésion (permission membership.request,
// publique). Validation minimale ici ; en production : Zod + Prisma + audit + rate-limit.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ data: null, error: "Corps de requête invalide." }, { status: 400 });
  }

  const lastName = String(body.lastName ?? "").trim();
  const firstName = String(body.firstName ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!lastName || !firstName || !phone) {
    return NextResponse.json(
      { data: null, error: "Nom, prénom et téléphone sont requis." },
      { status: 400 }
    );
  }

  // En production : prisma.membershipRequest.create({ ... status: 'nouvelle' }).
  // Ici on confirme la réception (le front gère l'envoi différé hors ligne).
  return NextResponse.json(
    { data: { received: true }, error: null, meta: { message: "Demande enregistrée." } },
    { status: 201 }
  );
}
