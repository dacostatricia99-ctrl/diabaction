/* Service worker Diabaction Congo — offline partiel & faible bande passante.
   Stratégies : voir docs/01-architecture-technique.md §3. */
const VERSION = "v2";
const SHELL_CACHE = `shell-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const TILE_CACHE = `tiles-${VERSION}`;

// App shell minimal pré-mis en cache (accessible hors ligne).
const SHELL = ["/", "/centres", "/evenements", "/programme-enfants", "/contact", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => ![SHELL_CACHE, RUNTIME_CACHE, TILE_CACHE].includes(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isTile(url) {
  return /tile|\.png($|\?)/.test(url) && /openstreetmap|maptiler|tile/.test(url);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // mutations gérées par Background Sync (futur)

  const url = new URL(request.url);

  // Tuiles carte : CacheFirst, limité.
  if (isTile(url.href)) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  // Navigation/HTML : StaleWhileRevalidate avec repli hors ligne sur l'accueil.
  if (request.mode === "navigate") {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        try {
          const res = await fetch(request);
          cache.put(request, res.clone());
          return res;
        } catch {
          return (await cache.match(request)) || (await caches.match("/"));
        }
      })
    );
    return;
  }

  // Assets statiques : StaleWhileRevalidate.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((res) => {
            cache.put(request, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || fetchPromise;
      })
    );
  }
});

// ── Notifications push (Lot 6) ───────────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Diabaction Congo", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Diabaction Congo";
  const options = {
    body: data.body || "",
    icon: "/icon.svg",
    badge: "/icon.svg",
    data: { url: data.url || "/" },
    lang: "fr",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(target) && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
