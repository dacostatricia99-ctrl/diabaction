import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Diabaction Congo : association de lutte contre le diabète en République du Congo. Prévention, dépistage, éducation et accompagnement.",
};

const missions = [
  "Prévention du diabète",
  "Dépistage en zones urbaines et rurales",
  "Éducation thérapeutique",
  "Promotion de l'activité physique",
  "Sensibilisation en milieu scolaire",
  "Formation des professionnels de santé",
  "Organisation d'événements communautaires",
  "Création de centres spécialisés",
  "Programmes dédiés aux enfants diabétiques",
  "Collecte d'indicateurs épidémiologiques",
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        title="À propos de Diabaction Congo"
        subtitle="Une association engagée contre le diabète en République du Congo."
      />
      <div className="container-page py-8">
        <p className="max-w-2xl text-ink/75">
          Diabaction Congo œuvre pour prévenir, dépister et accompagner les personnes vivant avec le
          diabète, et améliorer leur qualité de vie sur l'ensemble du territoire.
        </p>

        <h2 className="mt-8 text-lg font-extrabold text-ink">Nos missions</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {missions.map((m) => (
            <li key={m} className="flex items-start gap-2 text-sm text-ink/80">
              <span className="mt-0.5 text-primary">
                <Icon name="check" width={18} height={18} />
              </span>
              {m}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/devenir-membre" className="btn-accent">Devenir membre</Link>
          <Link href="/contact" className="btn-outline">Nous contacter</Link>
        </div>
      </div>
    </>
  );
}
