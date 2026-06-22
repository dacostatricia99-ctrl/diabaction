// Journal d'audit — voir docs/03-rbac-securite.md §6.
// Persistant (table audit_logs) si DB_ENABLED, sinon store mémoire (démo).
import { prisma, dbEnabled } from "@/lib/db";

export type AuditEntry = {
  id: string;
  actorId?: string;
  actorName?: string;
  action: string;
  entity: string;
  entityId?: string;
  changes?: Record<string, unknown>;
  createdAt: string;
};

export type AuditInput = Omit<AuditEntry, "id" | "createdAt">;

// Store mémoire (repli) — conservé sur globalThis pour survivre au hot-reload.
const store: AuditEntry[] =
  ((globalThis as Record<string, unknown>).__diabAudit as AuditEntry[]) ?? [];
(globalThis as Record<string, unknown>).__diabAudit = store;

export async function addAuditLog(entry: AuditInput): Promise<void> {
  if (dbEnabled()) {
    try {
      await prisma.auditLog.create({
        data: {
          actorId: entry.actorId,
          action: entry.action,
          entity: entry.entity,
          entityId: entry.entityId,
          // actorName conservé dans changes pour l'affichage hors jointure.
          changes: { ...(entry.changes ?? {}), actorName: entry.actorName },
        },
      });
      return;
    } catch (err) {
      console.error("[audit] écriture DB échouée, repli mémoire:", err);
    }
  }
  store.unshift({
    ...entry,
    id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  });
  if (store.length > 500) store.pop();
}

export async function listAuditLogs(limit = 100): Promise<AuditEntry[]> {
  if (dbEnabled()) {
    try {
      const rows = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return rows.map((r) => {
        const changes = (r.changes as Record<string, unknown> | null) ?? {};
        const { actorName, ...rest } = changes;
        return {
          id: r.id,
          actorId: r.actorId ?? undefined,
          actorName: (actorName as string) ?? undefined,
          action: r.action,
          entity: r.entity,
          entityId: r.entityId ?? undefined,
          changes: Object.keys(rest).length ? rest : undefined,
          createdAt: r.createdAt.toISOString(),
        };
      });
    } catch (err) {
      console.error("[audit] lecture DB échouée, repli mémoire:", err);
    }
  }
  return store.slice(0, limit);
}
