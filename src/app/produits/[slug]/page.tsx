import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, findProduct } from "@/data/demo";
import { Icon } from "@/components/ui/Icon";
import { ProductStatusBadge } from "@/components/ui/Badges";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = findProduct(params.slug);
  if (!product) return { title: "Produit introuvable" };
  return { title: product.name, description: product.description };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = findProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="container-page py-8">
      <Link href="/produits" className="text-sm font-semibold text-primary">
        ← Tous les produits
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div
          className="flex aspect-square items-center justify-center rounded-card bg-primary-soft text-primary"
          aria-hidden="true"
        >
          <Icon name="shield" width={64} height={64} />
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-ink">{product.name}</h1>
            <ProductStatusBadge status={product.status} />
          </div>
          <p className="mt-3 text-ink/75">{product.description}</p>

          <dl className="mt-6 space-y-4">
            <Row label="Tarif">{product.indicativePrice ?? "Tarif solidaire"}</Row>
            <Row label="Conditions d'accès">{product.accessConditions}</Row>
            <Row label="Avantage membre">{product.memberBenefit}</Row>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/centres" className="btn-primary">
              <Icon name="map-pin" width={18} height={18} /> Trouver un centre
            </Link>
            <Link href="/devenir-membre" className="btn-outline">
              Devenir membre
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line pb-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</dt>
      <dd className="mt-1 text-ink">{children}</dd>
    </div>
  );
}
