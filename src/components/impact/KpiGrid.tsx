import type { ImpactKpis } from "@/data/impact";

/** Grille de KPIs agrégés. Données jamais nominatives. */
export function KpiGrid({ kpis }: { kpis: ImpactKpis }) {
  const cards: { label: string; value: number }[] = [
    { label: "Dépistages (période)", value: kpis.screenings },
    { label: "Participants (période)", value: kpis.participants },
    { label: "Nouveaux membres (période)", value: kpis.newMembers },
    { label: "Enfants accompagnés", value: kpis.childrenSupported },
    { label: "Centres actifs", value: kpis.activeCenters },
    { label: "Départements couverts", value: kpis.departments },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="card p-4">
          <p className="text-2xl font-extrabold text-primary">{c.value.toLocaleString("fr-FR")}</p>
          <p className="text-sm text-ink/70">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
