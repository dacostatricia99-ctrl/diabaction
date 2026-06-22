"use client";

import { useState } from "react";
import Link from "next/link";
import { resourceCategoryLabels, resourceFormatLabels, type Resource } from "@/data/demo";

type Row = Resource & { archived?: boolean };

export function ResourcesAdminTable({ initial }: { initial: Resource[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function archive(slug: string) {
    if (!confirm("Archiver cette ressource ? (suppression logique)")) return;
    setBusy(slug);
    try {
      const res = await fetch(`/api/v1/admin/resources/${slug}/archive`, { method: "POST" });
      if (res.ok) setRows((r) => r.map((x) => (x.slug === slug ? { ...x, archived: true } : x)));
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
            <th className="px-4 py-3">Ressource</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3">Format</th>
            <th className="px-4 py-3">Hors-ligne</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.slug} className={r.archived ? "opacity-50" : ""}>
              <td className="px-4 py-3 font-medium text-ink">{r.title}</td>
              <td className="px-4 py-3 text-ink/70">{resourceCategoryLabels[r.category]}</td>
              <td className="px-4 py-3 text-ink/70">{resourceFormatLabels[r.format]}</td>
              <td className="px-4 py-3 text-ink/70">{r.availableOffline ? "Oui" : "—"}</td>
              <td className="px-4 py-3 text-right">
                {r.archived ? (
                  <span className="badge-muted">Archivé</span>
                ) : (
                  <div className="inline-flex gap-3">
                    <Link
                      href={`/admin/ressources/${r.slug}/modifier`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => archive(r.slug)}
                      disabled={busy === r.slug}
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
