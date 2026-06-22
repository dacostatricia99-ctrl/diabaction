import { dbEnabled, prisma } from "@/lib/db";
import { partners as demoPartners, type Partner, type PartnerStatus } from "@/data/impact";

// Repository Partenaires — table `partners` si la persistance est active, sinon
// overlay mémoire (repli démo). Partenaires = données agrégées uniquement.

// Overlay mémoire indexé par `id` (les partenaires n'ont pas de slug).
const g = globalThis as Record<string, unknown>;
function store(): Partner[] {
  if (!g.__diabPartners) g.__diabPartners = demoPartners.map((p) => ({ ...p }));
  return g.__diabPartners as Partner[];
}

export async function listPartners(): Promise<Partner[]> {
  if (!dbEnabled()) return store();
  try {
    const rows = await prisma.partner.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type ?? "",
      sector: r.sector ?? "",
      since: r.since.toISOString(),
      status: (r.status as PartnerStatus) ?? "actif",
    }));
  } catch (err) {
    console.error("[repo/partners] repli démo:", err);
    return demoPartners;
  }
}

/** Active / suspend un partenaire. Retourne true si trouvé/modifié. */
export async function setPartnerStatus(id: string, status: PartnerStatus): Promise<boolean> {
  if (!dbEnabled()) {
    const row = store().find((p) => p.id === id);
    if (!row) return false;
    row.status = status;
    return true;
  }
  try {
    await prisma.partner.update({ where: { id }, data: { status } });
    return true;
  } catch (err) {
    console.error("[repo/partners] maj statut échouée:", err);
    return false;
  }
}
