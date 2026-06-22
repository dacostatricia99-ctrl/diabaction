import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { listCenters } from "@/lib/repo/centers";
import { CentersAdminTable } from "./CentersAdminTable";

export const metadata = { title: "Centres" };

export default async function AdminCentresPage() {
  await requirePermission(PERMISSIONS.CENTERS_MANAGE);
  const centers = await listCenters();
  return (
    <div>
      <AdminPageHeader
        title="Centres"
        description="Gérez les centres : modification, archivage (suppression logique). Chaque action est auditée."
        action={
          <Link href="/admin/centres/nouveau" className="btn-primary">
            Nouveau centre
          </Link>
        }
      />
      <CentersAdminTable initial={centers} />
    </div>
  );
}
