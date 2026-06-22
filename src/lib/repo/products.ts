import { dbEnabled, prisma } from "@/lib/db";
import {
  products as demoProducts,
  type Product,
  type ProductCategory,
  type ProductStatus,
} from "@/data/demo";
import { demoTable, insert, patch } from "@/lib/repo/demoStore";
import { uniqueSlug } from "@/lib/slug";

// Repository Produits — overlay mémoire en mode démo. Le stock exact n'est jamais
// modélisé : seul le statut de disponibilité (contrainte métier).

type StoredProduct = Product & { archived?: boolean };

export type ProductInput = {
  name: string;
  category: ProductCategory;
  description: string;
  status: ProductStatus;
  indicativePrice: string;
  accessConditions: string;
  memberBenefit: string;
};

function store(): StoredProduct[] {
  return demoTable<StoredProduct>("__diabProducts", demoProducts);
}

export async function listProducts(): Promise<Product[]> {
  if (!dbEnabled()) return store().filter((p) => !p.archived);
  try {
    const rows = await prisma.product.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
    return rows as unknown as Product[];
  } catch (err) {
    console.error("[repo/products] repli démo:", err);
    return demoProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!dbEnabled()) return store().find((p) => p.slug === slug && !p.archived);
  try {
    const row = await prisma.product.findFirst({ where: { slug, deletedAt: null } });
    return (row as unknown as Product) ?? undefined;
  } catch (err) {
    console.error("[repo/products] repli démo:", err);
    return demoProducts.find((p) => p.slug === slug);
  }
}

// `indicativePrice` est un libellé éditorial côté démo (« Tarif solidaire ») ;
// la colonne DB est numérique (Decimal) et n'est donc pas alimentée ici.
function dbData(input: ProductInput) {
  return {
    name: input.name,
    category: input.category,
    description: input.description,
    status: input.status,
    accessConditions: input.accessConditions,
    memberBenefit: input.memberBenefit,
  };
}

export async function createProduct(input: ProductInput): Promise<string> {
  const slug = uniqueSlug(input.name, store().map((p) => p.slug));
  if (!dbEnabled()) {
    insert(store(), { ...input, slug });
    return slug;
  }
  try {
    await prisma.product.create({ data: { slug, ...dbData(input) } });
  } catch (err) {
    console.error("[repo/products] création échouée:", err);
  }
  return slug;
}

export async function updateProduct(slug: string, input: ProductInput): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, input) !== undefined;
  try {
    await prisma.product.update({ where: { slug }, data: dbData(input) });
    return true;
  } catch (err) {
    console.error("[repo/products] modification échouée:", err);
    return false;
  }
}

export async function archiveProduct(slug: string): Promise<boolean> {
  if (!dbEnabled()) return patch(store(), slug, { archived: true }) !== undefined;
  try {
    await prisma.product.update({ where: { slug }, data: { deletedAt: new Date() } });
    return true;
  } catch (err) {
    console.error("[repo/products] archive échouée:", err);
    return false;
  }
}
