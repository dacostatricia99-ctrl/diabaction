// Aides de formatage et de contact rapide.

const MONTHS_SHORT = ["JANV", "FÉVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];

export function dateParts(iso: string) {
  const d = new Date(iso);
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS_SHORT[d.getMonth()] };
}

export function timeRange(startIso: string, endIso?: string) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h");
  return endIso ? `${fmt(startIso)} – ${fmt(endIso)}` : fmt(startIso);
}

export function fullDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Liens de contact direct (objectif « contacter en 1 clic »). */
export const telLink = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;
export const whatsappLink = (phone: string) => `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
export const mailLink = (email: string) => `mailto:${email}`;
export const directionsLink = (lat: number, lng: number) =>
  `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}`;
