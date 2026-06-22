"use client";

import { useRouter } from "next/navigation";
import { periods } from "@/data/impact";

/** Filtres période / département. Met à jour les paramètres d'URL (rendu serveur
 *  refait côté serveur). Fonctionne aussi via le bouton « Appliquer » sans JS. */
export function ImpactFilters({
  basePath,
  period,
  department,
  departments,
}: {
  basePath: string;
  period: string;
  department: string;
  departments: readonly string[];
}) {
  const router = useRouter();

  function apply(next: { period?: string; department?: string }) {
    const params = new URLSearchParams();
    params.set("periode", next.period ?? period);
    params.set("departement", next.department ?? department);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <form
      action={basePath}
      method="get"
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        apply({});
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-ink">Période</span>
        <select
          name="periode"
          defaultValue={period}
          onChange={(e) => apply({ period: e.target.value })}
          className="min-h-[44px] rounded-lg border border-line bg-white px-3"
        >
          {periods.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-ink">Département</span>
        <select
          name="departement"
          defaultValue={department}
          onChange={(e) => apply({ department: e.target.value })}
          className="min-h-[44px] rounded-lg border border-line bg-white px-3"
        >
          <option value="all">Tous les départements</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>

      <button type="submit" className="btn-outline">Appliquer</button>
    </form>
  );
}
