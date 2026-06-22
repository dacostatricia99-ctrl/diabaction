import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { sessionCan } from "@/lib/auth/session";
import { spaceConfig, type SpaceArea } from "@/lib/spaces";
import { Logo } from "@/components/brand/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { SpaceNav } from "@/components/space/SpaceNav";

/** Chrome partagé des espaces connectés (membre & professionnel).
 *  Garde l'accès via la permission de la zone et n'affiche que les onglets
 *  autorisés — voir docs/03-rbac-securite.md. */
export async function SpaceShell({
  area,
  children,
}: {
  area: SpaceArea;
  children: React.ReactNode;
}) {
  const config = spaceConfig[area];
  const user = await requirePermission(config.guard, `/${area}`);
  const items = config.nav.filter((i) => sessionCan(user, i.permission));

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-white print:hidden">
        <div className="container-page flex h-14 items-center justify-between">
          <Link href={`/${area}`} aria-label={config.title}>
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink/70 sm:inline">{user.name}</span>
            <Link href="/" className="text-sm text-ink/70 hover:text-primary">Voir le site</Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="bg-primary text-white print:hidden">
        <div className="container-page py-6">
          <h1 className="text-xl font-extrabold sm:text-2xl">{config.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/85">{config.subtitle}</p>
        </div>
      </div>

      <div className="container-page print:hidden">
        <SpaceNav items={items} />
      </div>

      <main className="container-page py-6">{children}</main>
    </div>
  );
}
