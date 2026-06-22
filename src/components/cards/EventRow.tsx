import Link from "next/link";
import type { EventItem } from "@/data/demo";
import { eventTypeLabels } from "@/data/demo";
import { Icon } from "@/components/ui/Icon";
import { DatePill } from "@/components/ui/DatePill";
import { UpcomingBadge } from "@/components/ui/Badges";
import { timeRange } from "@/lib/format";

/** Ligne d'événement avec pastille date — voir « Prochains dépistages » du mockup. */
export function EventRow({ event }: { event: EventItem }) {
  return (
    <article className="flex items-start gap-3 border-b border-line py-4 last:border-b-0">
      <DatePill iso={event.startsAt} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-ink">
            <Link href={`/evenements/${event.slug}`} className="hover:text-primary">
              {event.title}
            </Link>
          </h3>
          <UpcomingBadge />
        </div>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-ink/70">
          <Icon name="map-pin" width={15} height={15} /> {event.locationLabel}
        </p>
        <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-ink/70">
          <Icon name="clock" width={15} height={15} /> {timeRange(event.startsAt, event.endsAt)}
        </p>
        <span className="mt-2 inline-block badge bg-primary-soft text-primary">
          {eventTypeLabels[event.type]}
        </span>
      </div>
    </article>
  );
}
