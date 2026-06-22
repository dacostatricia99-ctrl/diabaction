import type { DepartmentAggregate } from "@/data/impact";

/** Répartition agrégée par département. */
export function DepartmentTable({ rows }: { rows: DepartmentAggregate[] }) {
  const total = rows.reduce(
    (acc, r) => ({
      centers: acc.centers + r.centers,
      screenings: acc.screenings + r.screenings,
      members: acc.members + r.members,
      childrenSupported: acc.childrenSupported + r.childrenSupported,
    }),
    { centers: 0, screenings: 0, members: 0, childrenSupported: 0 }
  );

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-4 py-3">Département</th>
            <th className="px-4 py-3 text-right">Centres</th>
            <th className="px-4 py-3 text-right">Dépistages</th>
            <th className="px-4 py-3 text-right">Membres</th>
            <th className="px-4 py-3 text-right">Enfants</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.department}>
              <td className="px-4 py-3 font-medium text-ink">{r.department}</td>
              <td className="px-4 py-3 text-right text-ink/70">{r.centers}</td>
              <td className="px-4 py-3 text-right text-ink/70">{r.screenings.toLocaleString("fr-FR")}</td>
              <td className="px-4 py-3 text-right text-ink/70">{r.members.toLocaleString("fr-FR")}</td>
              <td className="px-4 py-3 text-right text-ink/70">{r.childrenSupported.toLocaleString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
        {rows.length > 1 && (
          <tfoot className="border-t border-line font-semibold text-ink">
            <tr>
              <td className="px-4 py-3">Total</td>
              <td className="px-4 py-3 text-right">{total.centers}</td>
              <td className="px-4 py-3 text-right">{total.screenings.toLocaleString("fr-FR")}</td>
              <td className="px-4 py-3 text-right">{total.members.toLocaleString("fr-FR")}</td>
              <td className="px-4 py-3 text-right">{total.childrenSupported.toLocaleString("fr-FR")}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
