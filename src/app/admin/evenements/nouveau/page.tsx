import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { EntityForm } from "@/components/admin/EntityForm";
import { eventFields } from "@/lib/adminForms";

export const metadata = { title: "Nouvel événement" };

export default async function NouvelEvenementPage() {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);
  return (
    <div>
      <AdminPageHeader title="Nouvel événement" description="Créez un dépistage ou un événement. Action auditée." />
      <EntityForm
        fields={eventFields}
        initial={{ status: "brouillon" }}
        method="POST"
        action="/api/v1/admin/events"
        backTo="/admin/evenements"
        submitLabel="Créer l'événement"
      />
    </div>
  );
}
