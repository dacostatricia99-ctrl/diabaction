import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events, findEvent, eventTypeLabels } from "@/data/demo";
import { Icon } from "@/components/ui/Icon";
import { ContactActions } from "@/components/ui/ContactActions";
import { fullDate, timeRange } from "@/lib/format";

export function generateStaticParams() {
  return events.filter((e) => e.status === "publie").map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const event = findEvent(params.slug);
  if (!event) return { title: "Événement introuvable" };
  return { title: event.title, description: event.description };
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = findEvent(params.slug);
  if (!event || event.status !== "publie") notFound();

  return (
    <div className="container-page py-8">
      <Link href="/evenements" className="text-sm font-semibold text-primary">
        ← Tous les événements
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="badge bg-primary-soft text-primary">{eventTypeLabels[event.type]}</span>
          <h1 className="mt-2 text-2xl font-extrabold text-ink">{event.title}</h1>
          <p className="mt-3 text-ink/75">{event.description}</p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info icon="calendar" label="Date">{fullDate(event.startsAt)}</Info>
            <Info icon="clock" label="Horaire">{timeRange(event.startsAt, event.endsAt)}</Info>
            <Info icon="map-pin" label="Lieu">{event.locationLabel}</Info>
            <Info icon="users" label="Organisateur">{event.organizer}</Info>
            {event.capacity && <Info icon="users" label="Capacité">{event.capacity} personnes</Info>}
            <Info icon="phone" label="Téléphone">{event.phone}</Info>
          </dl>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <h2 className="font-bold text-ink">Participer / s'informer</h2>
            <div className="mt-3">
              <ContactActions
                phone={event.phone}
                whatsapp={event.phone}
                lat={undefined}
                lng={undefined}
                shareTitle={event.title}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-primary">
        <Icon name={icon} width={18} height={18} />
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</dt>
        <dd className="text-sm text-ink">{children}</dd>
      </div>
    </div>
  );
}
