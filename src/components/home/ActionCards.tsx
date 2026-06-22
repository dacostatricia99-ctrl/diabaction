import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const actions = [
  {
    href: "/centres",
    icon: "map-pin",
    title: "Trouver un centre",
    text: "Localisez les centres de prise en charge et services disponibles.",
    cta: "Voir la carte",
    tone: "text-primary bg-primary-soft",
  },
  {
    href: "/evenements",
    icon: "calendar",
    title: "Dépistages & événements",
    text: "Consultez le calendrier des dépistages et événements.",
    cta: "Voir le calendrier",
    tone: "text-accent bg-accent-soft",
  },
  {
    href: "/programme-enfants",
    icon: "users",
    title: "Aide pour les enfants",
    text: "Découvrez le programme dédié aux enfants de 0 à 18 ans.",
    cta: "En savoir plus",
    tone: "text-success bg-success-soft",
  },
  {
    href: "/ressources",
    icon: "book",
    title: "Ressources & conseils",
    text: "Accédez à nos ressources éducatives et pratiques.",
    cta: "Explorer",
    tone: "text-[#7C3AED] bg-[#F1ECFB]",
  },
] as const;

/** Les 4 actions prioritaires de l'accueil (grille 2×2 en mobile). */
export function ActionCards() {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {actions.map((a) => (
        <li key={a.href}>
          <Link href={a.href} className="card flex h-full flex-col p-4 transition-shadow hover:shadow-float lg:p-5">
            <span className={`flex h-12 w-12 items-center justify-center rounded-full ${a.tone}`}>
              <Icon name={a.icon} width={24} height={24} />
            </span>
            <h3 className="mt-3 font-bold text-ink">{a.title}</h3>
            <p className="mt-1 hidden text-sm text-ink/70 sm:block">{a.text}</p>
            <span className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              {a.cta} <Icon name="arrow" width={16} height={16} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
