"use client";

import { useState } from "react";

type Metric = { key: string; label: string; value: number };

/** Saisie/validation des indicateurs agrégés. Chaque validation est auditée
 *  (PATCH /api/v1/admin/metrics). Démo : non persisté côté serveur. */
export function MetricsEditor({ initial }: { initial: Metric[] }) {
  const [rows, setRows] = useState<Metric[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function setValue(key: string, value: number) {
    setRows((r) => r.map((m) => (m.key === key ? { ...m, value } : m)));
    if (saved === key) setSaved(null);
  }

  async function validate(m: Metric) {
    setBusy(m.key);
    setSaved(null);
    try {
      const res = await fetch("/api/v1/admin/metrics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: m.key, value: m.value }),
      });
      if (res.ok) setSaved(m.key);
      else alert("Action refusée.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-4 py-3">Indicateur</th>
            <th className="px-4 py-3">Valeur</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((m) => (
            <tr key={m.key}>
              <td className="px-4 py-3 font-medium text-ink">{m.label}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  min={0}
                  value={m.value}
                  onChange={(e) => setValue(m.key, Number(e.target.value))}
                  className="min-h-[40px] w-32 rounded-lg border border-line px-3"
                  aria-label={`Valeur — ${m.label}`}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  {saved === m.key && <span className="text-xs font-semibold text-success">Validé</span>}
                  <button
                    type="button"
                    onClick={() => validate(m)}
                    disabled={busy === m.key}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {busy === m.key ? "…" : "Valider"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
