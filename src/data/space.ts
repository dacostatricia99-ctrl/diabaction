// Données de démonstration des espaces connectés (Lot 3) — membre & professionnel.
// En production : tables `memberships`, `member_profiles`, `pro_resources`,
// `protocols`, `trainings` (Prisma/PostgreSQL). Le front fonctionne sans base.
// Contraintes éditoriales : jamais « don »/« gratuit » ni quantité produit exacte.

export type MembershipStatus = "active" | "a_renouveler" | "expiree" | "en_attente";

export const membershipStatusLabels: Record<MembershipStatus, string> = {
  active: "Active",
  a_renouveler: "À renouveler",
  expiree: "Expirée",
  en_attente: "En attente de validation",
};

export type Membership = {
  memberId: string; // identifiant adhérent affiché
  status: MembershipStatus;
  since: string; // ISO — première adhésion
  validUntil: string; // ISO — échéance cotisation
  tier: string; // libellé d'offre (tarif solidaire)
  preferredCenter: string; // slug du centre de rattachement
};

export type MemberProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  email: string;
};

// Adhésions et profils indexés par identifiant d'utilisateur (voir src/lib/auth/users.ts).
const memberships: Record<string, Membership> = {
  "u-membre": {
    memberId: "ADH-2024-0540",
    status: "active",
    since: "2024-02-10",
    validUntil: "2026-12-31",
    tier: "Adhésion individuelle — cotisation à tarif solidaire",
    preferredCenter: "centre-diabetologie-brazzaville",
  },
};

const profiles: Record<string, MemberProfile> = {
  "u-membre": {
    firstName: "Membre",
    lastName: "Démo",
    phone: "+242060000010",
    city: "Brazzaville",
    email: "membre@diabaction.cg",
  },
};

// Adhésion par défaut (membre sans fiche dédiée) : statut en attente, neutre.
export function getMembership(userId: string): Membership {
  return (
    memberships[userId] ?? {
      memberId: "—",
      status: "en_attente",
      since: new Date().toISOString().slice(0, 10),
      validUntil: new Date().toISOString().slice(0, 10),
      tier: "Adhésion individuelle — cotisation à tarif solidaire",
      preferredCenter: "centre-diabetologie-brazzaville",
    }
  );
}

export function getMemberProfile(
  userId: string,
  fallback: { fullName: string; email: string }
): MemberProfile {
  if (profiles[userId]) return profiles[userId];
  const [firstName, ...rest] = fallback.fullName.split(" ");
  return {
    firstName: firstName ?? "",
    lastName: rest.join(" "),
    phone: "",
    city: "",
    email: fallback.email,
  };
}

// Avantages membre — bénéfices non monétaires + accès tarifs préférentiels.
export const memberBenefits: { title: string; text: string; icon: string }[] = [
  { title: "Tarifs préférentiels", text: "Avantage membre sur les produits à tarif solidaire (insuline, bandelettes, consommables).", icon: "check" },
  { title: "Accompagnement prioritaire", text: "Orientation et soutien personnalisé dans les centres de rattachement.", icon: "heart" },
  { title: "Invitations aux événements", text: "Accès facilité aux ateliers d'éducation thérapeutique et aux dépistages.", icon: "calendar" },
  { title: "Informations dédiées", text: "Notifications sur les nouveautés, campagnes et ressources utiles.", icon: "bell" },
];

// Tarifs préférentiels : libellés uniquement (jamais de quantité ni de prix exact).
export type PreferentialPrice = {
  productSlug: string;
  product: string;
  publicAccess: string;
  memberAccess: string;
};

export const preferentialPrices: PreferentialPrice[] = [
  { productSlug: "insuline", product: "Insuline", publicAccess: "Tarif solidaire", memberAccess: "Tarif préférentiel membre" },
  { productSlug: "bandelettes-reactives", product: "Bandelettes réactives", publicAccess: "Tarif solidaire", memberAccess: "Tarif préférentiel membre" },
  { productSlug: "glucometre", product: "Glucomètre", publicAccess: "Tarif solidaire", memberAccess: "Tarif préférentiel membre" },
  { productSlug: "aiguilles", product: "Aiguilles pour stylo", publicAccess: "Tarif solidaire", memberAccess: "Tarif préférentiel membre" },
];

