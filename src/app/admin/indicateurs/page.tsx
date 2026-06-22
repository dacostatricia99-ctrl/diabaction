import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { isPeriodKey, departmentsCovered, type PeriodKey } from "@/data/impact";
import { ImpactDashboard } from "@/components/impact/ImpactDashboard";
import { listMetrics } from "@/lib/repo/metrics";
import { MetricsEditor } from "./MetricsEditor";

export const metadata = { title: "Indicateurs" };

export default async function AdminIndicateursPage({
  searchParams,
}: {
  searchParams: { periode?: string; departement?: string };
}) {
  await requirePermission(PERMISSIONS.METRICS_MANAGE);
  const metrics = await listMetrics();

  const period: PeriodKey = isPeriodKey(searchParams.periode) ? searchParams.periode : "12m";
  const department =
    searchParams.departement && departmentsCovered.includes(searchParams.departement as never)
      ? searchParams.departement
      : "all";

  return (
    <div>
      <AdminPageHeader
        title="Indicateurs d'impact"
        description="Données agrégées (jamais nominatives) alimentant le tableau de bord et les exports partenaires."
      />

      <ImpactDashboard basePath="/admin/indicateurs" period={period} department={department} />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink/50">
          Saisie & validation des indicateurs
        </h2>
        <MetricsEditor initial={metrics} />
      </section>
    </div>
  );
}
