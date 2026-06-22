import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { listCenters } from "@/lib/repo/centers";
import { CentersExplorer } from "./CentersExplorer";

export const metadata: Metadata = {
  title: "Trouver un centre",
  description:
    "Localisez les centres de prise en charge du diabète en République du Congo : recherche par ville, département et service.",
};

export default async function CentresPage() {
  const centers = await listCenters();
  return (
    <>
      <PageHeader
        title="Trouver un centre"
        subtitle="Recherchez un centre par ville, département ou service. Appelez, ouvrez WhatsApp ou obtenez un itinéraire en un clic."
      />
      <div className="container-page py-8">
        <CentersExplorer centers={centers} />
      </div>
    </>
  );
}
