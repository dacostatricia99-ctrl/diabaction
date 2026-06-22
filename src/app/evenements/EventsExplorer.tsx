"use client";

import { useState } from "react";
import { eventTypeLabels, type EventItem, type EventType } from "@/data/demo";
import { EventRow } from "@/components/cards/EventRow";

const ALL = "Tous";

export function EventsExplorer({ events }: { events: EventItem[] }) {
  const [type, setType] = useState<string>(ALL);
  const types = [ALL, ...Array.from(new Set(events.map((e) => e.type)))];
  const results = type === ALL ? events : events.filter((e) => e.type === type);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`badge min-h-[36px] px-3 ${
              type === t ? "bg-primary text-white" : "bg-white text-ink/70 border border-line"
            }`}
          >
            {t === ALL ? "Tous" : eventTypeLabels[t as EventType]}
          </button>
        ))}
      </div>

      <div className="card divide-y divide-line px-5">
        {results.map((e) => (
          <EventRow key={e.slug} event={e} />
        ))}
        {results.length === 0 && <p className="py-6 text-center text-ink/60">Aucun événement.</p>}
      </div>
    </div>
  );
}
