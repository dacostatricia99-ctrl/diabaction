import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { departments } from "@/data/demo";
import { countSubscriptions } from "@/lib/repo/push";
import { NotificationSender } from "./NotificationSender";

export const metadata = { title: "Notifications" };

export default async function AdminNotificationsPage() {
  await requirePermission(PERMISSIONS.NOTIFICATIONS_SEND);
  const total = await countSubscriptions();

  return (
    <div>
      <AdminPageHeader
        title="Notifications push"
        description={`Diffusez une notification aux abonnés. Ciblage possible par département ou par thème. Chaque envoi est audité. (${total} abonnement${total > 1 ? "s" : ""} actif${total > 1 ? "s" : ""})`}
      />
      <NotificationSender departments={departments} />
    </div>
  );
}
