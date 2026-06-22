import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default function ConnexionPage() {
  return (
    <>
      <PageHeader title="Connexion" subtitle="Espace réservé aux membres, professionnels, partenaires et administrateurs." />
      <div className="container-page max-w-md py-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <details className="mt-6 rounded-card border border-line bg-white p-4 text-sm text-ink/70">
          <summary className="cursor-pointer font-semibold text-ink">Comptes de démonstration</summary>
          <ul className="mt-2 space-y-1">
            <li><code>super@diabaction.cg</code> / <code>Super1234!</code> — super-admin</li>
            <li><code>admin@diabaction.cg</code> / <code>Admin1234!</code> — admin</li>
            <li><code>membre@diabaction.cg</code> / <code>Membre1234!</code> — membre</li>
            <li><code>pro@diabaction.cg</code> / <code>Pro1234!</code> — professionnel de santé</li>
            <li><code>partenaire@diabaction.cg</code> / <code>Partenaire1234!</code> — partenaire</li>
          </ul>
        </details>
      </div>
    </>
  );
}
