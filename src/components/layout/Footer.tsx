import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { contact } from "@/data/demo";
import { telLink, whatsappLink, mailLink } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink/70">
            Ensemble contre le diabète en République du Congo. Prévenir, dépister, accompagner.
          </p>
        </div>

        <nav aria-label="Liens utiles">
          <h2 className="text-sm font-bold text-ink">Découvrir</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li><Link href="/centres" className="hover:text-primary">Trouver un centre</Link></li>
            <li><Link href="/evenements" className="hover:text-primary">Dépistages & événements</Link></li>
            <li><Link href="/programme-enfants" className="hover:text-primary">Programme enfants</Link></li>
            <li><Link href="/produits" className="hover:text-primary">Produits à tarif solidaire</Link></li>
            <li><Link href="/ressources" className="hover:text-primary">Ressources</Link></li>
          </ul>
        </nav>

        <nav aria-label="Association">
          <h2 className="text-sm font-bold text-ink">L'association</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li><Link href="/a-propos" className="hover:text-primary">À propos</Link></li>
            <li><Link href="/devenir-membre" className="hover:text-primary">Devenir membre</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/notifications" className="hover:text-primary">Notifications</Link></li>
            <li><Link href="/connexion" className="hover:text-primary">Espace connecté</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-ink">Nous contacter</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li>
              <a href={telLink(contact.phone)} className="inline-flex items-center gap-2 hover:text-primary">
                <Icon name="phone" width={16} height={16} /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={whatsappLink(contact.whatsapp)} className="inline-flex items-center gap-2 hover:text-primary">
                <Icon name="whatsapp" width={16} height={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={mailLink(contact.email)} className="inline-flex items-center gap-2 hover:text-primary">
                <Icon name="mail" width={16} height={16} /> {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-ink/60">
          <p>© {new Date().getFullYear()} Diabaction Congo. Produits accessibles à tous selon un modèle de tarif solidaire.</p>
          <Link href="/confidentialite" className="font-semibold hover:text-primary">
            Confidentialité & données personnelles
          </Link>
        </div>
      </div>
    </footer>
  );
}
