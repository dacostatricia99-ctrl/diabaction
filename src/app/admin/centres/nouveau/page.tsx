import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { EntityForm } from "@/components/admin/EntityForm";
import { centerFields } from "@/lib/adminForms";

export const metadata = { title: "Nouveau centre" };

export default async function NouveauCentrePage() {
  await requirePermission(PERMISSIONS.CENTERS_MANAGE);
  return (
    <div>
      <AdminPageHeader title="Nouveau centre" description="Renseignez les informations du centre. Action auditée." />
      <EntityForm
        fields={centerFields}
        initial={{ isOpen: true, handlesChildren: false }}
        method="POST"
        action="/api/v1/admin/centers"
        backTo="/admin/centres"
        submitLabel="Créer le centre"
      />
    </div>
  );
}
