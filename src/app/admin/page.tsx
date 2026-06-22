import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { sessionCan } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { metricsDemo, membershipRequestsDemo } from "@/data/demo";
import { listAuditLogs } from "@/lib/audit";

export default async function AdminHome() {
  const user = await requirePermission(PERMISSIONS.CENTERS_MANAGE);
  const recentAudit = await listAuditLogs(6);
  const newRequests = membershipRequestsDemo.filter((r) => r.status === "nouvelle").length;

  return (
    <div>
      <AdminPageHeader title={`Bonjour, ${user.name}`} description="Vue d'ensemble de la plateforme." />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metricsDemo.slice(0, 4).map((m) => (
          <div key={m.key} className="card p-4">
            <p className="text-2xl font-extrabold text-primary">{m.value.toLocaleString("fr-FR")}</p>
            <p className="text-sm text-ink/70">{m.label}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-bold text-ink">À traiter</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Demandes d'adhésion nouvelles</span>
              <Link href="/admin/adhesions" className="badge bg-accent-soft text-accent">{newRequests}</Link>
            </li>
          </ul>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">Activité récente (audit)</h2>
            {sessionCan(user, PERMISSIONS.AUDIT_LOGS_VIEW) && (
              <Link href="/admin/audit" className="text-xs font-semibold text-primary">Tout voir</Link>
            )}
          </div>
          {recentAudit.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">Aucune action enregistrée pour l'instant.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {recentAudit.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-2 text-ink/70">
                  <span>
                    <span className="font-semibold text-ink">{a.action}</span> · {a.entity}
                  </span>
                  <time className="text-xs text-ink/50">
                    {new Date(a.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
