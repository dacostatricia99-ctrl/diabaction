import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS, ROLE_LABELS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { demoUsers } from "@/lib/auth/users";

export const metadata = { title: "Utilisateurs" };

// Réservé SUPER_ADMIN (users.manage).
export default async function AdminUtilisateursPage() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);
  return (
    <div>
      <AdminPageHeader
        title="Utilisateurs"
        description="Gestion des comptes et attribution des rôles (réservé au super-administrateur)."
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {demoUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-ink">{u.fullName}</td>
                <td className="px-4 py-3 text-ink/70">{u.email}</td>
                <td className="px-4 py-3 text-ink/70">{u.roles.map((r) => ROLE_LABELS[r]).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
