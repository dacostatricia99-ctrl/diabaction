import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import { proResources, protocols, trainings } from "@/data/space";

export default async function ProHome() {
  const user = await requirePermission(PERMISSIONS.RESOURCES_VIEW_PRO, "/pro");
  const openTrainings = trainings.filter((t) => t.status === "ouvert").length;

  const tiles = [
    { href: "/pro/ressources", label: "Ressources pro", icon: "book", count: proResources.length, note: "documents" },
    { href: "/pro/protocoles", label: "Protocoles", icon: "shield", count: protocols.length, note: "protocoles" },
    { href: "/pro/formations", label: "Formations", icon: "graduation", count: openTrainings, note: "sessions ouvertes" },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Bonjour, {user.name}</h2>
      <p className="mt-1 text-sm text-ink/70">
        Accédez aux ressources, protocoles et formations validés par l'association.
      </p>

      <section className="mt-5 grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card p-5 transition-shadow hover:shadow-float">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Icon name={t.icon} width={20} height={20} />
            </span>
            <p className="mt-3 text-2xl font-extrabold text-primary">{t.count}</p>
            <p className="text-sm font-semibold text-ink">{t.label}</p>
            <p className="text-xs text-ink/60">{t.note}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
