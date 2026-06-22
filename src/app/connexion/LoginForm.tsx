"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { landingForRoles } from "@/lib/spaces";
import type { RoleKey } from "@/lib/rbac";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Connexion impossible.");
        setLoading(false);
        return;
      }
      // Cible : `next` si fourni, sinon l'espace adapté aux rôles de l'utilisateur.
      const roles = (json.data?.roles ?? []) as RoleKey[];
      router.push(next || landingForRoles(roles));
      router.refresh();
    } catch {
      setError("Réseau indisponible. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-ink">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="min-h-[44px] rounded-lg border border-line px-3"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-ink">Mot de passe</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="min-h-[44px] rounded-lg border border-line px-3"
        />
      </label>

      {error && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
