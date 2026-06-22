import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { contact } from "@/data/demo";
import { mailLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Confidentialité & protection des données",
  description:
    "Comment Diabaction Congo protège vos données personnelles : finalités, base légale, cookies, durée de conservation et vos droits.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-6 first:border-0 first:pt-0">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-2 space-y-2 text-sm text-ink/75">{children}</div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader
        title="Confidentialité & protection des données"
        subtitle="La protection de vos données, en particulier les données de santé, est une priorité."
      />
      <div className="container-page max-w-3xl py-8">
        <Section title="Responsable du traitement">
          <p>
            L'association <strong>Diabaction Congo</strong> est responsable du traitement des données
            collectées via cette plateforme. Pour toute question, écrivez à{" "}
            <a href={mailLink(contact.email)} className="text-primary hover:underline">{contact.email}</a>.
          </p>
        </Section>

        <Section title="Données collectées">
          <ul className="list-disc space-y-1 pl-5">
            <li>Demande de contact ou d'adhésion : nom, prénom, téléphone, ville, message.</li>
            <li>Compte connecté (membre, professionnel, partenaire) : identité, coordonnées, rôle.</li>
            <li>Journal d'audit : actions administratives (horodatage, acteur, action) à des fins de sécurité.</li>
            <li>Un cookie de session technique, strictement nécessaire à l'authentification.</li>
          </ul>
          <p>
            Aucune donnée médicale individuelle n'est exposée aux partenaires : ils n'accèdent qu'à des
            <strong> indicateurs agrégés</strong>, jamais nominatifs.
          </p>
        </Section>

        <Section title="Finalités & base légale">
          <p>
            Les données servent à fournir le service (orientation vers les centres, adhésion, espaces
            connectés), à assurer la sécurité de la plateforme et à mesurer l'impact de manière agrégée.
            La base légale est l'intérêt légitime de l'association, le consentement (formulaires) et
            l'exécution de la relation d'adhésion.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            La plateforme n'utilise <strong>aucun cookie publicitaire ni traceur tiers</strong>. Seul un
            cookie de session <code>httpOnly</code> est déposé lors de la connexion ; il expire
            automatiquement et peut être supprimé en vous déconnectant.
          </p>
        </Section>

        <Section title="Durée de conservation">
          <p>
            Les données sont conservées le temps nécessaire à la finalité poursuivie, puis archivées ou
            supprimées. Les demandes non abouties sont supprimées à l'issue d'un délai raisonnable.
          </p>
        </Section>

        <Section title="Sécurité">
          <p>
            Accès strictement contrôlé par rôles (RBAC), transport chiffré (HTTPS), cloisonnement des
            données partenaires en agrégats, et journal d'audit de toute action administrative.
          </p>
        </Section>

        <Section title="Vos droits">
          <p>
            Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos
            données. Pour l'exercer, contactez l'association à{" "}
            <a href={mailLink(contact.email)} className="text-primary hover:underline">{contact.email}</a>.
          </p>
        </Section>
      </div>
    </>
  );
}
