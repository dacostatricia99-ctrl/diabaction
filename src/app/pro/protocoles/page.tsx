import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import { protocols } from "@/data/space";
import { fullDate } from "@/lib/format";

export const metadata: Metadata = { title: "Protocoles" };

export default async function ProProtocolesPage() {
  await requirePermission(PERMISSIONS.PROTOCOLS_VIEW, "/pro");

  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Protocoles cliniques</h2>
      <p className="mt-1 text-sm text-ink/70">
        Conduites à tenir validées. Référez-vous toujours à la dernière version en vigueur.
      </p>

      <ul className="mt-4 space-y-3">
        {protocols.map((p) => (
          <li key={p.slug} className="card flex items-start gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Icon name="shield" width={20} height={20} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-canvas text-ink/70">
                  {p.level === "national" ? "National" : "Centre"}
                </span>
                <span className="badge bg-canvas text-ink/70">{p.reference}</span>
              </div>
              <h3 className="mt-2 font-bold text-ink">{p.title}</h3>
              <p className="mt-1 text-sm text-ink/70">{p.summary}</p>
              <p className="mt-1 text-xs text-ink/50">Mis à jour le {fullDate(p.updatedAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
