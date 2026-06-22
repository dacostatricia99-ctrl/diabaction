import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { EntityForm } from "@/components/admin/EntityForm";
import { eventFields } from "@/lib/adminForms";
import { getEvent } from "@/lib/repo/events";

export const metadata = { title: "Modifier l'événement" };

// ISO → valeur d'un <input type="datetime-local"> ("YYYY-MM-DDTHH:mm").
const toLocalInput = (iso?: string) => (iso ? iso.slice(0, 16) : "");

export default async function ModifierEvenementPage({ params }: { params: { slug: string } }) {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);
  const event = await getEvent(params.slug);
  if (!event) notFound();

  return (
    <div>
      <AdminPageHeader title="Modifier l'événement" description={event.title} />
      <EntityForm
        fields={eventFields}
        initial={{
          ...event,
          startsAt: toLocalInput(event.startsAt),
          endsAt: toLocalInput(event.endsAt),
          capacity: event.capacity ?? "",
        }}
        method="PUT"
        action={`/api/v1/admin/events/${event.slug}`}
        backTo="/admin/evenements"
        submitLabel="Enregistrer"
      />
    </div>
  );
}
