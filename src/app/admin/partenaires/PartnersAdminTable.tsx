"use client";

import { useState } from "react";
import { partnerStatusLabels, type Partner, type PartnerStatus } from "@/data/impact";
import { fullDate } from "@/lib/format";

export function PartnersAdminTable({ initial }: { initial: Partner[] }) {
  const [rows, setRows] = useState<Partner[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(p: Partner) {
    const next: PartnerStatus = p.status === "actif" ? "suspendu" : "actif";
    const verb = next === "suspendu" ? "Suspendre" : "Réactiver";
    if (!confirm(`${verb} le partenaire « ${p.name} » ?`)) return;
    setBusy(p.id);
    try {
      const res = await fetch(`/api/v1/admin/partners/${p.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) setRows((r) => r.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
      else alert("Action refusée.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-4 py-3">Partenaire</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Depuis</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((p) => (
            <tr key={p.id} className={p.status === "suspendu" ? "opacity-60" : ""}>
              <td className="px-4 py-3">
                <span className="font-medium text-ink">{p.name}</span>
                <span className="block text-xs text-ink/50">{p.sector}</span>
              </td>
              <td className="px-4 py-3 text-ink/70">{p.type}</td>
              <td className="px-4 py-3 text-ink/70">{fullDate(p.since)}</td>
              <td className="px-4 py-3">
                <span
                  className={`badge ${p.status === "actif" ? "bg-success-soft text-success" : "bg-accent-soft text-accent"}`}
                >
                  {partnerStatusLabels[p.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => toggle(p)}
                  disabled={busy === p.id}
                  className={`text-xs font-semibold hover:underline ${
                    p.status === "actif" ? "text-accent" : "text-primary"
                  }`}
                >
                  {busy === p.id ? "…" : p.status === "actif" ? "Suspendre" : "Réactiver"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
