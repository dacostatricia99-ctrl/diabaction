"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { type Center } from "@/data/demo";
import { CenterCard } from "@/components/cards/CenterCard";
import { Icon } from "@/components/ui/Icon";

// Carte chargée à la demande (ssr:false) pour préserver la bande passante.
const CentersMap = dynamic(() => import("@/components/map/CentersMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-card bg-primary-soft text-primary/70">
      Chargement de la carte…
    </div>
  ),
});

const ALL = "Tous";

function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function CentersExplorer({ centers: allCenters }: { centers: Center[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [service, setService] = useState(ALL);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "error">("idle");

  const departments = useMemo(
    () => [ALL, ...Array.from(new Set(allCenters.map((c) => c.department)))],
    [allCenters]
  );
  const services = useMemo(
    () => [ALL, ...Array.from(new Set(allCenters.flatMap((c) => c.services)))],
    [allCenters]
  );

  let results: Center[] = allCenters.filter((c) => {
    const q = query.trim().toLowerCase();
    const matchQuery = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
    const matchDept = department === ALL || c.department === department;
    const matchService = service === ALL || c.services.includes(service);
    return matchQuery && matchDept && matchService;
  });

  if (userPos) {
    results = [...results].sort(
      (a, b) => distanceKm(userPos, [a.lat, a.lng]) - distanceKm(userPos, [b.lat, b.lng])
    );
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setGeoState("error");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setGeoState("idle");
      },
      () => setGeoState("error"),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  return (
    <div>
      {/* Filtres : recherche ville, département, service + géolocalisation */}
      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Rechercher</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ville ou centre…"
            className="min-h-[44px] rounded-lg border border-line px-3"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Département</span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="min-h-[44px] rounded-lg border border-line px-3"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Service</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="min-h-[44px] rounded-lg border border-line px-3"
          >
            {services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-ink">Autour de moi</span>
          <button type="button" onClick={locate} className="btn-outline min-h-[44px]">
            <Icon name="map-pin" width={18} height={18} />
            {geoState === "loading" ? "Localisation…" : "Me localiser"}
          </button>
        </div>
      </div>

      {geoState === "error" && (
        <p className="mb-4 text-sm text-accent">
          Localisation indisponible. Utilisez la recherche par ville ou département.
        </p>
      )}

      {/* Carte interactive */}
      <div className="mb-6 overflow-hidden rounded-card border border-line">
        <div className="h-[360px] w-full">
          <CentersMap centers={results} userPosition={userPos} />
        </div>
      </div>

      <p className="mb-4 text-sm text-ink/60" aria-live="polite">
        {results.length} centre{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
        {userPos ? " · triés par distance" : ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {results.map((c) => (
          <CenterCard key={c.slug} center={c} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="card p-6 text-center text-ink/60">Aucun centre ne correspond à votre recherche.</p>
      )}
    </div>
  );
}
