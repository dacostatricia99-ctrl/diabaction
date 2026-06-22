import { dbEnabled, prisma } from "@/lib/db";

// Repository Abonnements Push — Prisma si actif, sinon overlay mémoire (démo).
// Agrégat de ciblage : département + topics (ex. "enfants").

export type PushKeys = { p256dh: string; auth: string };

export type Subscription = {
  endpoint: string;
  keys: PushKeys;
  userId?: string;
  department?: string;
  topics: string[];
};

export type SubscribeInput = {
  endpoint: string;
  keys: PushKeys;
  userId?: string;
  department?: string;
  topics?: string[];
};

export type Filter = { department?: string; topic?: string };

const g = globalThis as Record<string, unknown>;
function store(): Subscription[] {
  if (!g.__diabPush) g.__diabPush = [] as Subscription[];
  return g.__diabPush as Subscription[];
}

/** Enregistre (ou met à jour) un abonnement, identifié par son endpoint. */
export async function saveSubscription(input: SubscribeInput): Promise<void> {
  const topics = input.topics ?? [];
  if (!dbEnabled()) {
    const rows = store();
    const existing = rows.find((s) => s.endpoint === input.endpoint);
    const value: Subscription = {
      endpoint: input.endpoint,
      keys: input.keys,
      userId: input.userId,
      department: input.department,
      topics,
    };
    if (existing) Object.assign(existing, value);
    else rows.push(value);
    return;
  }
  await prisma.pushSubscription.upsert({
    where: { endpoint: input.endpoint },
    update: { keys: input.keys, userId: input.userId, department: input.department, topics, deletedAt: null },
    create: {
      endpoint: input.endpoint,
      keys: input.keys,
      userId: input.userId,
      department: input.department,
      topics,
    },
  });
}

/** Désabonnement (suppression logique en DB, retrait en mémoire). */
export async function removeSubscription(endpoint: string): Promise<void> {
  if (!dbEnabled()) {
    g.__diabPush = store().filter((s) => s.endpoint !== endpoint);
    return;
  }
  await prisma.pushSubscription.updateMany({ where: { endpoint }, data: { deletedAt: new Date() } });
}

/** Abonnements actifs correspondant au ciblage (département/topic optionnels). */
export async function listSubscriptions(filter: Filter = {}): Promise<Subscription[]> {
  if (!dbEnabled()) {
    return store().filter(
      (s) =>
        (!filter.department || s.department === filter.department) &&
        (!filter.topic || s.topics.includes(filter.topic))
    );
  }
  const rows = await prisma.pushSubscription.findMany({
    where: {
      deletedAt: null,
      ...(filter.department ? { department: filter.department } : {}),
      ...(filter.topic ? { topics: { has: filter.topic } } : {}),
    },
  });
  return rows.map((r) => ({
    endpoint: r.endpoint,
    keys: r.keys as PushKeys,
    userId: r.userId ?? undefined,
    department: r.department ?? undefined,
    topics: r.topics,
  }));
}

export async function countSubscriptions(): Promise<number> {
  if (!dbEnabled()) return store().length;
  return prisma.pushSubscription.count({ where: { deletedAt: null } });
}
