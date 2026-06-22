"use client";

import { Icon } from "@/components/ui/Icon";
import { telLink, whatsappLink, directionsLink } from "@/lib/format";

type Props = {
  phone: string;
  whatsapp?: string;
  lat?: number;
  lng?: number;
  shareTitle?: string;
  /** Disposition compacte (icônes) ou pleine (avec libellés). */
  compact?: boolean;
};

/** Actions de contact rapide : appeler · WhatsApp · itinéraire · partager. */
export function ContactActions({ phone, whatsapp, lat, lng, shareTitle, compact }: Props) {
  async function share() {
    const data = { title: shareTitle ?? "Diabaction Congo", url: typeof window !== "undefined" ? window.location.href : "" };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* annulé */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(data.url);
    }
  }

  const base = compact ? "btn-outline px-3" : "btn-outline flex-1";

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "w-full"}`}>
      <a href={telLink(phone)} className={`${base}`} aria-label="Appeler">
        <Icon name="phone" width={18} height={18} />
        {!compact && "Appeler"}
      </a>
      {whatsapp && (
        <a
          href={whatsappLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className={base}
          aria-label="Ouvrir WhatsApp"
        >
          <Icon name="whatsapp" width={18} height={18} />
          {!compact && "WhatsApp"}
        </a>
      )}
      {lat != null && lng != null && (
        <a
          href={directionsLink(lat, lng)}
          target="_blank"
          rel="noopener noreferrer"
          className={base}
          aria-label="Obtenir un itinéraire"
        >
          <Icon name="route" width={18} height={18} />
          {!compact && "Itinéraire"}
        </a>
      )}
      <button type="button" onClick={share} className={base} aria-label="Partager">
        <Icon name="share" width={18} height={18} />
        {!compact && "Partager"}
      </button>
    </div>
  );
}
