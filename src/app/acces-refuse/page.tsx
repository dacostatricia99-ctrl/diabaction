import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Accès refusé", robots: { index: false } };

export default function AccesRefusePage() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-5xl font-extrabold text-accent">403</p>
      <h1 className="mt-3 text-xl font-bold text-ink">Accès refusé</h1>
      <p className="mt-2 max-w-md text-ink/70">
        Votre compte ne dispose pas des autorisations nécessaires pour accéder à cette page.
      </p>
      <Link href="/" className="btn-primary mt-6">Retour à l'accueil</Link>
    </div>
  );
}
