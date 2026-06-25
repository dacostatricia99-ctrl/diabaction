// Logo Diabaction Congo — image officielle (emblème + texte), fond blanc.
// Utilisé sur fond clair (en-tête public, admin, espaces connectés, pied de page).

export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-diabaction.png"
      alt="Diabaction Congo"
      width={700}
      height={466}
      className={`h-11 w-auto ${className ?? ""}`}
    />
  );
}
