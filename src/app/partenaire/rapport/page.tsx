import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { Icon } from "@/components/ui/Icon";
import {
  impactKpis,
  departmentRows,
  departmentsCovered,
  periods,
  isPeriodKey,
  type PeriodKey,
} from "@/data/impact";
import { KpiGrid } from "@/components/impact/KpiGrid";
import { DepartmentTable } from "@/components/impact/DepartmentTable";
import { PrintButton } from "@/components/impact/PrintButton";

export const metadata: Metadata = { title: "Rapport d'impact" };

export default async function PartenaireRapportPage({
  searchParams,
}: {
  searchParams: { periode?: string; departement?: string };
}) {
  const user = await requirePermission(PERMISSIONS.REPORTS_EXPORT, "/partenaire");

  const period: PeriodKey = isPeriodKey(searchParams.periode) ? searchParams.periode : "12m";
  const department =
    searchParams.departement && departmentsCovered.includes(searchParams.departement as never)
      ? searchParams.departement
      : "all";

  // La consultation du rapport exportable est auditée.
  await addAuditLog({
    actorId: user.id,
    actorName: user.name,
    action: "export",
    entity: "reports",
    changes: { format: "pdf", period, department },
  });

  const kpis = impactKpis(period, department);
  const rows = departmentRows(department);
  const periodLabel = periods.find((p) => p.key === period)?.label ?? "";
  const generatedAt = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/partenaire/exports" className="text-sm font-semibold text-primary hover:underline">
          ← Retour aux exports
        </Link>
        <PrintButton />
      </div>

      <article className="card p-6 print:border-0 print:p-0 print:shadow-none">
        <header className="mb-5 border-b border-line pb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Diabaction Congo</p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink">Rapport d'impact</h1>
          <p className="mt-1 text-sm text-ink/60">
            {periodLabel} · {department === "all" ? "National" : department} · établi le {generatedAt}
          </p>
        </header>

        <section className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink/50">Synthèse</h2>
          <KpiGrid kpis={kpis} />
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink/50">
            Répartition par département
          </h2>
          <DepartmentTable rows={rows} />
        </section>

        <footer className="border-t border-line pt-4 text-xs text-ink/60">
          <p className="flex items-start gap-2">
            <Icon name="shield" width={14} height={14} className="mt-0.5 shrink-0" />
            Programme national avec une capacité renforcée à Brazzaville. Données agrégées, sans
            information nominative ni médicale individuelle.
          </p>
        </footer>
      </article>
    </div>
  );
}
