// Validation/coercion des entrées CRUD admin. Chaque parseur renvoie soit
// { input } prêt pour le repo, soit { error } (message + 400 côté route).
import type {
  CoverageLevel,
  ProductCategory,
  ProductStatus,
  EventType,
  EventStatus,
  ResourceCategory,
  ResourceFormat,
} from "@/data/demo";
import type { CenterInput } from "@/lib/repo/centers";
import type { EventInput } from "@/lib/repo/events";
import type { ProductInput } from "@/lib/repo/products";
import type { ResourceInput } from "@/lib/repo/resources";

export type Parsed<T> = { input: T } | { error: string };

const str = (v: unknown) => String(v ?? "").trim();
const bool = (v: unknown) => v === true || v === "true" || v === "on";
const num = (v: unknown) => Number(v);
const list = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.map((x) => String(x).trim()).filter(Boolean)
    : str(v)
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

const COVERAGE: CoverageLevel[] = ["complete", "partielle", "orientation"];
const PRODUCT_CATEGORIES: ProductCategory[] = ["insuline", "bandelettes", "glucometres", "aiguilles", "consommables"];
const PRODUCT_STATUSES: ProductStatus[] = ["disponible", "stock_limite", "indisponible"];
const EVENT_TYPES: EventType[] = [
  "depistage",
  "caravane",
  "conference",
  "activite_physique",
  "journee_mondiale",
  "camp_ete",
  "atelier_educatif",
];
const EVENT_STATUSES: EventStatus[] = ["brouillon", "publie", "termine", "annule"];
const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "nutrition",
  "activite_physique",
  "prevention_complications",
  "diabete_gestationnel",
  "diabete_enfant",
  "sante_mentale",
];
const RESOURCE_FORMATS: ResourceFormat[] = ["article", "video", "infographie", "pdf"];

export function parseCenterInput(body: Record<string, unknown>): Parsed<CenterInput> {
  const name = str(body.name);
  if (!name) return { error: "Le nom est requis." };
  const coverageLevel = str(body.coverageLevel) as CoverageLevel;
  if (!COVERAGE.includes(coverageLevel)) return { error: "Niveau de couverture invalide." };
  const lat = num(body.lat);
  const lng = num(body.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return { error: "Coordonnées invalides." };
  return {
    input: {
      name,
      description: str(body.description),
      address: str(body.address),
      city: str(body.city),
      department: str(body.department),
      lat,
      lng,
      phone: str(body.phone),
      whatsapp: str(body.whatsapp),
      email: str(body.email),
      hours: str(body.hours),
      services: list(body.services),
      coverageLevel,
      handlesChildren: bool(body.handlesChildren),
      isOpen: bool(body.isOpen),
      products: list(body.products),
    },
  };
}

export function parseEventInput(body: Record<string, unknown>): Parsed<EventInput> {
  const title = str(body.title);
  if (!title) return { error: "Le titre est requis." };
  const type = str(body.type) as EventType;
  if (!EVENT_TYPES.includes(type)) return { error: "Type d'événement invalide." };
  const status = str(body.status) as EventStatus;
  if (!EVENT_STATUSES.includes(status)) return { error: "Statut invalide." };
  const startsAt = str(body.startsAt);
  if (!startsAt || Number.isNaN(Date.parse(startsAt))) return { error: "Date de début invalide." };
  const endsRaw = str(body.endsAt);
  if (endsRaw && Number.isNaN(Date.parse(endsRaw))) return { error: "Date de fin invalide." };
  const capacityRaw = str(body.capacity);
  const capacity = capacityRaw ? num(body.capacity) : undefined;
  if (capacity !== undefined && (!Number.isFinite(capacity) || capacity < 0))
    return { error: "Capacité invalide." };
  return {
    input: {
      title,
      description: str(body.description),
      type,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsRaw ? new Date(endsRaw).toISOString() : undefined,
      locationLabel: str(body.locationLabel),
      city: str(body.city),
      organizer: str(body.organizer),
      phone: str(body.phone),
      capacity,
      status,
    },
  };
}

export function parseProductInput(body: Record<string, unknown>): Parsed<ProductInput> {
  const name = str(body.name);
  if (!name) return { error: "Le nom est requis." };
  const category = str(body.category) as ProductCategory;
  if (!PRODUCT_CATEGORIES.includes(category)) return { error: "Catégorie invalide." };
  const status = str(body.status) as ProductStatus;
  if (!PRODUCT_STATUSES.includes(status)) return { error: "Statut invalide." };
  return {
    input: {
      name,
      category,
      description: str(body.description),
      status,
      indicativePrice: str(body.indicativePrice) || "Tarif solidaire",
      accessConditions: str(body.accessConditions),
      memberBenefit: str(body.memberBenefit),
    },
  };
}

export function parseResourceInput(body: Record<string, unknown>): Parsed<ResourceInput> {
  const title = str(body.title);
  if (!title) return { error: "Le titre est requis." };
  const category = str(body.category) as ResourceCategory;
  if (!RESOURCE_CATEGORIES.includes(category)) return { error: "Catégorie invalide." };
  const format = str(body.format) as ResourceFormat;
  if (!RESOURCE_FORMATS.includes(format)) return { error: "Format invalide." };
  const readingTime = str(body.readingTime);
  return {
    input: {
      title,
      category,
      format,
      summary: str(body.summary),
      readingTime: readingTime || undefined,
      availableOffline: bool(body.availableOffline),
    },
  };
}
