import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ActionCards } from "@/components/home/ActionCards";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CenterCard } from "@/components/cards/CenterCard";
import { EventRow } from "@/components/cards/EventRow";
import { ProductCard } from "@/components/cards/ProductCard";
import { products, valueProps } from "@/data/demo";
import { listCenters } from "@/lib/repo/centers";
import { listPublishedEvents } from "@/lib/repo/events";

const valueIcons = ["shield", "heart", "users", "graduation"] as const;

export default async function HomePage() {
  const [centers, published] = await Promise.all([listCenters(), listPublishedEvents()]);
  const nextEvents = published.slice(0, 3);
  const nearbyCenter = centers[0];

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-b from-primary-soft to-canvas">
        <div className="container-page grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Ensemble contre le diabète en{" "}
              <span className="text-primary">République du Congo</span>
            </h1>
            <p className="mt-4 max-w-lg text-ink/75">
              Prévenir, dépister, accompagner et améliorer la qualité de vie des personnes vivant
              avec le diabète.
            </p>
            <div className="mt-6">
              <Link href="/centres" className="btn-primary">
                <Icon name="map-pin" width={20} height={20} />
                Trouver un centre près de moi
              </Link>
            </div>
          </div>

          {/* Carte flottante « Programme enfants » avec bandeau rouge */}
          <div className="lg:justify-self-end">
            <div className="card max-w-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon name="users" width={24} height={24} />
                  </span>
                  <h2 className="font-extrabold text-ink">
                    Programme enfants
                    <span className="block text-sm font-semibold text-ink/70">0 – 18 ans</span>
                  </h2>
                </div>
                <p className="mt-3 text-sm text-ink/75">
                  Prise en charge gratuite et accompagnement dédié.
                </p>
                <Link
                  href="/programme-enfants"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                >
                  En savoir plus <Icon name="arrow" width={16} height={16} />
                </Link>
              </div>
              <p className="bg-accent px-5 py-3 text-sm font-medium text-white">
                Programme national avec une capacité renforcée à Brazzaville.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 ACTIONS PRIORITAIRES */}
      <section className="container-page -mt-2 py-6">
        <ActionCards />
      </section>

      {/* 3 COLONNES */}
      <section className="container-page grid gap-6 py-6 lg:grid-cols-3">
        <div>
          <SectionHeading title="Centres proches de vous" href="/centres" linkLabel="Voir tous les centres" />
          {nearbyCenter && <CenterCard center={nearbyCenter} />}
        </div>

        <div className="card p-5">
          <SectionHeading title="Prochains dépistages" href="/evenements" linkLabel="Voir le calendrier" />
          <div>
            {nextEvents.map((e) => (
              <EventRow key={e.slug} event={e} />
            ))}
          </div>
          <Link
            href="/evenements"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            Voir tous les événements <Icon name="arrow" width={16} height={16} />
          </Link>
        </div>

        <div>
          <SectionHeading title="Produits à tarif solidaire" href="/produits" linkLabel="Voir tous les produits" />
          <div className="space-y-3">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* BANDE VALEURS */}
      <section className="bg-primary-soft">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((v, i) => (
            <div key={v.title} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                <Icon name={valueIcons[i]} width={22} height={22} />
              </span>
              <div>
                <h3 className="font-bold text-ink">{v.title}</h3>
                <p className="text-sm text-ink/70">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
