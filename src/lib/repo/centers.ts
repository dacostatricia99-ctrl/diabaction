import { prisma, dbEnabled } from "@/lib/db";
import { centers as demoCenters, type Center, type CoverageLevel } from "@/data/demo";
import { demoTable, insert, patch } from "@/lib/repo/demoStore";
import { uniqueSlug } from "@/lib/slug";

// Repository Centres — Prisma si la persistance est active, sinon overlay mémoire
// (repli démo). Le repli garantit que l'application tourne sans base et que les
// opérations CRUD persistent entre requêtes au sein du processus.

type StoredCenter = Center & { archived?: boolean };

/** Champs éditables d'un centre (création / modification). */
export type CenterInput = {
  name: string;
  description: string;
  address: string;
  city: string;
  department: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  services: string[];
  coverageLevel: CoverageLevel;
  handlesChildren: boolean;
  isOpen: boolean;
  products: string[];
};

function store(): StoredCenter[] {
  return demoTable<StoredCenter>("__diabCenters", demoCenters);
}

type DbCenter = {
  slug: string;
  name: string;
  description: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  coverageLevel: string;
  handlesChildren: boolean;
  city: { name: string; department: { name: string } | null } | null;
  services: { service: { name: string } }[];
  products: { product: { slug: string } }[];
};

function toCenter(c: DbCenter): Center {
  return {
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    address: c.address ?? "",
    city: c.city?.name ?? "",
    department: c.city?.department?.name ?? "",
    lat: c.lat ?? 0,
    lng: c.lng ?? 0,
    phone: c.phone ?? "",
    whatsapp: c.whatsapp ?? "",
    email: c.email ?? "",
    hours: "",
    services: c.services.map((s) => s.service.name),
    coverageLevel: c.coverageLevel as CoverageLevel,
    handlesChildren: c.handlesChildren,
    isOpen: true,
    products: c.products.map((p) => p.product.slug),
  };
}

const include = {
  city: { include: { department: true } },
  services: { include: { service: true } },
  products: { include: { product: true } },
} as const;

export async function listCenters(): Promise<Center[]> {
  if (!dbEnabled()) return store().filter((c) => !c.archived);
  try {
    const rows = await prisma.center.findMany({
      where: { deletedAt: null },
      include,
      orderBy: { name: "asc" },
    });
    return rows.map((r) => toCenter(r as unknown as DbCenter));
  } catch (err) {
    console.error("[repo/centers] repli démo:", err);
    return demoCenters;
  }
}

export async function getCenter(slug: string): Promise<Center | undefined> {
  if (!dbEnabled()) return store().find((c) => c.slug === slug && !c.archived);
  try {
    const row = await prisma.center.findFirst({ where: { slug, deletedAt: null }, include });
    return row ? toCenter(row as unknown as DbCenter) : undefined;
  } catch (err) {
    console.error("[repo/centers] repli démo:", err);
    return demoCenters.find((c) => c.slug === slug);
  }
}

/** Création d'un centre. Retourne le slug créé. */
export async function createCenter(input: CenterInput): Promise<string> {
  const slug = uniqueSlug(input.name, store().map((c) => c.slug));
  if (!dbEnabled()) {
    insert(store(), { ...input, slug });
    return slug;
  }
  try {
    await prisma.center.create({
      data: {
        slug,
        name: input.name,
        description: input.description,
        address: input.address,
        lat: input.lat,
        lng: input.lng,
        phone: input.phone,
        whatsapp: input.whatsapp,
        email: input.email,
        coverageLevel: input.coverageLevel,
        handlesChildren: input.handlesChildren,
      },
    });
  } catch (err) {
    console.error("[repo/centers] création échouée:", err);
  }
  return slug;
}

/** Modification d'un centre. Retourne true si trouvé/modifié. */
export async function updateCenter(slug: string, input: CenterInput): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, input) !== undefined;
  try {
    await prisma.center.update({
      where: { slug },
      data: {
        name: input.name,
        description: input.description,
        address: input.address,
        lat: input.lat,
        lng: input.lng,
        phone: input.phone,
        whatsapp: input.whatsapp,
        email: input.email,
        coverageLevel: input.coverageLevel,
        handlesChildren: input.handlesChildren,
      },
    });
    return true;
  } catch (err) {
    console.error("[repo/centers] modification échouée:", err);
    return false;
  }
}

/** Archivage (suppression logique). Retourne true si une ligne a été modifiée. */
export async function archiveCenter(slug: string): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, { archived: true }) !== undefined;
  try {
    await prisma.center.update({ where: { slug }, data: { deletedAt: new Date() } });
    return true;
  } catch (err) {
    console.error("[repo/centers] archive échouée:", err);
    return false;
  }
}
