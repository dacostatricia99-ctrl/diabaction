import Link from "next/link";
import type { Product } from "@/data/demo";
import { ProductStatusBadge } from "@/components/ui/Badges";
import { Icon } from "@/components/ui/Icon";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card flex gap-4 p-4">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"
        aria-hidden="true"
      >
        <Icon name="shield" width={28} height={28} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-ink">
            <Link href={`/produits/${product.slug}`} className="hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <ProductStatusBadge status={product.status} />
        </div>
        <p className="mt-1 text-sm text-ink/70">{product.accessConditions}</p>
        <p className="mt-1 text-sm font-medium text-primary">{product.memberBenefit}</p>
      </div>
    </article>
  );
}
