"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type { AdminNavItem } from "@/lib/adminNav";

/** Navigation latérale admin — ne reçoit que les modules autorisés (filtrés serveur). */
export function AdminSidebar({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav aria-label="Navigation admin" className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
            isActive(item.href) ? "bg-primary text-white" : "text-ink/80 hover:bg-primary-soft"
          }`}
        >
          <Icon name={item.icon} width={18} height={18} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
