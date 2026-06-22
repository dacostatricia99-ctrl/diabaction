"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { mobileTabBar } from "@/lib/nav";
import { isPrivateArea } from "@/lib/spaces";

/** Barre de navigation basse mobile (5 entrées) — voir mockup. */
export function MobileTabBar() {
  const pathname = usePathname();
  if (isPrivateArea(pathname)) return null;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-primary text-white lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {mobileTabBar.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium ${
                isActive(item.href) ? "text-white" : "text-white/70"
              }`}
            >
              <Icon name={item.icon} width={22} height={22} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
