import { prisma, dbEnabled } from "@/lib/db";
import {
  events as demoEvents,
  type EventItem,
  type EventType,
  type EventStatus,
} from "@/data/demo";
import { demoTable, insert, patch } from "@/lib/repo/demoStore";
import { uniqueSlug } from "@/lib/slug";

// Repository Événements — Prisma si actif, sinon overlay mémoire (repli démo).

type StoredEvent = EventItem & { archived?: boolean };

/** Champs éditables d'un événement (création / modification). */
export type EventInput = {
  title: string;
  description: string;
  type: EventType;
  startsAt: string; // ISO
  endsAt?: string;
  locationLabel: string;
  city: string;
  organizer: string;
  phone: string;
  capacity?: number;
  status: EventStatus;
};

function store(): StoredEvent[] {
  return demoTable<StoredEvent>("__diabEvents", demoEvents);
}

function sortByDate(rows: EventItem[]): EventItem[] {
  return [...rows].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
}

type DbEvent = {
  slug: string;
  title: string;
  description: string | null;
  type: string;
  startsAt: Date;
  endsAt: Date | null;
  locationLabel: string | null;
  organizer: string | null;
  phone: string | null;
  capacity: number | null;
  status: string;
};

function toEvent(e: DbEvent): EventItem {
  return {
    slug: e.slug,
    title: e.title,
    description: e.description ?? "",
    type: e.type as EventType,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt ? e.endsAt.toISOString() : undefined,
    locationLabel: e.locationLabel ?? "",
    city: "",
    organizer: e.organizer ?? "",
    phone: e.phone ?? "",
    capacity: e.capacity ?? undefined,
    status: e.status as EventStatus,
  };
}

export async function listAllEvents(): Promise<EventItem[]> {
  if (!dbEnabled()) return sortByDate(store().filter((e) => !e.archived));
  try {
    const rows = await prisma.event.findMany({
      where: { deletedAt: null },
      orderBy: { startsAt: "asc" },
    });
    return rows.map((r) => toEvent(r as unknown as DbEvent));
  } catch (err) {
    console.error("[repo/events] repli démo:", err);
    return demoEvents;
  }
}

export async function listPublishedEvents(): Promise<EventItem[]> {
  if (!dbEnabled()) return sortByDate(store().filter((e) => !e.archived && e.status === "publie"));
  try {
    const rows = await prisma.event.findMany({
      where: { deletedAt: null, status: "publie" },
      orderBy: { startsAt: "asc" },
    });
    return rows.map((r) => toEvent(r as unknown as DbEvent));
  } catch (err) {
    console.error("[repo/events] repli démo:", err);
    return sortByDate(demoEvents.filter((e) => e.status === "publie"));
  }
}

export async function getEvent(slug: string): Promise<EventItem | undefined> {
  if (!dbEnabled()) return store().find((e) => e.slug === slug && !e.archived);
  try {
    const row = await prisma.event.findFirst({ where: { slug, deletedAt: null } });
    return row ? toEvent(row as unknown as DbEvent) : undefined;
  } catch (err) {
    console.error("[repo/events] repli démo:", err);
    return demoEvents.find((e) => e.slug === slug);
  }
}

export async function createEvent(input: EventInput): Promise<string> {
  const slug = uniqueSlug(input.title, store().map((e) => e.slug));
  if (!dbEnabled()) {
    insert(store(), { ...input, slug });
    return slug;
  }
  try {
    await prisma.event.create({
      data: {
        slug,
        title: input.title,
        description: input.description,
        type: input.type,
        startsAt: new Date(input.startsAt),
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
        locationLabel: input.locationLabel,
        organizer: input.organizer,
        phone: input.phone,
        capacity: input.capacity ?? null,
        status: input.status,
      },
    });
  } catch (err) {
    console.error("[repo/events] création échouée:", err);
  }
  return slug;
}

export async function updateEvent(slug: string, input: EventInput): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, input) !== undefined;
  try {
    await prisma.event.update({
      where: { slug },
      data: {
        title: input.title,
        description: input.description,
        type: input.type,
        startsAt: new Date(input.startsAt),
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
        locationLabel: input.locationLabel,
        organizer: input.organizer,
        phone: input.phone,
        capacity: input.capacity ?? null,
        status: input.status,
      },
    });
    return true;
  } catch (err) {
    console.error("[repo/events] modification échouée:", err);
    return false;
  }
}

export async function setEventStatus(slug: string, status: EventStatus): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, { status }) !== undefined;
  try {
    await prisma.event.update({ where: { slug }, data: { status } });
    return true;
  } catch (err) {
    console.error("[repo/events] changement de statut échoué:", err);
    return false;
  }
}

export async function archiveEvent(slug: string): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, { archived: true }) !== undefined;
  try {
    await prisma.event.update({ where: { slug }, data: { deletedAt: new Date() } });
    return true;
  } catch (err) {
    console.error("[repo/events] archive échouée:", err);
    return false;
  }
}
