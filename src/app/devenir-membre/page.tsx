import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { contact } from "@/data/demo";
import { MembershipForm } from "./MembershipForm";

export const metadata: Metadata = {
  title: "Devenir membre",
  description:
    "Rejoignez Diabaction Congo : avantages membres, tarifs préférentiels et soutien à la lutte contre le diabète.",
};

const advantages = [
  "Tarifs préférentiels sur les produits à tarif solidaire",
  "Accès aux avantages réservés aux membres",
  "Informations et notifications ciblées",
  "Soutien à la lutte contre le diabète au Congo",
];

export default function DevenirMembrePage() {
  return (
    <>
      <PageHeader
        title="Devenir membre"
        subtitle="Soutenez la mission de Diabaction Congo et bénéficiez d'avantages dédiés."
      />
      <div className="container-page grid gap-8 py-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-extrabold text-ink">Notre mission</h2>
          <p className="mt-2 text-ink/75">
            Diabaction Congo agit pour la prévention, le dépistage et l'accompagnement des personnes
            vivant avec le diabète en République du Congo.
          </p>

          <h2 className="mt-6 text-lg font-extrabold text-ink">Les avantages de l'adhésion</h2>
          <ul className="mt-3 space-y-2">
            {advantages.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-ink/80">
                <span className="mt-0.5 text-success">
                  <Icon name="check" width={18} height={18} />
                </span>
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-6 card bg-primary-soft p-5">
            <h3 className="font-bold text-primary">Cotisation</h3>
            <p className="mt-1 text-sm text-ink/75">{contact.membershipFee}.</p>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-extrabold text-ink">Demande d'adhésion</h2>
          <MembershipForm />
        </div>
      </div>
    </>
  );
}
