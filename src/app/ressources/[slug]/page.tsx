import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resources, findResource, resourceCategoryLabels, resourceFormatLabels } from "@/data/demo";
import { Icon } from "@/components/ui/Icon";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const resource = findResource(params.slug);
  if (!resource) return { title: "Ressource introuvable" };
  return { title: resource.title, description: resource.summary };
}

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const resource = findResource(params.slug);
  if (!resource) notFound();

  return (
    <div className="container-page max-w-3xl py-8">
      <Link href="/ressources" className="text-sm font-semibold text-primary">
        ← Toutes les ressources
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="badge bg-primary-soft text-primary">{resourceCategoryLabels[resource.category]}</span>
        <span className="badge-muted">{resourceFormatLabels[resource.format]}</span>
        {resource.availableOffline && (
          <span className="badge-success inline-flex items-center gap-1">
            <Icon name="check" width={14} height={14} /> Hors ligne
          </span>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-extrabold text-ink">{resource.title}</h1>
      <p className="mt-3 text-lg text-ink/75">{resource.summary}</p>

      <div className="mt-6 rounded-card bg-white p-6 text-ink/80 shadow-card">
        <p>
          Le contenu détaillé de cette ressource ({resourceFormatLabels[resource.format].toLowerCase()})
          sera affiché ici. Dans la version connectée à l'API, l'article, la vidéo, l'infographie ou
          le PDF est chargé depuis la base de ressources éducatives.
        </p>
        <p className="mt-3">
          Pour toute question, vous pouvez{" "}
          <Link href="/contact" className="font-semibold text-primary">
            contacter l'association
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
