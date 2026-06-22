import { dbEnabled, prisma } from "@/lib/db";
import {
  resources as demoResources,
  type Resource,
  type ResourceCategory,
  type ResourceFormat,
} from "@/data/demo";
import { demoTable, insert, patch } from "@/lib/repo/demoStore";
import { uniqueSlug } from "@/lib/slug";

// Repository Ressources éducatives — overlay mémoire en mode démo.

type StoredResource = Resource & { archived?: boolean };

export type ResourceInput = {
  title: string;
  category: ResourceCategory;
  format: ResourceFormat;
  summary: string;
  readingTime?: string;
  availableOffline: boolean;
};

function store(): StoredResource[] {
  return demoTable<StoredResource>("__diabResources", demoResources);
}

// Note : la table `educational_resources` ne stocke pas le temps de lecture
// (champ purement éditorial côté démo) ; il n'est donc pas persisté en DB.
function dbData(input: ResourceInput) {
  return {
    title: input.title,
    category: input.category,
    format: input.format,
    summary: input.summary,
    availableOffline: input.availableOffline,
  };
}

export async function listResources(): Promise<Resource[]> {
  if (!dbEnabled()) return store().filter((r) => !r.archived);
  try {
    const rows = await prisma.educationalResource.findMany({
      where: { deletedAt: null },
      orderBy: { title: "asc" },
    });
    return rows as unknown as Resource[];
  } catch (err) {
    console.error("[repo/resources] repli démo:", err);
    return demoResources;
  }
}

export async function getResource(slug: string): Promise<Resource | undefined> {
  if (!dbEnabled()) return store().find((r) => r.slug === slug && !r.archived);
  try {
    const row = await prisma.educationalResource.findFirst({ where: { slug, deletedAt: null } });
    return (row as unknown as Resource) ?? undefined;
  } catch (err) {
    console.error("[repo/resources] repli démo:", err);
    return demoResources.find((r) => r.slug === slug);
  }
}

export async function createResource(input: ResourceInput): Promise<string> {
  const slug = uniqueSlug(input.title, store().map((r) => r.slug));
  if (!dbEnabled()) {
    insert(store(), { ...input, slug });
    return slug;
  }
  try {
    await prisma.educationalResource.create({ data: { slug, ...dbData(input) } });
  } catch (err) {
    console.error("[repo/resources] création échouée:", err);
  }
  return slug;
}

export async function updateResource(slug: string, input: ResourceInput): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, input) !== undefined;
  try {
    await prisma.educationalResource.update({ where: { slug }, data: dbData(input) });
    return true;
  } catch (err) {
    console.error("[repo/resources] modification échouée:", err);
    return false;
  }
}

export async function archiveResource(slug: string): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, { archived: true }) !== undefined;
  try {
    await prisma.educationalResource.update({ where: { slug }, data: { deletedAt: new Date() } });
    return true;
  } catch (err) {
    console.error("[repo/resources] archive échouée:", err);
    return false;
  }
}
