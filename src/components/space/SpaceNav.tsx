"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type { SpaceNavItem } from "@/lib/spaces";

/** Sous-navigation horizontale d'un espace connecté — ne reçoit que les
 *  modules autorisés (filtrés serveur). Défilement horizontal en mobile. */
export function SpaceNav({ items }: { items: SpaceNavItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => {
    // Les onglets racines (/membre, /pro) ne sont actifs qu'en correspondance exacte.
    const isRoot = href === "/membre" || href === "/pro";
    return isRoot ? pathname === href : pathname.startsWith(href);
  };

  return (
    <nav aria-label="Navigation de l'espace" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      <ul className="flex min-w-max gap-1 border-b border-line">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? "border-primary text-primary"
                  : "border-transparent text-ink/70 hover:text-primary"
              }`}
            >
              <Icon name={item.icon} width={18} height={18} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
