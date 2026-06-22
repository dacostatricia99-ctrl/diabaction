// Données de démonstration — alimentent le site public sans base de données.
// En production, remplacées par l'API /api/v1 (Prisma/PostgreSQL). Les formes
// suivent le modèle de docs/02-modele-de-donnees.md.

export type CoverageLevel = "complete" | "partielle" | "orientation";
export type ProductStatus = "disponible" | "stock_limite" | "indisponible";
export type ProductCategory =
  | "insuline"
  | "bandelettes"
  | "glucometres"
  | "aiguilles"
  | "consommables";
export type EventType =
  | "depistage"
  | "caravane"
  | "conference"
  | "activite_physique"
  | "journee_mondiale"
  | "camp_ete"
  | "atelier_educatif";
export type EventStatus = "brouillon" | "publie" | "termine" | "annule";
export type ResourceFormat = "article" | "video" | "infographie" | "pdf";
export type ResourceCategory =
  | "nutrition"
  | "activite_physique"
  | "prevention_complications"
  | "diabete_gestationnel"
  | "diabete_enfant"
  | "sante_mentale";

export type Center = {
  slug: string;
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

export type EventItem = {
  slug: string;
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

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  status: ProductStatus;
  indicativePrice?: string;
  accessConditions: string;
  memberBenefit: string;
};

export type Resource = {
  slug: string;
  title: string;
  category: ResourceCategory;
  format: ResourceFormat;
  summary: string;
  readingTime?: string;
  availableOffline: boolean;
};

export const departments = [
  "Brazzaville",
  "Pointe-Noire",
  "Niari",
  "Bouenza",
  "Pool",
  "Plateaux",
  "Cuvette",
  "Sangha",
];

export const coverageLabels: Record<CoverageLevel, string> = {
  complete: "Couverture complète",
  partielle: "Couverture partielle",
  orientation: "Orientation",
};

export const productStatusLabels: Record<ProductStatus, string> = {
  disponible: "Disponible",
  stock_limite: "Stock limité",
  indisponible: "Indisponible",
};

export const eventTypeLabels: Record<EventType, string> = {
  depistage: "Dépistage",
  caravane: "Caravane de santé",
  conference: "Conférence",
  activite_physique: "Activité physique",
  journee_mondiale: "Journée mondiale du diabète",
  camp_ete: "Camp d'été",
  atelier_educatif: "Atelier d'éducation thérapeutique",
};

export const resourceCategoryLabels: Record<ResourceCategory, string> = {
  nutrition: "Nutrition",
  activite_physique: "Activité physique",
  prevention_complications: "Prévention des complications",
  diabete_gestationnel: "Diabète gestationnel",
  diabete_enfant: "Diabète chez l'enfant",
  sante_mentale: "Santé mentale",
};

export const resourceFormatLabels: Record<ResourceFormat, string> = {
  article: "Article",
  video: "Vidéo",
  infographie: "Infographie",
  pdf: "PDF",
};

export const centers: Center[] = [
  {
    slug: "centre-diabetologie-brazzaville",
    name: "Centre de diabétologie de Brazzaville",
    description:
      "Consultation, dépistage, éducation thérapeutique, suivi et produits à tarif solidaire.",
    address: "Poto-Poto, Brazzaville",
    city: "Brazzaville",
    department: "Brazzaville",
    lat: -4.2634,
    lng: 15.2429,
    phone: "+242061234567",
    whatsapp: "+242061234567",
    email: "brazzaville@diabaction.cg",
    hours: "Lun–Ven 08h00–16h00",
    services: ["Consultation", "Dépistage", "Éducation thérapeutique", "Suivi", "Produits à tarif solidaire"],
    coverageLevel: "complete",
    handlesChildren: true,
    isOpen: true,
    products: ["insuline", "bandelettes-reactives", "glucometre"],
  },
  {
    slug: "centre-talangai",
    name: "Centre de santé de Talangaï",
    description: "Dépistage du diabète et orientation vers la prise en charge adaptée.",
    address: "Talangaï, Brazzaville",
    city: "Brazzaville",
    department: "Brazzaville",
    lat: -4.2326,
    lng: 15.2876,
    phone: "+242061234568",
    whatsapp: "+242061234568",
    email: "talangai@diabaction.cg",
    hours: "Lun–Sam 08h00–14h00",
    services: ["Dépistage", "Éducation thérapeutique", "Orientation"],
    coverageLevel: "partielle",
    handlesChildren: true,
    isOpen: true,
    products: ["bandelettes-reactives"],
  },
  {
    slug: "centre-dolisie",
    name: "Antenne de Dolisie",
    description: "Caravanes de santé, dépistage et sensibilisation dans le Niari.",
    address: "Centre-ville, Dolisie",
    city: "Dolisie",
    department: "Niari",
    lat: -4.1957,
    lng: 12.6739,
    phone: "+242061234569",
    whatsapp: "+242061234569",
    email: "dolisie@diabaction.cg",
    hours: "Lun–Ven 08h00–15h00",
    services: ["Dépistage", "Caravane de santé", "Orientation"],
    coverageLevel: "orientation",
    handlesChildren: false,
    isOpen: false,
    products: [],
  },
  {
    slug: "centre-pointe-noire",
    name: "Centre de Pointe-Noire",
    description: "Consultation, suivi du diabète et produits à tarif solidaire.",
    address: "Centre-ville, Pointe-Noire",
    city: "Pointe-Noire",
    department: "Pointe-Noire",
    lat: -4.7889,
    lng: 11.8653,
    phone: "+242061234570",
    whatsapp: "+242061234570",
    email: "pointenoire@diabaction.cg",
    hours: "Lun–Ven 08h00–16h00",
    services: ["Consultation", "Dépistage", "Suivi", "Produits à tarif solidaire"],
    coverageLevel: "complete",
    handlesChildren: true,
    isOpen: true,
    products: ["insuline", "glucometre", "aiguilles"],
  },
];

export const events: EventItem[] = [
  {
    slug: "depistage-gratuit-talangai",
    title: "Dépistage à Talangaï",
    description:
      "Dépistage du diabète ouvert à tous, avec mesure de la glycémie et conseils personnalisés.",
    type: "depistage",
    startsAt: "2026-06-24T08:00:00+01:00",
    endsAt: "2026-06-24T14:00:00+01:00",
    locationLabel: "Centre de santé de Talangaï, Brazzaville",
    city: "Brazzaville",
    organizer: "Diabaction Congo",
    phone: "+242061234568",
    capacity: 200,
    status: "publie",
  },
  {
    slug: "caravane-sante-dolisie",
    title: "Caravane de santé à Dolisie",
    description: "Caravane de dépistage et de sensibilisation au diabète dans le Niari.",
    type: "caravane",
    startsAt: "2026-06-30T08:00:00+01:00",
    endsAt: "2026-06-30T16:00:00+01:00",
    locationLabel: "Place de la Mairie, Dolisie",
    city: "Dolisie",
    organizer: "Diabaction Congo",
    phone: "+242061234569",
    capacity: 300,
    status: "publie",
  },
  {
    slug: "marche-pour-la-sante",
    title: "Marche pour la santé",
    description: "Marche collective pour promouvoir l'activité physique et prévenir le diabète.",
    type: "activite_physique",
    startsAt: "2026-07-07T06:30:00+01:00",
    endsAt: "2026-07-07T10:00:00+01:00",
    locationLabel: "Corniche, Brazzaville",
    city: "Brazzaville",
    organizer: "Diabaction Congo",
    phone: "+242061234567",
    status: "publie",
  },
  {
    slug: "atelier-nutrition-poto-poto",
    title: "Atelier d'éducation thérapeutique",
    description: "Atelier nutrition et gestion du diabète au quotidien.",
    type: "atelier_educatif",
    startsAt: "2026-07-15T09:00:00+01:00",
    endsAt: "2026-07-15T12:00:00+01:00",
    locationLabel: "Centre de diabétologie de Brazzaville, Poto-Poto",
    city: "Brazzaville",
    organizer: "Diabaction Congo",
    phone: "+242061234567",
    capacity: 40,
    status: "publie",
  },
];

export const products: Product[] = [
  {
    slug: "insuline",
    name: "Insuline",
    category: "insuline",
    description: "Insuline pour le traitement du diabète, conservée selon la chaîne du froid.",
    status: "disponible",
    indicativePrice: "Tarif solidaire",
    accessConditions: "Accessible à tous. Prise en charge dédiée pour les enfants éligibles.",
    memberBenefit: "Tarif préférentiel pour les membres.",
  },
  {
    slug: "bandelettes-reactives",
    name: "Bandelettes réactives",
    category: "bandelettes",
    description: "Bandelettes pour la mesure de la glycémie au glucomètre.",
    status: "disponible",
    indicativePrice: "Tarif solidaire",
    accessConditions: "Accessible à tous.",
    memberBenefit: "Tarif préférentiel pour les membres.",
  },
  {
    slug: "glucometre",
    name: "Glucomètre",
    category: "glucometres",
    description: "Appareil de mesure de la glycémie, simple d'utilisation.",
    status: "stock_limite",
    indicativePrice: "Tarif solidaire",
    accessConditions: "Accessible à tous, dans la limite des disponibilités.",
    memberBenefit: "Tarif préférentiel pour les membres.",
  },
  {
    slug: "aiguilles",
    name: "Aiguilles pour stylo",
    category: "aiguilles",
    description: "Aiguilles à usage unique pour stylo à insuline.",
    status: "disponible",
    indicativePrice: "Tarif solidaire",
    accessConditions: "Accessible à tous.",
    memberBenefit: "Tarif préférentiel pour les membres.",
  },
];

export const resources: Resource[] = [
  {
    slug: "bien-manger-avec-le-diabete",
    title: "Bien manger avec le diabète",
    category: "nutrition",
    format: "article",
    summary: "Des repères simples pour composer des repas équilibrés au quotidien.",
    readingTime: "5 min",
    availableOffline: true,
  },
  {
    slug: "bouger-chaque-jour",
    title: "Bouger chaque jour",
    category: "activite_physique",
    format: "infographie",
    summary: "L'activité physique adaptée pour mieux vivre avec le diabète.",
    availableOffline: true,
  },
  {
    slug: "prevenir-les-complications",
    title: "Prévenir les complications",
    category: "prevention_complications",
    format: "article",
    summary: "Pieds, yeux, reins : les gestes de prévention essentiels.",
    readingTime: "6 min",
    availableOffline: false,
  },
  {
    slug: "diabete-et-grossesse",
    title: "Diabète et grossesse",
    category: "diabete_gestationnel",
    format: "pdf",
    summary: "Comprendre le diabète gestationnel et le suivi recommandé.",
    availableOffline: false,
  },
  {
    slug: "accompagner-son-enfant",
    title: "Accompagner son enfant diabétique",
    category: "diabete_enfant",
    format: "video",
    summary: "Conseils pour les familles d'enfants vivant avec le diabète.",
    availableOffline: false,
  },
  {
    slug: "diabete-et-bien-etre",
    title: "Diabète et bien-être mental",
    category: "sante_mentale",
    format: "article",
    summary: "Gérer le stress et préserver son moral au quotidien.",
    readingTime: "4 min",
    availableOffline: false,
  },
];

export const childrenProgram = {
  title: "Programme enfants 0–18 ans",
  notice: "Programme national avec une capacité renforcée à Brazzaville.",
  presentation:
    "Un programme dédié aux enfants et adolescents vivant avec le diabète, pour une prise en charge gratuite et un accompagnement adapté à chaque âge.",
  eligibilityCriteria: [
    "Enfant ou adolescent de 0 à 18 ans",
    "Diagnostic de diabète confirmé",
    "Résidant en République du Congo",
  ],
  includedServices: [
    "Suivi médical régulier",
    "Éducation thérapeutique de l'enfant et de la famille",
    "Accès aux produits à tarif solidaire",
    "Soutien et accompagnement personnalisé",
  ],
  registrationProcedure: [
    "Contacter un centre participant ou l'association",
    "Présenter les documents requis",
    "Rencontre avec l'équipe de prise en charge",
    "Inscription au programme",
  ],
  requiredDocuments: [
    "Pièce d'identité de l'enfant (ou acte de naissance)",
    "Document médical attestant le diagnostic",
    "Coordonnées d'un parent ou tuteur",
  ],
  participatingCenters: ["centre-diabetologie-brazzaville", "centre-talangai", "centre-pointe-noire"],
  faq: [
    {
      q: "Le programme est-il payant ?",
      a: "La prise en charge des enfants éligibles est dédiée et sans frais pour les services inclus.",
    },
    {
      q: "Où s'inscrire ?",
      a: "Auprès des centres participants ou directement auprès de l'association.",
    },
    {
      q: "Le programme est-il disponible partout ?",
      a: "Il est national, avec une capacité renforcée à Brazzaville.",
    },
  ],
};

export const valueProps = [
  { title: "Tarif solidaire", text: "Des produits accessibles à tous." },
  { title: "Accompagnement", text: "Un soutien humain et personnalisé." },
  { title: "Proximité", text: "Des centres dans tout le pays." },
  { title: "Éducation", text: "S'informer pour mieux vivre avec le diabète." },
];

export type MembershipRequestDemo = {
  id: string;
  lastName: string;
  firstName: string;
  phone: string;
  city: string;
  status: "nouvelle" | "en_traitement" | "acceptee" | "refusee";
  createdAt: string;
};

export const membershipRequestsDemo: MembershipRequestDemo[] = [
  { id: "mr-1", lastName: "Mabiala", firstName: "Grâce", phone: "+242060000001", city: "Brazzaville", status: "nouvelle", createdAt: "2026-06-15" },
  { id: "mr-2", lastName: "Okemba", firstName: "Jean", phone: "+242060000002", city: "Pointe-Noire", status: "en_traitement", createdAt: "2026-06-12" },
  { id: "mr-3", lastName: "Loubaki", firstName: "Sarah", phone: "+242060000003", city: "Dolisie", status: "acceptee", createdAt: "2026-06-08" },
];

export const metricsDemo = [
  { key: "active_centers", label: "Centres actifs", value: 4 },
  { key: "screenings_done", label: "Dépistages réalisés", value: 1280 },
  { key: "events_count", label: "Événements", value: 24 },
  { key: "participants", label: "Participants", value: 3650 },
  { key: "children_supported", label: "Enfants accompagnés", value: 210 },
  { key: "members", label: "Membres", value: 540 },
  { key: "geo_coverage", label: "Départements couverts", value: 6 },
  { key: "professionals_trained", label: "Professionnels formés", value: 95 },
];

export const requestStatusLabels: Record<MembershipRequestDemo["status"], string> = {
  nouvelle: "Nouvelle",
  en_traitement: "En traitement",
  acceptee: "Acceptée",
  refusee: "Refusée",
};

export const contact = {
  phone: "+242061234567",
  whatsapp: "+242061234567",
  email: "contact@diabaction.cg",
  membershipFee: "Cotisation annuelle à tarif solidaire",
};

// Aides de présentation
export function findCenter(slug: string) {
  return centers.find((c) => c.slug === slug);
}
export function findEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}
export function findProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function findResource(slug: string) {
  return resources.find((r) => r.slug === slug);
}
export function publishedEvents() {
  return events
    .filter((e) => e.status === "publie")
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
}
