import { NextResponse } from "next/server";

// POST /api/v1/contact — message de contact (permission contact.send, publique).
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ data: null, error: "Corps de requête invalide." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const message = String(body.message ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!name || (!message && !phone)) {
    return NextResponse.json(
      { data: null, error: "Nom et un moyen de vous recontacter sont requis." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { data: { received: true }, error: null, meta: { message: "Message reçu." } },
    { status: 201 }
  );
}
