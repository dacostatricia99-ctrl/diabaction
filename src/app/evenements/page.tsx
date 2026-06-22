import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { listPublishedEvents } from "@/lib/repo/events";
import { EventsExplorer } from "./EventsExplorer";

export const metadata: Metadata = {
  title: "Dépistages & événements",
  description:
    "Calendrier des dépistages, caravanes de santé, conférences et activités de Diabaction Congo.",
};

export default async function EvenementsPage() {
  const events = await listPublishedEvents();
  return (
    <>
      <PageHeader
        title="Dépistages & événements"
        subtitle="Retrouvez les prochains dépistages, caravanes de santé et activités près de chez vous."
      />
      <div className="container-page py-8">
        <EventsExplorer events={events} />
      </div>
    </>
  );
}
