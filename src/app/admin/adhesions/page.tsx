import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { membershipRequestsDemo, requestStatusLabels } from "@/data/demo";

export const metadata = { title: "Adhésions" };

const tone: Record<string, string> = {
  nouvelle: "bg-accent-soft text-accent",
  en_traitement: "bg-primary-soft text-primary",
  acceptee: "bg-success-soft text-success",
  refusee: "bg-canvas text-ink/60",
};

export default async function AdminAdhesionsPage() {
  await requirePermission(PERMISSIONS.MEMBERSHIP_REQUESTS_MANAGE);
  return (
    <div>
      <AdminPageHeader
        title="Demandes d'adhésion"
        description="Traitement des demandes : nouvelle → en traitement → acceptée / refusée."
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Demandeur</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Reçue le</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {membershipRequestsDemo.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium text-ink">{r.firstName} {r.lastName}</td>
                <td className="px-4 py-3 text-ink/70">{r.phone}</td>
                <td className="px-4 py-3 text-ink/70">{r.city}</td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${tone[r.status]}`}>{requestStatusLabels[r.status]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
