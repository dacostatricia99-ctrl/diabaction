import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductsExplorer } from "./ProductsExplorer";

export const metadata: Metadata = {
  title: "Produits à tarif solidaire",
  description:
    "Insuline, bandelettes, glucomètres et consommables accessibles à tous selon un modèle de tarif solidaire. Avantage membre.",
};

export default function ProduitsPage() {
  return (
    <>
      <PageHeader
        title="Produits à tarif solidaire"
        subtitle="Des produits accessibles à tous. Les membres bénéficient de tarifs préférentiels."
      />
      <div className="container-page py-8">
        <ProductsExplorer />
      </div>
    </>
  );
}
