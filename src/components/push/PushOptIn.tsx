"use client";

import { useEffect, useState } from "react";
import { departments } from "@/data/demo";

// Convertit la clé VAPID (base64url) en Uint8Array pour PushManager.subscribe.
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

const TOPICS = [
  { value: "general", label: "Informations générales" },
  { value: "depistages", label: "Dépistages & événements" },
  { value: "enfants", label: "Programme enfants" },
];

type State = "loading" | "unsupported" | "denied" | "off" | "on";

export function PushOptIn() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [department, setDepartment] = useState("");
  const [topics, setTopics] = useState<string[]>(["general"]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    if (!supported || !publicKey) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setState(sub ? "on" : "off"))
      .catch(() => setState("off"));
  }, [publicKey]);

  function toggleTopic(value: string) {
    setTopics((t) => (t.includes(value) ? t.filter((x) => x !== value) : [...t, value]));
  }

  async function subscribe() {
    setBusy(true);
    setError("");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState(perm === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey as string),
      });
      const res = await fetch("/api/v1/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), department: department || undefined, topics }),
      });
      if (!res.ok) throw new Error();
      setState("on");
    } catch {
      setError("Activation impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function unsubscribe() {
    setBusy(true);
    setError("");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/v1/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("off");
    } catch {
      setError("Désactivation impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") return <div className="card p-6 text-sm text-ink/60">Chargement…</div>;

  if (state === "unsupported") {
    return (
      <div className="card p-6 text-sm text-ink/70">
        Les notifications ne sont pas disponibles sur cet appareil ou ce navigateur.
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="card p-6 text-sm text-ink/70">
        Les notifications sont bloquées dans les réglages de votre navigateur. Autorisez-les pour cette
        page, puis rechargez.
      </div>
    );
  }

  if (state === "on") {
    return (
      <div className="card p-6">
        <p className="flex items-center gap-2 font-semibold text-success">Notifications activées</p>
        <p className="mt-1 text-sm text-ink/70">Vous recevrez les informations importantes de Diabaction Congo.</p>
        {error && <p className="mt-2 text-sm text-accent">{error}</p>}
        <button type="button" onClick={unsubscribe} disabled={busy} className="btn-outline mt-4">
          {busy ? "…" : "Désactiver les notifications"}
        </button>
      </div>
    );
  }

  // state === "off"
  return (
    <div className="card p-6">
      <p className="font-semibold text-ink">Choisissez ce que vous souhaitez recevoir</p>
      <fieldset className="mt-3 space-y-2">
        {TOPICS.map((t) => (
          <label key={t.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={topics.includes(t.value)}
              onChange={() => toggleTopic(t.value)}
              className="h-5 w-5 rounded border-line"
            />
            {t.label}
          </label>
        ))}
      </fieldset>

      <label className="mt-4 flex flex-col gap-1 text-sm">
        <span className="font-semibold text-ink">Votre département (optionnel)</span>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="min-h-[44px] rounded-lg border border-line bg-white px-3"
        >
          <option value="">Tous les départements</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>

      {error && <p className="mt-3 text-sm text-accent">{error}</p>}

      <button type="button" onClick={subscribe} disabled={busy} className="btn-primary mt-4">
        {busy ? "Activation…" : "Activer les notifications"}
      </button>
    </div>
  );
}
