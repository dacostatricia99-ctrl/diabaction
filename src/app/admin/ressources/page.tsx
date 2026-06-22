import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { listResources } from "@/lib/repo/resources";
import { ResourcesAdminTable } from "./ResourcesAdminTable";

export const metadata = { title: "Ressources" };

export default async function AdminRessourcesPage() {
  await requirePermission(PERMISSIONS.RESOURCES_MANAGE);
  const resources = await listResources();
  return (
    <div>
      <AdminPageHeader
        title="Ressources éducatives"
        description="Articles, vidéos, infographies et PDF. Publication et gestion éditoriale. Chaque action est auditée."
        action={
          <Link href="/admin/ressources/nouveau" className="btn-primary">
            Nouvelle ressource
          </Link>
        }
      />
      <ResourcesAdminTable initial={resources} />
    </div>
  );
}
