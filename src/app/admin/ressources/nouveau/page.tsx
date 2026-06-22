import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { EntityForm } from "@/components/admin/EntityForm";
import { resourceFields } from "@/lib/adminForms";

export const metadata = { title: "Nouvelle ressource" };

export default async function NouvelleRessourcePage() {
  await requirePermission(PERMISSIONS.RESOURCES_MANAGE);
  return (
    <div>
      <AdminPageHeader title="Nouvelle ressource" description="Ajoutez une ressource éducative. Action auditée." />
      <EntityForm
        fields={resourceFields}
        initial={{ format: "article", availableOffline: false }}
        method="POST"
        action="/api/v1/admin/resources"
        backTo="/admin/ressources"
        submitLabel="Créer la ressource"
      />
    </div>
  );
}
