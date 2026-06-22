import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS, ROLES, ROLE_LABELS, ROLE_PERMISSIONS, type RoleKey } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";

export const metadata = { title: "Rôles & permissions" };

// Réservé SUPER_ADMIN (roles.manage).
export default async function AdminRolesPage() {
  await requirePermission(PERMISSIONS.ROLES_MANAGE);
  const roleKeys = Object.values(ROLES) as RoleKey[];
  const permKeys = Object.values(PERMISSIONS);

  return (
    <div>
      <AdminPageHeader
        title="Rôles & permissions"
        description="Matrice RBAC (source de vérité). L'admin ne gère ni les rôles ni les utilisateurs — réservé au super-administrateur."
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line uppercase tracking-wide text-ink/50">
            <tr>
              <th className="sticky left-0 bg-white px-3 py-3">Permission</th>
              {roleKeys.map((r) => (
                <th key={r} className="px-2 py-3 text-center" title={ROLE_LABELS[r]}>
                  {ROLE_LABELS[r].split(" ")[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {permKeys.map((p) => (
              <tr key={p}>
                <td className="sticky left-0 bg-white px-3 py-2 font-mono text-ink/80">{p}</td>
                {roleKeys.map((r) => (
                  <td key={r} className="px-2 py-2 text-center">
                    {ROLE_PERMISSIONS[r].includes(p) ? (
                      <span className="text-success">●</span>
                    ) : (
                      <span className="text-line">·</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
