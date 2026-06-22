// Schémas de formulaires CRUD admin — partagés entre les pages « nouveau » et
// « modifier » de chaque entité. Type pur (sans React) réutilisable côté serveur.
import {
  departments,
  coverageLabels,
  productStatusLabels,
  eventTypeLabels,
  resourceCategoryLabels,
  resourceFormatLabels,
  type ProductCategory,
} from "@/data/demo";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "url" | "date" | "datetime-local" | "textarea" | "select" | "checkbox";
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  step?: string;
  full?: boolean; // occupe toute la largeur de la grille
};

const opts = (m: Record<string, string>) => Object.entries(m).map(([value, label]) => ({ value, label }));

const productCategoryLabels: Record<ProductCategory, string> = {
  insuline: "Insuline",
  bandelettes: "Bandelettes",
  glucometres: "Glucomètres",
  aiguilles: "Aiguilles",
  consommables: "Consommables",
};

export const centerFields: FieldDef[] = [
  { name: "name", label: "Nom du centre", type: "text", required: true, full: true },
  { name: "description", label: "Description", type: "textarea", full: true },
  { name: "address", label: "Adresse", type: "text", full: true },
  { name: "city", label: "Ville", type: "text" },
  { name: "department", label: "Département", type: "select", options: departments.map((d) => ({ value: d, label: d })) },
  { name: "lat", label: "Latitude", type: "number", required: true, step: "any" },
  { name: "lng", label: "Longitude", type: "number", required: true, step: "any" },
  { name: "phone", label: "Téléphone", type: "tel" },
  { name: "whatsapp", label: "WhatsApp", type: "tel" },
  { name: "email", label: "Email", type: "email" },
  { name: "hours", label: "Horaires", type: "text" },
  { name: "coverageLevel", label: "Niveau de couverture", type: "select", required: true, options: opts(coverageLabels) },
  { name: "services", label: "Services", type: "text", help: "Séparés par des virgules", full: true },
  { name: "products", label: "Produits (slugs)", type: "text", help: "Séparés par des virgules", full: true },
  { name: "handlesChildren", label: "Prend en charge les enfants", type: "checkbox" },
  { name: "isOpen", label: "Centre ouvert", type: "checkbox" },
];

export const eventFields: FieldDef[] = [
  { name: "title", label: "Titre", type: "text", required: true, full: true },
  { name: "description", label: "Description", type: "textarea", full: true },
  { name: "type", label: "Type", type: "select", required: true, options: opts(eventTypeLabels) },
  {
    name: "status",
    label: "Statut",
    type: "select",
    required: true,
    options: [
      { value: "brouillon", label: "Brouillon" },
      { value: "publie", label: "Publié" },
      { value: "termine", label: "Terminé" },
      { value: "annule", label: "Annulé" },
    ],
  },
  { name: "startsAt", label: "Début", type: "datetime-local", required: true },
  { name: "endsAt", label: "Fin", type: "datetime-local" },
  { name: "locationLabel", label: "Lieu", type: "text", full: true },
  { name: "city", label: "Ville", type: "text" },
  { name: "organizer", label: "Organisateur", type: "text" },
  { name: "phone", label: "Téléphone", type: "tel" },
  { name: "capacity", label: "Capacité", type: "number" },
];

export const productFields: FieldDef[] = [
  { name: "name", label: "Nom du produit", type: "text", required: true, full: true },
  { name: "category", label: "Catégorie", type: "select", required: true, options: opts(productCategoryLabels) },
  { name: "status", label: "Disponibilité", type: "select", required: true, options: opts(productStatusLabels) },
  { name: "description", label: "Description", type: "textarea", full: true },
  { name: "indicativePrice", label: "Prix indicatif", type: "text", help: "Ex. « Tarif solidaire » — jamais de quantité exacte" },
  { name: "accessConditions", label: "Conditions d'accès", type: "text", full: true },
  { name: "memberBenefit", label: "Avantage membre", type: "text", full: true },
];

export const resourceFields: FieldDef[] = [
  { name: "title", label: "Titre", type: "text", required: true, full: true },
  { name: "category", label: "Catégorie", type: "select", required: true, options: opts(resourceCategoryLabels) },
  { name: "format", label: "Format", type: "select", required: true, options: opts(resourceFormatLabels) },
  { name: "summary", label: "Résumé", type: "textarea", full: true },
  { name: "readingTime", label: "Temps de lecture", type: "text", help: "Ex. « 5 min »" },
  { name: "availableOffline", label: "Disponible hors-ligne", type: "checkbox" },
];
