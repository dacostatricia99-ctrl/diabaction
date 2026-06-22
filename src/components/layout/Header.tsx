"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { AccountLink } from "@/components/layout/AccountLink";
import { primaryNav } from "@/lib/nav";
import { isPrivateArea } from "@/lib/spaces";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Les zones privées (admin, espaces connectés) possèdent leur propre chrome.
  if (isPrivateArea(pathname)) return null;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Accueil Diabaction Congo" className="shrink-0">
          {/* Version horizontale en desktop, symbole + texte compact en mobile */}
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-5">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm font-semibold transition-colors ${
                isActive(item.href) ? "text-primary" : "text-ink/80 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <AccountLink className="text-sm font-semibold text-ink/80 hover:text-primary" />
          <Link href="/contact" className="btn-outline">
            <Icon name="phone" width={18} height={18} />
            Contact
          </Link>
          <Link href="/devenir-membre" className="btn-accent">
            Devenir membre
          </Link>
        </div>

        {/* Mobile : cloche (notifications futures) + burger */}
        <div className="flex items-center gap-1 lg:hidden">
          <button type="button" className="p-2 text-ink/70" aria-label="Notifications">
            <Icon name="bell" width={22} height={22} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Ouvrir le menu"
            className="p-2 text-ink"
          >
            <Icon name="menu" width={24} height={24} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Menu mobile" className="lg:hidden border-t border-line bg-white">
          <ul className="container-page py-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-3 text-sm font-semibold ${
                    isActive(item.href) ? "bg-primary-soft text-primary" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <AccountLink
                onNavigate={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-semibold text-ink"
              />
            </li>
            <li className="flex gap-2 px-3 py-3">
              <Link href="/contact" onClick={() => setOpen(false)} className="btn-outline flex-1">
                Contact
              </Link>
              <Link href="/devenir-membre" onClick={() => setOpen(false)} className="btn-accent flex-1">
                Devenir membre
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
