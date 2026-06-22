import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import { findCenter } from "@/data/demo";
import { getMembership, membershipStatusLabels } from "@/data/space";
import { fullDate } from "@/lib/format";

export default async function MembreHome() {
  const user = await requirePermission(PERMISSIONS.MEMBERSHIP_STATUS_VIEW, "/membre");
  const membership = getMembership(user.id);
  const center = findCenter(membership.preferredCenter);

  const statusTone =
    membership.status === "active"
      ? "bg-primary-soft text-primary"
      : membership.status === "a_renouveler"
      ? "bg-accent-soft text-accent"
      : "bg-canvas text-ink/70";

  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Bonjour, {user.name}</h2>
      <p className="mt-1 text-sm text-ink/70">Voici un aperçu de votre adhésion et de vos avantages.</p>

      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Adhésion</p>
              <p className="mt-1 font-bold text-ink">{membership.tier}</p>
              <p className="mt-1 text-sm text-ink/60">N° {membership.memberId}</p>
            </div>
            <span className={`badge ${statusTone}`}>{membershipStatusLabels[membership.status]}</span>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-ink/50">Cotisation valable jusqu'au</dt>
              <dd className="font-semibold text-ink">{fullDate(membership.validUntil)}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Centre de rattachement</dt>
              <dd className="font-semibold text-ink">{center?.name ?? "—"}</dd>
            </div>
          </dl>
          <Link href="/membre/adhesion" className="btn-outline mt-4 inline-flex">
            Voir mon adhésion
            <Icon name="arrow" width={18} height={18} />
          </Link>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-ink">Accès rapides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/membre/avantages" className="flex items-center gap-2 text-ink/80 hover:text-primary">
                <Icon name="check" width={18} height={18} /> Avantages & tarifs préférentiels
              </Link>
            </li>
            <li>
              <Link href="/membre/profil" className="flex items-center gap-2 text-ink/80 hover:text-primary">
                <Icon name="users" width={18} height={18} /> Mettre à jour mon profil
              </Link>
            </li>
            <li>
              <Link href="/evenements" className="flex items-center gap-2 text-ink/80 hover:text-primary">
                <Icon name="calendar" width={18} height={18} /> Prochains dépistages & événements
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
