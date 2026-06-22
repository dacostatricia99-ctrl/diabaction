import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/guards";
import { sessionCan } from "@/lib/auth/session";
import { adminNav } from "@/lib/adminNav";
import { Logo } from "@/components/brand/Logo";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Admin Diabaction" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/connexion?next=/admin");

  // Ne présenter que les modules autorisés pour les rôles de l'utilisateur.
  const items = adminNav.filter((i) => sessionCan(user, i.permission));
  if (items.length === 0) redirect("/acces-refuse");

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="container-page flex h-14 items-center justify-between">
          <Link href="/admin" aria-label="Administration">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink/70 sm:inline">
              {user.name} · <span className="text-ink/50">{user.roles.join(", ")}</span>
            </span>
            <Link href="/" className="text-sm text-ink/70 hover:text-primary">Voir le site</Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container-page grid gap-6 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="card p-3">
            <AdminSidebar items={items} />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
