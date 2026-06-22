import {
  impactKpis,
  seriesForPeriod,
  departmentRows,
  departmentsCovered,
  monthLabel,
  periods,
  type PeriodKey,
} from "@/data/impact";
import { KpiGrid } from "@/components/impact/KpiGrid";
import { BarChart } from "@/components/impact/BarChart";
import { DepartmentTable } from "@/components/impact/DepartmentTable";
import { ImpactFilters } from "@/components/impact/ImpactFilters";

/** Tableau de bord d'impact agrégé, réutilisé par l'espace partenaire et l'admin. */
export function ImpactDashboard({
  basePath,
  period,
  department,
}: {
  basePath: string;
  period: PeriodKey;
  department: string;
}) {
  const kpis = impactKpis(period, department);
  const series = seriesForPeriod(period);
  const rows = departmentRows(department);
  const periodLabel = periods.find((p) => p.key === period)?.label ?? "";

  return (
    <div className="space-y-6">
      <ImpactFilters
        basePath={basePath}
        period={period}
        department={department}
        departments={departmentsCovered}
      />

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink/50">
          Synthèse · {periodLabel}
          {department !== "all" && ` · ${department}`}
        </h2>
        <KpiGrid kpis={kpis} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BarChart
          title="Dépistages par mois"
          unit="dépistages"
          data={series.map((p) => ({ label: monthLabel(p.month), value: p.screenings }))}
        />
        <BarChart
          title="Participants par mois"
          unit="participants"
          data={series.map((p) => ({ label: monthLabel(p.month), value: p.participants }))}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink/50">
          Répartition par département
        </h2>
        <DepartmentTable rows={rows} />
      </section>
    </div>
  );
}
