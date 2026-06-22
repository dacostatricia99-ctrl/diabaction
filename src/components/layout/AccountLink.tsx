"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Me = { authenticated: boolean; landing?: string };

/** Lien de compte du chrome public. Résolu côté client (fetch /api/v1/me) pour
 *  préserver le rendu statique des pages publiques. Affiche « Connexion » par
 *  défaut, puis « Mon espace » si une session est détectée. */
export function AccountLink({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const [me, setMe] = useState<Me>({ authenticated: false });

  useEffect(() => {
    let active = true;
    fetch("/api/v1/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => active && setMe(j.data))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const href = me.authenticated ? me.landing ?? "/connexion" : "/connexion";
  const label = me.authenticated ? "Mon espace" : "Connexion";

  return (
    <Link href={href} onClick={onNavigate} className={className}>
      {label}
    </Link>
  );
}
