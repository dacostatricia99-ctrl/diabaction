"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Link from "next/link";
import type { Center } from "@/data/demo";

// Pin SVG de marque (bleu par défaut, rouge pour le centre actif) — évite les
// images de marqueur par défaut de Leaflet (problème de bundling) et reste léger.
function pinIcon(active: boolean) {
  const color = active ? "#E41E26" : "#1B3FA8";
  return L.divIcon({
    className: "",
    html: `<svg width="30" height="40" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 8 12 20 12 20s12-12 12-20C24 5.4 18.6 0 12 0z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/></svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
}

function FitBounds({ centers, center }: { centers: Center[]; center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
      return;
    }
    if (centers.length === 0) return;
    if (centers.length === 1) {
      map.setView([centers[0].lat, centers[0].lng], 13);
      return;
    }
    const bounds = L.latLngBounds(centers.map((c) => [c.lat, c.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, centers, center]);
  return null;
}

type Props = {
  centers: Center[];
  selectedSlug?: string;
  userPosition?: [number, number] | null;
};

export default function CentersMap({ centers, selectedSlug, userPosition }: Props) {
  const fallback: [number, number] = [-4.2634, 15.2429]; // Brazzaville
  const initial = centers[0] ? [centers[0].lat, centers[0].lng] as [number, number] : fallback;

  return (
    <MapContainer
      center={initial}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ minHeight: 320 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds centers={centers} center={userPosition ?? undefined} />

      {userPosition && (
        <Marker
          position={userPosition}
          icon={L.divIcon({
            className: "",
            html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:#2F855A;border:3px solid #fff;box-shadow:0 0 0 2px #2F855A"></span>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        >
          <Popup>Votre position</Popup>
        </Marker>
      )}

      {centers.map((c) => (
        <Marker key={c.slug} position={[c.lat, c.lng]} icon={pinIcon(c.slug === selectedSlug)}>
          <Popup>
            <strong className="block text-[13px]">{c.name}</strong>
            <span className="text-[12px] text-gray-600">{c.address}</span>
            <Link href={`/centres/${c.slug}`} className="mt-1 block text-[12px] font-semibold text-primary">
              Voir la fiche →
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
