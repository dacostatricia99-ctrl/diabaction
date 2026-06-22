import Link from "next/link";

export function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      {href && (
        <Link href={href} className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink/80 hover:text-primary">
          {linkLabel ?? "Voir tout"}
        </Link>
      )}
    </div>
  );
}
