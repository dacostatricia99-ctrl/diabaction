import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-5xl font-extrabold text-primary">404</p>
      <h1 className="mt-3 text-xl font-bold text-ink">Page introuvable</h1>
      <p className="mt-2 text-ink/70">La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link href="/" className="btn-primary mt-6">
        Retour à l'accueil
      </Link>
    </div>
  );
}
