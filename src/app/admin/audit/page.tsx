import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { listAuditLogs } from "@/lib/audit";

export const metadata = { title: "Journal d'audit" };

// Réservé SUPER_ADMIN (audit_logs.view).
export default async function AdminAuditPage() {
  await requirePermission(PERMISSIONS.AUDIT_LOGS_VIEW);
  const logs = await listAuditLogs(200);

  return (
    <div>
      <AdminPageHeader
        title="Journal d'audit"
        description="Toutes les actions administratives (connexion, archivage, changement de statut, export…)."
      />
      {logs.length === 0 ? (
        <div className="card p-6 text-sm text-ink/60">
          Aucune action enregistrée pour l'instant. Connectez-vous puis archivez un centre ou changez
          le statut d'un événement pour voir apparaître des entrées.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Horodatage</th>
                <th className="px-4 py-3">Acteur</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entité</th>
                <th className="px-4 py-3">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 text-ink/70">{new Date(l.createdAt).toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-3 text-ink/70">{l.actorName ?? l.actorId ?? "—"}</td>
                  <td className="px-4 py-3"><span className="badge bg-primary-soft text-primary">{l.action}</span></td>
                  <td className="px-4 py-3 text-ink/70">{l.entity}{l.entityId ? ` · ${l.entityId}` : ""}</td>
                  <td className="px-4 py-3 text-ink/60">{l.changes ? JSON.stringify(l.changes) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
