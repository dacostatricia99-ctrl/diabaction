// Overlay mémoire pour le mode démo (DB_ENABLED=false).
// Conserve des copies mutables des données démo sur globalThis afin que les
// opérations CRUD (création, modification, archivage) persistent entre les
// requêtes au sein du processus serveur. Aucune persistance disque : un
// redémarrage repart des données de `src/data`. En production, les repos
// utilisent Prisma et ce module n'est pas sollicité.

type Keyed = { slug: string };

const g = globalThis as Record<string, unknown>;

/** Table mutable en mémoire, initialisée une seule fois depuis `seed`. */
export function demoTable<T extends Keyed>(key: string, seed: readonly T[]): T[] {
  if (!g[key]) g[key] = seed.map((x) => ({ ...x }));
  return g[key] as T[];
}

export function findBySlug<T extends Keyed>(rows: T[], slug: string): T | undefined {
  return rows.find((r) => r.slug === slug);
}

/** Insère en tête (les plus récents d'abord pour les listes admin). */
export function insert<T extends Keyed>(rows: T[], row: T): T {
  rows.unshift(row);
  return row;
}

/** Fusionne les champs fournis dans la ligne ciblée. Retourne la ligne ou undefined. */
export function patch<T extends Keyed>(rows: T[], slug: string, changes: Partial<T>): T | undefined {
  const row = findBySlug(rows, slug);
  if (!row) return undefined;
  Object.assign(row, changes);
  return row;
}
