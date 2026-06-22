import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader, ModulePlaceholder } from "@/components/admin/AdminPage";

export const metadata = { title: "Paramètres" };

// Réservé SUPER_ADMIN (platform.configure).
export default async function AdminParametresPage() {
  await requirePermission(PERMISSIONS.PLATFORM_CONFIGURE);
  return (
    <div>
      <AdminPageHeader title="Paramètres" description="Configuration de la plateforme (réservé au super-administrateur)." />
      <ModulePlaceholder note="Coordonnées de contact, langues, intégrations, et configuration des notifications push (version future)." />
    </div>
  );
}
