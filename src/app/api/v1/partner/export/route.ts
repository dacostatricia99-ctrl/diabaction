import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth/apiGuard";
import { PERMISSIONS } from "@/lib/rbac";
import { addAuditLog } from "@/lib/audit";
import { impactKpis, departmentRows, isPeriodKey, departmentsCovered, type PeriodKey } from "@/data/impact";

// GET /api/v1/partner/export?format=csv&periode=&departement= — export agrégé audité.
// Agrégats uniquement, jamais de données nominatives.
export async function GET(req: Request) {
  const guard = await guardApi(PERMISSIONS.REPORTS_EXPORT);
  if ("response" in guard) return guard.response;

  const url = new URL(req.url);
  const period: PeriodKey = isPeriodKey(url.searchParams.get("periode") ?? undefined)
    ? (url.searchParams.get("periode") as PeriodKey)
    : "12m";
  const deptParam = url.searchParams.get("departement") ?? "all";
  const department = departmentsCovered.includes(deptParam as never) ? deptParam : "all";

  const kpis = impactKpis(period, department);
  const rows = departmentRows(department);

  // Construction CSV (séparateur ";" — ouverture directe dans Excel FR). BOM UTF-8.
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines: string[] = [];
  lines.push(`Rapport d'impact Diabaction Congo`);
  lines.push(`Période;${period};Périmètre;${department === "all" ? "National" : department}`);
  lines.push("");
  lines.push("Indicateur;Valeur");
  lines.push(`Dépistages (période);${kpis.screenings}`);
  lines.push(`Participants (période);${kpis.participants}`);
  lines.push(`Nouveaux membres (période);${kpis.newMembers}`);
  lines.push(`Enfants accompagnés;${kpis.childrenSupported}`);
  lines.push(`Centres actifs;${kpis.activeCenters}`);
  lines.push(`Départements couverts;${kpis.departments}`);
  lines.push("");
  lines.push("Département;Centres;Dépistages;Membres;Enfants");
  for (const r of rows) {
    lines.push([r.department, r.centers, r.screenings, r.members, r.childrenSupported].map(esc).join(";"));
  }

  await addAuditLog({
    actorId: guard.user.id,
    actorName: guard.user.name,
    action: "export",
    entity: "reports",
    changes: { format: "csv", period, department },
  });

  const body = "﻿" + lines.join("\r\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="impact-diabaction-${period}-${department}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
