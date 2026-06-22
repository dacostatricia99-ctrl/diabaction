"use client";

import { Icon } from "@/components/ui/Icon";

/** Déclenche l'impression du navigateur (→ « Enregistrer en PDF »). */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-primary print:hidden">
      <Icon name="share" width={18} height={18} /> Imprimer / Enregistrer en PDF
    </button>
  );
}
