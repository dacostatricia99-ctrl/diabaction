import Link from "next/link";
import type { Center } from "@/data/demo";
import { Icon } from "@/components/ui/Icon";
import { CoverageBadge, OpenBadge } from "@/components/ui/Badges";
import { ContactActions } from "@/components/ui/ContactActions";

export function CenterCard({ center }: { center: Center }) {
  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-ink">
          <Link href={`/centres/${center.slug}`} className="hover:text-primary">
            {center.name}
          </Link>
        </h3>
        <OpenBadge open={center.isOpen} />
      </div>

      <p className="mt-1 inline-flex items-center gap-1 text-sm text-ink/70">
        <Icon name="map-pin" width={16} height={16} /> {center.address}
      </p>

      <p className="mt-2 line-clamp-2 text-sm text-ink/70">{center.description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <CoverageBadge level={center.coverageLevel} />
        {center.handlesChildren && <span className="badge bg-accent-soft text-accent">Prise en charge enfants</span>}
      </div>

      <p className="mt-3 inline-flex items-center gap-1 text-sm text-ink/70">
        <Icon name="clock" width={16} height={16} /> {center.hours}
      </p>

      <div className="mt-4">
        <ContactActions
          phone={center.phone}
          whatsapp={center.whatsapp}
          lat={center.lat}
          lng={center.lng}
          shareTitle={center.name}
        />
      </div>
    </article>
  );
}
