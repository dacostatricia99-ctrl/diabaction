import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { centers, findCenter, findProduct, productStatusLabels } from "@/data/demo";
import { Icon } from "@/components/ui/Icon";
import { CoverageBadge, OpenBadge } from "@/components/ui/Badges";
import { ContactActions } from "@/components/ui/ContactActions";

export function generateStaticParams() {
  return centers.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const center = findCenter(params.slug);
  if (!center) return { title: "Centre introuvable" };
  return { title: center.name, description: center.description };
}

export default function CenterDetailPage({ params }: { params: { slug: string } }) {
  const center = findCenter(params.slug);
  if (!center) notFound();

  return (
    <div className="container-page py-8">
      <Link href="/centres" className="text-sm font-semibold text-primary">
        ← Tous les centres
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-ink">{center.name}</h1>
            <OpenBadge open={center.isOpen} />
            <CoverageBadge level={center.coverageLevel} />
            {center.handlesChildren && (
              <span className="badge bg-accent-soft text-accent">Prise en charge enfants</span>
            )}
          </div>
          <p className="mt-3 text-ink/75">{center.description}</p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info icon="map-pin" label="Adresse">{center.address}</Info>
            <Info icon="clock" label="Horaires">{center.hours}</Info>
            <Info icon="phone" label="Téléphone">{center.phone}</Info>
            <Info icon="mail" label="Email">{center.email}</Info>
          </dl>

          <section className="mt-6">
            <h2 className="text-lg font-bold text-ink">Services disponibles</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {center.services.map((s) => (
                <li key={s} className="badge bg-primary-soft text-primary">
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {center.products.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-bold text-ink">Produits à tarif solidaire</h2>
              <ul className="mt-3 space-y-2">
                {center.products.map((slug) => {
                  const p = findProduct(slug);
                  if (!p) return null;
                  return (
                    <li key={slug} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
                      <Link href={`/produits/${p.slug}`} className="font-medium text-ink hover:text-primary">
                        {p.name}
                      </Link>
                      <span className="badge-muted">{productStatusLabels[p.status]}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        {/* Colonne actions */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <h2 className="font-bold text-ink">Contact rapide</h2>
            <div className="mt-3">
              <ContactActions
                phone={center.phone}
                whatsapp={center.whatsapp}
                lat={center.lat}
                lng={center.lng}
                shareTitle={center.name}
              />
            </div>
            {/* Emplacement carte (chargée à la demande en production) */}
            <div className="mt-4 flex aspect-video items-center justify-center rounded-lg bg-primary-soft text-primary/70">
              <Icon name="map-pin" width={32} height={32} />
            </div>
            <p className="mt-2 text-xs text-ink/50">
              Coordonnées : {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-primary">
        <Icon name={icon} width={18} height={18} />
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</dt>
        <dd className="text-sm text-ink">{children}</dd>
      </div>
    </div>
  );
}
