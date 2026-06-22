"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "queued" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("queued");
      form.reset();
      return;
    }
    try {
      const res = await fetch("/api/v1/contact", {
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
      setStatus("queued");
      form.reset();
    }
  }

  if (status === "ok") {
    return (
      <p className="card border border-success/30 bg-success-soft p-5 text-success">
        Merci ! Votre message a bien été envoyé.
      </p>
    );
  }
  if (status === "queued") {
    return (
      <p className="card border border-primary/30 bg-primary-soft p-5 text-primary">
        Hors ligne : votre message sera envoyé dès le retour du réseau.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-ink">Nom <span className="text-accent">*</span></span>
        <input name="name" required className="min-h-[44px] rounded-lg border border-line px-3" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Téléphone</span>
          <input name="phone" type="tel" className="min-h-[44px] rounded-lg border border-line px-3" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Email</span>
          <input name="email" type="email" className="min-h-[44px] rounded-lg border border-line px-3" />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-ink">Message</span>
        <textarea name="message" rows={4} className="rounded-lg border border-line px-3 py-2" />
      </label>

      {status === "error" && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto">
        {status === "sending" ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
