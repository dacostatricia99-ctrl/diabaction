import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { listAllEvents } from "@/lib/repo/events";
import { EventsAdminTable } from "./EventsAdminTable";

export const metadata = { title: "Événements" };

export default async function AdminEvenementsPage() {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);
  const events = await listAllEvents();
  return (
    <div>
      <AdminPageHeader
        title="Événements"
        description="Cycle de vie : brouillon → publié → terminé / annulé. Le changement de statut est audité."
        action={
          <Link href="/admin/evenements/nouveau" className="btn-primary">
            Nouvel événement
          </Link>
        }
      />
      <EventsAdminTable initial={events} />
    </div>
  );
}
