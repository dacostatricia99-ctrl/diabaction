import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { listProducts } from "@/lib/repo/products";
import { ProductsAdminTable } from "./ProductsAdminTable";

export const metadata = { title: "Produits" };

export default async function AdminProduitsPage() {
  await requirePermission(PERMISSIONS.PRODUCTS_MANAGE);
  const products = await listProducts();
  return (
    <div>
      <AdminPageHeader
        title="Produits à tarif solidaire"
        description="Catalogue. Le stock exact n'est jamais affiché — seul le statut de disponibilité. Chaque action est auditée."
        action={
          <Link href="/admin/produits/nouveau" className="btn-primary">
            Nouveau produit
          </Link>
        }
      />
      <ProductsAdminTable initial={products} />
    </div>
  );
}
