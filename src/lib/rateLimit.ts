// Limitation de débit en mémoire (fenêtre glissante simple), conservée sur
// globalThis pour survivre au hot-reload. Suffisant pour un déploiement
// mono-instance ; en multi-instances, remplacer par un store partagé (Redis).

type Bucket = { count: number; resetAt: number };

const g = globalThis as Record<string, unknown>;
const store: Map<string, Bucket> =
  (g.__diabRate as Map<string, Bucket>) ?? new Map<string, Bucket>();
g.__diabRate = store;

export type RateResult = { ok: boolean; retryAfter: number };

/** Incrémente le compteur de `key` et indique si la limite est dépassée. */
export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  const b = store.get(key);
  if (!b || b.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count++;
  return { ok: true, retryAfter: 0 };
}

/** Réinitialise le compteur (ex. après une authentification réussie). */
export function rateLimitReset(key: string): void {
  store.delete(key);
}

/** Adresse cliente à partir des en-têtes de proxy (best-effort). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
