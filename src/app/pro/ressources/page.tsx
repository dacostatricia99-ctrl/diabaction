import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/guards";
import { sessionCan } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import { proResources } from "@/data/space";
import { fullDate } from "@/lib/format";

export const metadata: Metadata = { title: "Ressources pro" };

const formatLabels: Record<string, string> = { pdf: "PDF", article: "Article", video: "Vidéo" };

export default async function ProRessourcesPage() {
  const user = await requirePermission(PERMISSIONS.RESOURCES_VIEW_PRO, "/pro");
  const canDownload = sessionCan(user, PERMISSIONS.RESOURCES_DOWNLOAD_VALIDATED);

  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Ressources professionnelles</h2>
      <p className="mt-1 text-sm text-ink/70">
        Documents réservés aux professionnels de santé. Les documents validés sont téléchargeables.
      </p>

      <ul className="mt-4 space-y-3">
        {proResources.map((r) => (
          <li key={r.slug} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge bg-canvas text-ink/70">{r.category}</span>
                  <span className="badge bg-canvas text-ink/70">{formatLabels[r.format] ?? r.format}</span>
                  {r.validated ? (
                    <span className="badge bg-success-soft text-success">
                      <Icon name="check" width={14} height={14} /> Validé
                    </span>
                  ) : (
                    <span className="badge bg-accent-soft text-accent">En cours de validation</span>
                  )}
                </div>
                <h3 className="mt-2 font-bold text-ink">{r.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{r.summary}</p>
                <p className="mt-1 text-xs text-ink/50">Mis à jour le {fullDate(r.updatedAt)}</p>
              </div>
            </div>
            <div className="mt-3">
              {r.validated && canDownload ? (
                <button type="button" className="btn-outline">
                  <Icon name="book" width={18} height={18} /> Télécharger
                </button>
              ) : (
                <span className="text-xs text-ink/50">
                  {r.validated ? "Téléchargement non autorisé pour votre rôle." : "Document indisponible au téléchargement."}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
