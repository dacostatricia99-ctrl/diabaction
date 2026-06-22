import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import {
  isPeriodKey,
  departmentsCovered,
  periods,
  type PeriodKey,
} from "@/data/impact";
import { ImpactFilters } from "@/components/impact/ImpactFilters";

export const metadata: Metadata = { title: "Exports" };

export default async function PartenaireExportsPage({
  searchParams,
}: {
  searchParams: { periode?: string; departement?: string };
}) {
  await requirePermission(PERMISSIONS.REPORTS_EXPORT, "/partenaire");

  const period: PeriodKey = isPeriodKey(searchParams.periode) ? searchParams.periode : "12m";
  const department =
    searchParams.departement && departmentsCovered.includes(searchParams.departement as never)
      ? searchParams.departement
      : "all";

  const qs = `periode=${period}&departement=${encodeURIComponent(department)}`;
  const periodLabel = periods.find((p) => p.key === period)?.label ?? "";
  const deptLabel = department === "all" ? "tous les départements" : department;

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold text-ink">Exporter un rapport d'impact</h2>
      <p className="mt-1 text-sm text-ink/70">
        Choisissez la période et le périmètre, puis exportez les données agrégées. Chaque export est
        enregistré dans le journal d'audit.
      </p>

      <div className="mt-4">
        <ImpactFilters
          basePath="/partenaire/exports"
          period={period}
          department={department}
          departments={departmentsCovered}
        />
      </div>

      <p className="mt-4 text-sm text-ink/60">
        Sélection : <span className="font-semibold text-ink">{periodLabel}</span> · {deptLabel}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href={`/api/v1/partner/export?format=csv&${qs}`}
          className="card flex items-center gap-3 p-5 transition-shadow hover:shadow-float"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon name="book" width={20} height={20} />
          </span>
          <span>
            <span className="block font-bold text-ink">Excel / CSV</span>
            <span className="block text-sm text-ink/60">Tableur des agrégats par département</span>
          </span>
        </a>

        <Link
          href={`/partenaire/rapport?${qs}`}
          className="card flex items-center gap-3 p-5 transition-shadow hover:shadow-float"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon name="share" width={20} height={20} />
          </span>
          <span>
            <span className="block font-bold text-ink">PDF imprimable</span>
            <span className="block text-sm text-ink/60">Rapport mis en page à enregistrer en PDF</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
