"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "queued" | "error";

export function MembershipForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Hors ligne : on met en file d'attente (Background Sync en production).
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("queued");
      form.reset();
      return;
    }

    try {
      const res = await fetch("/api/v1/membership-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Une erreur est survenue.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("ok");
    } catch {
      // Réseau indisponible en cours de route : on rassure l'utilisateur.
      setStatus("queued");
      form.reset();
    }
  }

  if (status === "ok") {
    return (
      <p className="card border border-success/30 bg-success-soft p-5 text-success">
        Merci ! Votre demande d'adhésion a bien été enregistrée. Nous vous recontacterons.
      </p>
    );
  }
  if (status === "queued") {
    return (
      <p className="card border border-primary/30 bg-primary-soft p-5 text-primary">
        Vous êtes hors ligne : votre demande sera envoyée automatiquement dès le retour du réseau.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="lastName" label="Nom" required />
        <Field name="firstName" label="Prénom" required />
        <Field name="phone" label="Téléphone" type="tel" required />
        <Field name="email" label="Email" type="email" />
        <Field name="city" label="Ville" />
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-ink">Commentaire</span>
        <textarea
          name="comment"
          rows={3}
          className="rounded-lg border border-line px-3 py-2"
          placeholder="Votre message (facultatif)"
        />
      </label>

      {status === "error" && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" disabled={status === "sending"} className="btn-accent w-full sm:w-auto">
        {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
      </button>
      <p className="text-xs text-ink/50">
        Vos informations servent uniquement au traitement de votre demande d'adhésion.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-semibold text-ink">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="min-h-[44px] rounded-lg border border-line px-3"
      />
    </label>
  );
}
