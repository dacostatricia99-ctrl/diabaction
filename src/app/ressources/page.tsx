import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ResourcesExplorer } from "./ResourcesExplorer";

export const metadata: Metadata = {
  title: "Ressources éducatives",
  description:
    "Articles, vidéos, infographies et PDF pour mieux vivre avec le diabète : nutrition, activité physique, prévention et plus.",
};

export default function RessourcesPage() {
  return (
    <>
      <PageHeader
        title="Ressources & conseils"
        subtitle="S'informer pour mieux vivre avec le diabète. Certaines ressources sont disponibles hors ligne."
      />
      <div className="container-page py-8">
        <ResourcesExplorer />
      </div>
    </>
  );
}
