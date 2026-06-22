// Logo Diabaction Congo — voir docs/06-design-system.md.
// Déclinaisons : symbole seul (mobile / favicon), horizontal (texte), clair / sombre.

type LogoProps = {
  variant?: "full" | "symbol";
  className?: string;
  /** Sur fond sombre : passe le texte en blanc. */
  onDark?: boolean;
};

export function LogoSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Diabaction Congo"
      className={className}
      width="48"
      height="48"
    >
      {/* Emblème circulaire bleu (étoile/soleil stylisé) */}
      <g fill="none" stroke="#1F4E79" strokeWidth="2.5" strokeLinejoin="round">
        <circle cx="24" cy="24" r="14" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 24 + Math.cos(a) * 14;
          const y1 = 24 + Math.sin(a) * 14;
          const x2 = 24 + Math.cos(a) * 21;
          const y2 = 24 + Math.sin(a) * 21;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" />;
        })}
      </g>
      {/* Goutte rouge (solidarité / santé) */}
      <path
        d="M24 15c3.6 4 6 7 6 10a6 6 0 1 1-12 0c0-3 2.4-6 6-10z"
        fill="#D94B5A"
      />
    </svg>
  );
}

export function Logo({ variant = "full", className, onDark = false }: LogoProps) {
  if (variant === "symbol") {
    return <LogoSymbol className={className} />;
  }
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoSymbol className="h-9 w-9 shrink-0" />
      <span className="leading-tight">
        <span className={`block text-lg font-extrabold ${onDark ? "text-white" : "text-primary"}`}>
          Diabaction
        </span>
        <span className={`block text-lg font-extrabold ${onDark ? "text-white" : "text-accent"}`}>
          Congo
        </span>
      </span>
    </span>
  );
}
