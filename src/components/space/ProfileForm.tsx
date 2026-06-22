"use client";

import { useState } from "react";
import type { MemberProfile } from "@/data/space";

const fields: { name: keyof MemberProfile; label: string; type: string; autoComplete: string; required?: boolean }[] = [
  { name: "firstName", label: "Prénom", type: "text", autoComplete: "given-name", required: true },
  { name: "lastName", label: "Nom", type: "text", autoComplete: "family-name", required: true },
  { name: "phone", label: "Téléphone", type: "tel", autoComplete: "tel" },
  { name: "city", label: "Ville", type: "text", autoComplete: "address-level2" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
];

/** Formulaire de profil pour les espaces connectés. Écrit via PUT /api/v1/me/profile
 *  (action journalisée). En démo, la valeur n'est pas persistée côté serveur. */
export function ProfileForm({ profile }: { profile: MemberProfile }) {
  const [values, setValues] = useState<MemberProfile>(profile);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("saving");
    setError("");
    try {
      const res = await fetch("/api/v1/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Enregistrement impossible.");
        setState("error");
        return;
      }
      setState("saved");
    } catch {
      setError("Réseau indisponible. Réessayez.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card grid max-w-xl gap-4 p-6">
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">
            {f.label}
            {f.required && <span className="text-accent"> *</span>}
          </span>
          <input
            name={f.name}
            type={f.type}
            required={f.required}
            autoComplete={f.autoComplete}
            value={values[f.name]}
            onChange={(e) => {
              setValues((v) => ({ ...v, [f.name]: e.target.value }));
              if (state === "saved") setState("idle");
            }}
            className="min-h-[44px] rounded-lg border border-line px-3"
          />
        </label>
      ))}

      {state === "error" && <p className="text-sm text-accent">{error}</p>}
      {state === "saved" && <p className="text-sm text-success">Profil enregistré.</p>}

      <button type="submit" disabled={state === "saving"} className="btn-primary w-fit">
        {state === "saving" ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
