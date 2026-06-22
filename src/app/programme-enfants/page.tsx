import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { childrenProgram, findCenter } from "@/data/demo";

export const metadata: Metadata = {
  title: "Programme enfants 0–18 ans",
  description:
    "Programme national de prise en charge des enfants diabétiques (0–18 ans), avec une capacité renforcée à Brazzaville.",
};

export default function ProgrammeEnfantsPage() {
  const p = childrenProgram;
  return (
    <>
      <PageHeader eyebrow="Programme enfants" title={p.title} subtitle={p.presentation} />

      <div className="container-page py-8">
        {/* Message obligatoire */}
        <p className="mb-8 rounded-card bg-accent px-5 py-4 font-semibold text-white">
          {p.notice}
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <Block title="Critères d'éligibilité" items={p.eligibilityCriteria} icon="check" />
          <Block title="Services inclus" items={p.includedServices} icon="check" />
          <Block title="Procédure d'inscription" items={p.registrationProcedure} ordered icon="arrow" />
          <Block title="Documents requis" items={p.requiredDocuments} icon="book" />
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-extrabold text-ink">Centres participants</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {p.participatingCenters.map((slug) => {
              const c = findCenter(slug);
              if (!c) return null;
              return (
                <li key={slug} className="card p-4">
                  <Link href={`/centres/${c.slug}`} className="font-bold text-ink hover:text-primary">
                    {c.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink/70">{c.address}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-extrabold text-ink">Questions fréquentes</h2>
          <div className="mt-3 space-y-3">
            {p.faq.map((item) => (
              <details key={item.q} className="card p-4">
                <summary className="cursor-pointer font-semibold text-ink">{item.q}</summary>
                <p className="mt-2 text-sm text-ink/70">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">
            <Icon name="phone" width={18} height={18} /> Contacter l'association
          </Link>
          <Link href="/centres" className="btn-outline">
            Voir les centres
          </Link>
        </div>
      </div>
    </>
  );
}

function Block({
  title,
  items,
  ordered,
  icon,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
  icon: string;
}) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <ListTag className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-ink/80">
            <span className="mt-0.5 text-primary">
              <Icon name={icon} width={16} height={16} />
            </span>
            {it}
          </li>
        ))}
      </ListTag>
    </section>
  );
}
