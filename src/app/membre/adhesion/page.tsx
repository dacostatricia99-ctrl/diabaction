import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import { findCenter, contact } from "@/data/demo";
import { getMembership, membershipStatusLabels } from "@/data/space";
import { fullDate, telLink, whatsappLink } from "@/lib/format";

export const metadata: Metadata = { title: "Mon adhésion" };

export default async function MembreAdhesionPage() {
  const user = await requirePermission(PERMISSIONS.MEMBERSHIP_STATUS_VIEW, "/membre");
  const membership = getMembership(user.id);
  const center = findCenter(membership.preferredCenter);
  const renewSoon = membership.status === "a_renouveler" || membership.status === "expiree";

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold text-ink">Mon adhésion</h2>

      <section className="card mt-4 overflow-hidden">
        <div className="bg-primary px-5 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Carte de membre</p>
          <p className="mt-1 text-lg font-extrabold">{user.name}</p>
          <p className="text-sm text-white/85">N° {membership.memberId}</p>
        </div>
        <dl className="grid gap-4 p-5 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-ink/50">Statut</dt>
            <dd className="font-semibold text-ink">{membershipStatusLabels[membership.status]}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Offre</dt>
            <dd className="font-semibold text-ink">{membership.tier}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Membre depuis</dt>
            <dd className="font-semibold text-ink">{fullDate(membership.since)}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Cotisation valable jusqu'au</dt>
            <dd className="font-semibold text-ink">{fullDate(membership.validUntil)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-ink/50">Centre de rattachement</dt>
            <dd className="font-semibold text-ink">
              {center ? (
                <Link href={`/centres/${center.slug}`} className="text-primary hover:underline">
                  {center.name}
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card mt-4 p-5">
        <h3 className="font-bold text-ink">{renewSoon ? "Renouveler ma cotisation" : "Renouvellement"}</h3>
        <p className="mt-1 text-sm text-ink/70">
          Le renouvellement de la cotisation, à tarif solidaire, s'effectue auprès de votre centre de
          rattachement ou de l'association.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={telLink(contact.phone)} className="btn-primary">
            <Icon name="phone" width={18} height={18} /> Appeler
          </a>
          <a href={whatsappLink(contact.whatsapp)} className="btn-outline" target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" width={18} height={18} /> WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
