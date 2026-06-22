"use client";

import { useState } from "react";
import Link from "next/link";
import { eventTypeLabels, type EventItem, type EventStatus } from "@/data/demo";
import { fullDate } from "@/lib/format";

const STATUSES: EventStatus[] = ["brouillon", "publie", "termine", "annule"];
const statusLabels: Record<EventStatus, string> = {
  brouillon: "Brouillon",
  publie: "Publié",
  termine: "Terminé",
  annule: "Annulé",
};

type Row = EventItem & { archived?: boolean };

export function EventsAdminTable({ initial }: { initial: EventItem[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function changeStatus(slug: string, status: EventStatus) {
    setBusy(slug);
    try {
      const res = await fetch(`/api/v1/admin/events/${slug}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRows((r) => r.map((e) => (e.slug === slug ? { ...e, status } : e)));
      } else {
        alert("Action refusée.");
      }
    } finally {
      setBusy(null);
    }
  }

  async function archive(slug: string) {
    if (!confirm("Archiver cet événement ? (suppression logique)")) return;
    setBusy(slug);
    try {
      const res = await fetch(`/api/v1/admin/events/${slug}/archive`, { method: "POST" });
      if (res.ok) setRows((r) => r.map((e) => (e.slug === slug ? { ...e, archived: true } : e)));
      else alert("Action refusée.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-4 py-3">Événement</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((e) => (
            <tr key={e.slug} className={e.archived ? "opacity-50" : ""}>
              <td className="px-4 py-3 font-medium text-ink">{e.title}</td>
              <td className="px-4 py-3 text-ink/70">{eventTypeLabels[e.type]}</td>
              <td className="px-4 py-3 text-ink/70">{fullDate(e.startsAt)}</td>
              <td className="px-4 py-3">
                <label className="sr-only" htmlFor={`status-${e.slug}`}>Statut</label>
                <select
                  id={`status-${e.slug}`}
                  value={e.status}
                  disabled={busy === e.slug || e.archived}
                  onChange={(ev) => changeStatus(e.slug, ev.target.value as EventStatus)}
                  className="min-h-[36px] rounded-lg border border-line px-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-right">
                {e.archived ? (
                  <span className="badge-muted">Archivé</span>
                ) : (
                  <div className="inline-flex gap-3">
                    <Link
                      href={`/admin/evenements/${e.slug}/modifier`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => archive(e.slug)}
                      disabled={busy === e.slug}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Archiver
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
