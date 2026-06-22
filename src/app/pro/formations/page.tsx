import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import { trainings, trainingStatusLabels } from "@/data/space";
import { fullDate, timeRange } from "@/lib/format";

export const metadata: Metadata = { title: "Formations" };

export default async function ProFormationsPage() {
  await requirePermission(PERMISSIONS.RESOURCES_VIEW_PRO, "/pro");
  const sorted = [...trainings].sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt));

  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Formations</h2>
      <p className="mt-1 text-sm text-ink/70">
        Sessions de formation continue proposées aux professionnels de santé.
      </p>

      <ul className="mt-4 space-y-3">
        {sorted.map((t) => {
          const tone =
            t.status === "ouvert"
              ? "bg-success-soft text-success"
              : t.status === "complet"
              ? "bg-accent-soft text-accent"
              : "bg-canvas text-ink/70";
          return (
            <li key={t.slug} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`badge ${tone}`}>{trainingStatusLabels[t.status]}</span>
                    <span className="badge bg-canvas text-ink/70">
                      {t.mode === "presentiel" ? "Présentiel" : "À distance"}
                    </span>
                  </div>
                  <h3 className="mt-2 font-bold text-ink">{t.title}</h3>
                  <p className="mt-1 text-sm text-ink/70">{t.summary}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/60">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="calendar" width={14} height={14} /> {fullDate(t.startsAt)} · {timeRange(t.startsAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Icon name="map-pin" width={14} height={14} /> {t.location}
                    </span>
                  </p>
                </div>
                {t.status === "ouvert" && (
                  <button type="button" className="btn-primary shrink-0">
                    S'inscrire
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
