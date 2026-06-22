import { coverageLabels, productStatusLabels, type CoverageLevel, type ProductStatus } from "@/data/demo";

export function CoverageBadge({ level }: { level: CoverageLevel }) {
  const tone =
    level === "complete"
      ? "bg-success-soft text-success"
      : level === "partielle"
        ? "bg-primary-soft text-primary"
        : "bg-canvas text-ink/70";
  return <span className={`badge ${tone}`}>{coverageLabels[level]}</span>;
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const tone =
    status === "disponible"
      ? "bg-success-soft text-success"
      : status === "stock_limite"
        ? "bg-accent-soft text-accent"
        : "bg-canvas text-ink/60";
  // Pas de quantité : seul le statut est affiché.
  return <span className={`badge ${tone}`}>{productStatusLabels[status]}</span>;
}

export function OpenBadge({ open }: { open: boolean }) {
  return open ? (
    <span className="badge-success">Ouvert</span>
  ) : (
    <span className="badge-muted">Fermé</span>
  );
}

export function UpcomingBadge() {
  return <span className="badge-success">À venir</span>;
}
