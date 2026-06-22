import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { sessionCan } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/rbac";
import { Icon } from "@/components/ui/Icon";
import { memberBenefits, preferentialPrices } from "@/data/space";

export const metadata: Metadata = { title: "Avantages & tarifs" };

export default async function MembreAvantagesPage() {
  const user = await requirePermission(PERMISSIONS.MEMBER_BENEFITS_VIEW, "/membre");
  const canSeePrices = sessionCan(user, PERMISSIONS.MEMBER_PRICES_VIEW);

  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Vos avantages membre</h2>
      <p className="mt-1 text-sm text-ink/70">
        Votre adhésion vous donne accès aux avantages suivants.
      </p>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        {memberBenefits.map((b) => (
          <div key={b.title} className="card flex gap-3 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Icon name={b.icon} width={20} height={20} />
            </span>
            <div>
              <h3 className="font-bold text-ink">{b.title}</h3>
              <p className="mt-1 text-sm text-ink/70">{b.text}</p>
            </div>
          </div>
        ))}
      </section>

      {canSeePrices && (
        <section className="mt-6">
          <h3 className="font-bold text-ink">Tarifs préférentiels</h3>
          <p className="mt-1 text-sm text-ink/70">
            Avantage membre sur les produits à tarif solidaire. Les conditions précises sont indiquées en
            centre.
          </p>
          <div className="card mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-ink/60">
                  <th className="px-4 py-3 font-semibold">Produit</th>
                  <th className="px-4 py-3 font-semibold">Accès public</th>
                  <th className="px-4 py-3 font-semibold">Avantage membre</th>
                </tr>
              </thead>
              <tbody>
                {preferentialPrices.map((p) => (
                  <tr key={p.productSlug} className="border-b border-line/60 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">
                      <Link href={`/produits/${p.productSlug}`} className="hover:text-primary">
                        {p.product}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{p.publicAccess}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-primary-soft text-primary">{p.memberAccess}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink/50">
            Aucune quantité ni prix exact n'est communiqué en ligne. Renseignez-vous auprès de votre centre.
          </p>
        </section>
      )}
    </div>
  );
}
