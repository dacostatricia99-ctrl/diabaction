import { dbEnabled, prisma } from "@/lib/db";
import { metricsDemo } from "@/data/demo";

// Repository Indicateurs — table `metrics` (lignes nationales : departmentId null)
// si la persistance est active, sinon overlay mémoire (repli démo). Les libellés
// restent côté code (`metricsDemo`) ; la base ne stocke que clé/valeur/période.

export type MetricRow = { key: string; label: string; value: number };

const LABELS = new Map(metricsDemo.map((m) => [m.key, m.label] as const));
const label = (key: string) => LABELS.get(key) ?? key;

const g = globalThis as Record<string, unknown>;
function store(): { key: string; value: number }[] {
  if (!g.__diabMetrics) g.__diabMetrics = metricsDemo.map((m) => ({ key: m.key, value: m.value }));
  return g.__diabMetrics as { key: string; value: number }[];
}

export async function listMetrics(): Promise<MetricRow[]> {
  if (!dbEnabled()) {
    return store().map((m) => ({ key: m.key, label: label(m.key), value: m.value }));
  }
  try {
    const rows = await prisma.metric.findMany({
      where: { departmentId: null, deletedAt: null },
      orderBy: { periodEnd: "desc" },
    });
    // Dernière valeur connue par clé (la plus récente d'abord).
    const latest = new Map<string, number>();
    for (const r of rows) if (!latest.has(r.key)) latest.set(r.key, Number(r.value));
    // Conserve l'ordre d'affichage de référence.
    return metricsDemo.map((m) => ({ key: m.key, label: m.label, value: latest.get(m.key) ?? m.value }));
  } catch (err) {
    console.error("[repo/metrics] repli démo:", err);
    return metricsDemo.map((m) => ({ key: m.key, label: m.label, value: m.value }));
  }
}

/** Met à jour la valeur nationale d'un indicateur. Retourne true si trouvé. */
export async function updateMetric(key: string, value: number): Promise<boolean> {
  if (!LABELS.has(key)) return false;
  if (!dbEnabled()) {
    const row = store().find((m) => m.key === key);
    if (!row) return false;
    row.value = value;
    return true;
  }
  try {
    const res = await prisma.metric.updateMany({
      where: { key, departmentId: null, deletedAt: null },
      data: { value },
    });
    return res.count > 0;
  } catch (err) {
    console.error("[repo/metrics] maj échouée:", err);
    return false;
  }
}
