import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { EntityForm } from "@/components/admin/EntityForm";
import { productFields } from "@/lib/adminForms";

export const metadata = { title: "Nouveau produit" };

export default async function NouveauProduitPage() {
  await requirePermission(PERMISSIONS.PRODUCTS_MANAGE);
  return (
    <div>
      <AdminPageHeader
        title="Nouveau produit"
        description="Le stock exact n'est jamais saisi — seulement le statut de disponibilité. Action auditée."
      />
      <EntityForm
        fields={productFields}
        initial={{ status: "disponible", indicativePrice: "Tarif solidaire" }}
        method="POST"
        action="/api/v1/admin/products"
        backTo="/admin/produits"
        submitLabel="Créer le produit"
      />
    </div>
  );
}
