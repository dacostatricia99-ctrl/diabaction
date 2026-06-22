import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import { isPeriodKey, departmentsCovered, type PeriodKey } from "@/data/impact";
import { ImpactDashboard } from "@/components/impact/ImpactDashboard";

export default async function PartenaireHome({
  searchParams,
}: {
  searchParams: { periode?: string; departement?: string };
}) {
  await requirePermission(PERMISSIONS.DASHBOARD_VIEW_AGGREGATED, "/partenaire");

  const period: PeriodKey = isPeriodKey(searchParams.periode) ? searchParams.periode : "12m";
  const department =
    searchParams.departement && departmentsCovered.includes(searchParams.departement as never)
      ? searchParams.departement
      : "all";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Tableau de bord d'impact</h2>
          <p className="mt-1 text-sm text-ink/70">
            Données agrégées de l'action contre le diabète au Congo.
          </p>
        </div>
        <Link href="/partenaire/exports" className="btn-outline">
          <Icon name="book" width={18} height={18} /> Exporter
        </Link>
      </div>

      <ImpactDashboard basePath="/partenaire" period={period} department={department} />

      <p className="mt-6 rounded-card border border-line bg-primary-soft px-4 py-3 text-xs text-ink/70">
        Programme national avec une capacité renforcée à Brazzaville. Les indicateurs présentés sont
        agrégés et ne contiennent aucune donnée nominative ou médicale individuelle.
      </p>
    </div>
  );
}
