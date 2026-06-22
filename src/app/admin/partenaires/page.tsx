import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { listPartners } from "@/lib/repo/partners";
import { PartnersAdminTable } from "./PartnersAdminTable";

export const metadata = { title: "Partenaires" };

export default async function AdminPartenairesPage() {
  await requirePermission(PERMISSIONS.PARTNERS_MANAGE);
  const partners = await listPartners();
  return (
    <div>
      <AdminPageHeader
        title="Partenaires"
        description="Comptes partenaires institutionnels : accès aux tableaux de bord agrégés et exports. Chaque action est auditée."
        action={
          <button type="button" className="btn-primary" disabled>
            Nouveau partenaire
          </button>
        }
      />
      <PartnersAdminTable initial={partners} />
      <p className="mt-4 text-xs text-ink/50">
        Les partenaires ne consultent que des données agrégées (jamais nominatives ou médicales
        individuelles).
      </p>
    </div>
  );
}
