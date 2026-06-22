import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader, ModulePlaceholder } from "@/components/admin/AdminPage";

export const metadata = { title: "Programme enfants" };

export default async function AdminProgrammesEnfantsPage() {
  await requirePermission(PERMISSIONS.CHILDREN_PROGRAM_MANAGE);
  return (
    <div>
      <AdminPageHeader
        title="Programme enfants"
        description="Édition du contenu, critères, documents requis, FAQ et centres participants."
      />
      <ModulePlaceholder note="Gestion du programme enfants 0–18 ans (national, capacité renforcée à Brazzaville)." />
    </div>
  );
}
