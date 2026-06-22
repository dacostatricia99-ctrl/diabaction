"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FieldDef } from "@/lib/adminForms";

type Values = Record<string, string | number | boolean>;

/** Formulaire CRUD générique piloté par un schéma de champs.
 *  Crée (POST) ou modifie (PUT) une entité puis revient à la liste. */
export function EntityForm({
  fields,
  initial,
  method,
  action,
  backTo,
  submitLabel,
}: {
  fields: FieldDef[];
  initial: Values;
  method: "POST" | "PUT";
  action: string;
  backTo: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(name: string, value: string | boolean) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(action, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Enregistrement impossible.");
        setSaving(false);
        return;
      }
      router.push(backTo);
      router.refresh();
    } catch {
      setError("Réseau indisponible. Réessayez.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `f-${f.name}`;
          if (f.type === "checkbox") {
            return (
              <label key={f.name} className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  id={id}
                  type="checkbox"
                  checked={Boolean(values[f.name])}
                  onChange={(e) => set(f.name, e.target.checked)}
                  className="h-5 w-5 rounded border-line"
                />
                <span className="font-semibold text-ink">{f.label}</span>
              </label>
            );
          }
          const wrapCls = `flex flex-col gap-1 text-sm ${f.full || f.type === "textarea" ? "sm:col-span-2" : ""}`;
          return (
            <label key={f.name} htmlFor={id} className={wrapCls}>
              <span className="font-semibold text-ink">
                {f.label}
                {f.required && <span className="text-accent"> *</span>}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  id={id}
                  required={f.required}
                  rows={3}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="rounded-lg border border-line px-3 py-2"
                />
              ) : f.type === "select" ? (
                <select
                  id={id}
                  required={f.required}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="min-h-[44px] rounded-lg border border-line bg-white px-3"
                >
                  <option value="" disabled>
                    Sélectionner…
                  </option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type={f.type}
                  step={f.step}
                  required={f.required}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="min-h-[44px] rounded-lg border border-line px-3"
                />
              )}
              {f.help && <span className="text-xs text-ink/50">{f.help}</span>}
            </label>
          );
        })}
      </div>

      {error && <p className="mt-4 text-sm text-accent">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Enregistrement…" : submitLabel}
        </button>
        <button type="button" onClick={() => router.push(backTo)} className="btn-outline">
          Annuler
        </button>
      </div>
    </form>
  );
}
