import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { EntityForm } from "@/components/admin/EntityForm";
import { productFields } from "@/lib/adminForms";
import { getProduct } from "@/lib/repo/products";

export const metadata = { title: "Modifier le produit" };

export default async function ModifierProduitPage({ params }: { params: { slug: string } }) {
  await requirePermission(PERMISSIONS.PRODUCTS_MANAGE);
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader title="Modifier le produit" description={product.name} />
      <EntityForm
        fields={productFields}
        initial={{ ...product, indicativePrice: product.indicativePrice ?? "" }}
        method="PUT"
        action={`/api/v1/admin/products/${product.slug}`}
        backTo="/admin/produits"
        submitLabel="Enregistrer"
      />
    </div>
  );
}