// ——— Espace professionnel de santé ———

export type ProResource = {
  slug: string;
  title: string;
  summary: string;
  format: "pdf" | "article" | "video";
  category: string;
  validated: boolean; // document validé, téléchargeable
  updatedAt: string; // ISO
};

export const proResources: ProResource[] = [
  {
    slug: "depistage-procedure",
    title: "Procédure de dépistage en caravane",
    summary: "Déroulé standardisé d'une session de dépistage : accueil, mesure, orientation.",
    format: "pdf",
    category: "Dépistage",
    validated: true,
    updatedAt: "2026-05-20",
  },
  {
    slug: "education-therapeutique-supports",
    title: "Supports d'éducation thérapeutique",
    summary: "Fiches patient à imprimer : alimentation, activité physique, observance.",
    format: "pdf",
    category: "Éducation thérapeutique",
    validated: true,
    updatedAt: "2026-04-12",
  },
  {
    slug: "diabete-enfant-reperes",
    title: "Repères de prise en charge du diabète de l'enfant",
    summary: "Spécificités pédiatriques et coordination avec le programme enfants.",
    format: "article",
    category: "Pédiatrie",
    validated: true,
    updatedAt: "2026-03-30",
  },
  {
    slug: "webinaire-complications",
    title: "Webinaire — prévention des complications",
    summary: "Enregistrement de la session sur le dépistage des complications (pieds, yeux, reins).",
    format: "video",
    category: "Prévention",
    validated: false,
    updatedAt: "2026-02-18",
  },
];

export type Protocol = {
  slug: string;
  title: string;
  summary: string;
  reference: string; // référence interne / version
  level: "national" | "centre";
  updatedAt: string;
};

export const protocols: Protocol[] = [
  {
    slug: "prise-en-charge-type-2",
    title: "Prise en charge du diabète de type 2",
    summary: "Conduite à tenir : diagnostic, objectifs glycémiques, suivi et orientation.",
    reference: "PROT-DT2 v3",
    level: "national",
    updatedAt: "2026-05-02",
  },
  {
    slug: "urgences-hypoglycemie",
    title: "Conduite face à une hypoglycémie",
    summary: "Reconnaissance des signes et gestes d'urgence en consultation.",
    reference: "PROT-HYPO v2",
    level: "national",
    updatedAt: "2026-04-05",
  },
  {
    slug: "suivi-grossesse",
    title: "Suivi du diabète gestationnel",
    summary: "Surveillance et coordination ville-hôpital pendant la grossesse.",
    reference: "PROT-DG v1",
    level: "national",
    updatedAt: "2026-03-15",
  },
];

export type Training = {
  slug: string;
  title: string;
  summary: string;
  startsAt: string; // ISO
  mode: "presentiel" | "distanciel";
  location: string;
  status: "ouvert" | "complet" | "termine";
};

export const trainings: Training[] = [
  {
    slug: "formation-education-therapeutique",
    title: "Éducation thérapeutique du patient diabétique",
    summary: "Deux jours pour structurer l'accompagnement éducatif en centre.",
    startsAt: "2026-07-21T08:00:00+01:00",
    mode: "presentiel",
    location: "Brazzaville",
    status: "ouvert",
  },
  {
    slug: "formation-depistage-terrain",
    title: "Organiser un dépistage de terrain",
    summary: "Méthodologie, logistique et orientation des personnes dépistées.",
    startsAt: "2026-08-11T08:00:00+01:00",
    mode: "presentiel",
    location: "Pointe-Noire",
    status: "ouvert",
  },
  {
    slug: "webinaire-protocoles-2026",
    title: "Webinaire — mise à jour des protocoles 2026",
    summary: "Présentation à distance des évolutions des protocoles nationaux.",
    startsAt: "2026-06-05T15:00:00+01:00",
    mode: "distanciel",
    location: "En ligne",
    status: "termine",
  },
];

export const trainingStatusLabels: Record<Training["status"], string> = {
  ouvert: "Inscriptions ouvertes",
  complet: "Complet",
  termine: "Terminée",
};
