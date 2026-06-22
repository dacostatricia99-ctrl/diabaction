// Données d'impact agrégées (Lot 4) — tableau de bord & exports partenaires.
// CONTRAINTE : agrégats uniquement, jamais de données nominatives ni médicales
// individuelles, jamais de quantité produit exacte. En production : vues
// agrégées calculées côté serveur (Prisma) à partir des tables métier.

export const departmentsCovered = [
  "Brazzaville",
  "Pointe-Noire",
  "Niari",
  "Bouenza",
  "Pool",
  "Plateaux",
] as const;

// Périodes proposées dans les filtres.
export type PeriodKey = "12m" | "6m" | "3m";
export const periods: { key: PeriodKey; label: string; months: number }[] = [
  { key: "12m", label: "12 derniers mois", months: 12 },
  { key: "6m", label: "6 derniers mois", months: 6 },
  { key: "3m", label: "3 derniers mois", months: 3 },
];

export function isPeriodKey(v: string | undefined): v is PeriodKey {
  return v === "12m" || v === "6m" || v === "3m";
}

// Série mensuelle nationale (12 mois glissants jusqu'à mai 2026).
export type MonthlyPoint = {
  month: string; // "YYYY-MM"
  screenings: number;
  participants: number;
  newMembers: number;
};

export const monthlySeries: MonthlyPoint[] = [
  { month: "2025-06", screenings: 78, participants: 240, newMembers: 18 },
  { month: "2025-07", screenings: 96, participants: 305, newMembers: 22 },
  { month: "2025-08", screenings: 88, participants: 280, newMembers: 19 },
  { month: "2025-09", screenings: 110, participants: 340, newMembers: 27 },
  { month: "2025-10", screenings: 124, participants: 360, newMembers: 31 },
  { month: "2025-11", screenings: 168, participants: 520, newMembers: 44 }, // Journée mondiale
  { month: "2025-12", screenings: 102, participants: 300, newMembers: 21 },
  { month: "2026-01", screenings: 115, participants: 330, newMembers: 25 },
  { month: "2026-02", screenings: 121, participants: 352, newMembers: 28 },
  { month: "2026-03", screenings: 134, participants: 390, newMembers: 33 },
  { month: "2026-04", screenings: 142, participants: 410, newMembers: 36 },
  { month: "2026-05", screenings: 156, participants: 448, newMembers: 39 },
];

// Agrégats par département (totaux sur la période de référence).
export type DepartmentAggregate = {
  department: string;
  centers: number;
  screenings: number;
  members: number;
  childrenSupported: number;
};

export const departmentAggregates: DepartmentAggregate[] = [
  { department: "Brazzaville", centers: 2, screenings: 720, members: 280, childrenSupported: 132 },
  { department: "Pointe-Noire", centers: 1, screenings: 410, members: 150, childrenSupported: 48 },
  { department: "Niari", centers: 1, screenings: 180, members: 60, childrenSupported: 18 },
  { department: "Bouenza", centers: 0, screenings: 86, members: 24, childrenSupported: 6 },
  { department: "Pool", centers: 0, screenings: 64, members: 16, childrenSupported: 4 },
  { department: "Plateaux", centers: 0, screenings: 40, members: 10, childrenSupported: 2 },
];

// ——— Partenaires institutionnels (gestion admin) ———
export type PartnerStatus = "actif" | "suspendu";

export type Partner = {
  id: string;
  name: string;
  type: string;
  sector: string;
  since: string; // ISO
  status: PartnerStatus;
};

export const partnerStatusLabels: Record<PartnerStatus, string> = {
  actif: "Actif",
  suspendu: "Suspendu",
};

export const partners: Partner[] = [
  { id: "p-minsante", name: "Ministère de la Santé", type: "Institution publique", sector: "Santé", since: "2023-01-15", status: "actif" },
  { id: "p-oms", name: "Organisation mondiale de la Santé", type: "Organisation internationale", sector: "Santé publique", since: "2023-03-01", status: "actif" },
  { id: "p-mairie-bzv", name: "Mairie de Brazzaville", type: "Collectivité", sector: "Public local", since: "2024-02-10", status: "actif" },
  { id: "p-fondation", name: "Fondation Partenaire Santé", type: "Fondation", sector: "Privé", since: "2024-09-05", status: "suspendu" },
];

// ——— Helpers d'agrégation ———

/** Sous-ensemble de la série mensuelle pour la période choisie. */
export function seriesForPeriod(period: PeriodKey): MonthlyPoint[] {
  const n = periods.find((p) => p.key === period)?.months ?? 12;
  return monthlySeries.slice(-n);
}

export type ImpactKpis = {
  screenings: number;
  participants: number;
  newMembers: number;
  activeCenters: number;
  departments: number;
  childrenSupported: number;
};

/** KPIs agrégés pour une période et un département optionnel ("all" = national). */
export function impactKpis(period: PeriodKey, department = "all"): ImpactKpis {
  const series = seriesForPeriod(period);
  const depts =
    department === "all"
      ? departmentAggregates
      : departmentAggregates.filter((d) => d.department === department);

  // Part du département dans le national (pour ventiler les flux de la période).
  const totalScreenings = departmentAggregates.reduce((s, d) => s + d.screenings, 0);
  const deptScreenings = depts.reduce((s, d) => s + d.screenings, 0);
  const share = department === "all" || totalScreenings === 0 ? 1 : deptScreenings / totalScreenings;

  const sum = (k: keyof Omit<MonthlyPoint, "month">) =>
    Math.round(series.reduce((s, p) => s + p[k], 0) * share);

  return {
    screenings: sum("screenings"),
    participants: sum("participants"),
    newMembers: sum("newMembers"),
    activeCenters: depts.reduce((s, d) => s + d.centers, 0),
    departments: department === "all" ? departmentsCovered.length : 1,
    childrenSupported: depts.reduce((s, d) => s + d.childrenSupported, 0),
  };
}

export function departmentRows(department = "all"): DepartmentAggregate[] {
  return department === "all"
    ? departmentAggregates
    : departmentAggregates.filter((d) => d.department === department);
}

/** Libellé court "juin 25" depuis "YYYY-MM". */
const MONTHS_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return `${MONTHS_SHORT[Number(m) - 1]} ${y.slice(2)}`;
}
