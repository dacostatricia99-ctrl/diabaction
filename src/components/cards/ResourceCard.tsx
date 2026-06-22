import Link from "next/link";
import type { Resource } from "@/data/demo";
import { resourceCategoryLabels, resourceFormatLabels } from "@/data/demo";
import { Icon } from "@/components/ui/Icon";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-center gap-2">
        <span className="badge bg-primary-soft text-primary">{resourceCategoryLabels[resource.category]}</span>
        <span className="badge-muted">{resourceFormatLabels[resource.format]}</span>
      </div>
      <h3 className="mt-3 font-bold text-ink">
        <Link href={`/ressources/${resource.slug}`} className="hover:text-primary">
          {resource.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-3 text-sm text-ink/70">{resource.summary}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-ink/60">
        {resource.readingTime && (
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" width={14} height={14} /> {resource.readingTime}
          </span>
        )}
        {resource.availableOffline && (
          <span className="inline-flex items-center gap-1 text-success">
            <Icon name="check" width={14} height={14} /> Disponible hors ligne
          </span>
        )}
      </div>
    </article>
  );
}
