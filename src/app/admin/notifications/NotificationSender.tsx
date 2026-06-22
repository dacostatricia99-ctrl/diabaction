"use client";

import { useState } from "react";

const TOPICS = [
  { value: "", label: "Tous les thèmes" },
  { value: "general", label: "Informations générales" },
  { value: "depistages", label: "Dépistages & événements" },
  { value: "enfants", label: "Programme enfants" },
];

type Result = { matched: number; sent: number; failed: number; pruned: number };

export function NotificationSender({ departments }: { departments: string[] }) {
  const [values, setValues] = useState({ title: "", body: "", url: "", department: "", topic: "" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function set(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirm("Diffuser cette notification aux abonnés ciblés ?")) return;
    setSending(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/v1/admin/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Envoi impossible.");
        return;
      }
      setResult(json.data);
    } catch {
      setError("Réseau indisponible. Réessayez.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-2xl p-6">
      <div className="grid gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Titre <span className="text-accent">*</span></span>
          <input
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className="min-h-[44px] rounded-lg border border-line px-3"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Message <span className="text-accent">*</span></span>
          <textarea
            required
            rows={3}
            value={values.body}
            onChange={(e) => set("body", e.target.value)}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Lien à l'ouverture</span>
          <input
            value={values.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="/evenements"
            className="min-h-[44px] rounded-lg border border-line px-3"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-ink">Cibler un département</span>
            <select
              value={values.department}
              onChange={(e) => set("department", e.target.value)}
              className="min-h-[44px] rounded-lg border border-line bg-white px-3"
            >
              <option value="">Tous les départements</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-ink">Cibler un thème</span>
            <select
              value={values.topic}
              onChange={(e) => set("topic", e.target.value)}
              className="min-h-[44px] rounded-lg border border-line bg-white px-3"
            >
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-accent">{error}</p>}
      {result && (
        <p className="mt-4 rounded-lg bg-success-soft px-4 py-3 text-sm text-success">
          Diffusion effectuée : {result.sent} envoyée(s) sur {result.matched} ciblée(s)
          {result.failed > 0 && ` · ${result.failed} échec(s)`}
          {result.pruned > 0 && ` · ${result.pruned} abonnement(s) expiré(s) purgé(s)`}.
        </p>
      )}

      <button type="submit" disabled={sending} className="btn-primary mt-6">
        {sending ? "Envoi…" : "Diffuser la notification"}
      </button>
    </form>
  );
}
