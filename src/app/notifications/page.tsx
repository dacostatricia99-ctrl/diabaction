import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PushOptIn } from "@/components/push/PushOptIn";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Activez les notifications pour être informé des dépistages, événements et nouveautés de Diabaction Congo.",
};

export default function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="Rester informé"
        subtitle="Recevez les dépistages, événements et nouveautés directement sur votre appareil. Désactivable à tout moment."
      />
      <div className="container-page max-w-xl py-8">
        <PushOptIn />
        <p className="mt-4 text-xs text-ink/50">
          Les notifications nécessitent votre autorisation. Nous n'envoyons aucune information commerciale.
          Voir notre politique de <a href="/confidentialite" className="text-primary hover:underline">confidentialité</a>.
        </p>
      </div>
    </>
  );
}
