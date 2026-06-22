"use client";

import { useState } from "react";
import Link from "next/link";
import type { Center } from "@/data/demo";
import { coverageLabels } from "@/data/demo";

type Row = Center & { archived?: boolean };

export function CentersAdminTable({ initial }: { initial: Center[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function archive(slug: string, id: string) {
    if (!confirm("Archiver ce centre ? (suppression logique)")) return;
    setBusy(slug);
    try {
      const res = await fetch(`/api/v1/admin/centers/${id}/archive`, { method: "POST" });
      if (res.ok) {
        setRows((r) => r.map((c) => (c.slug === slug ? { ...c, archived: true } : c)));
      } else {
        alert("Action refusée.");
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-4 py-3">Centre</th>
            <th className="px-4 py-3">Ville</th>
            <th className="px-4 py-3">Couverture</th>
            <th className="px-4 py-3">Enfants</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((c) => (
            <tr key={c.slug} className={c.archived ? "opacity-50" : ""}>
              <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
              <td className="px-4 py-3 text-ink/70">{c.city}</td>
              <td className="px-4 py-3 text-ink/70">{coverageLabels[c.coverageLevel]}</td>
              <td className="px-4 py-3">{c.handlesChildren ? "Oui" : "—"}</td>
              <td className="px-4 py-3 text-right">
                {c.archived ? (
                  <span className="badge-muted">Archivé</span>
                ) : (
                  <div className="inline-flex gap-3">
                    <Link
                      href={`/admin/centres/${c.slug}/modifier`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => archive(c.slug, c.slug)}
                      disabled={busy === c.slug}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      {busy === c.slug ? "…" : "Archiver"}
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
