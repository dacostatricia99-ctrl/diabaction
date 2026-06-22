# 01 — Architecture technique

## 1. Stack retenue & justification

| Couche | Choix | Pourquoi (au regard des contraintes 2G/3G, PWA, offline, faible data) |
|--------|-------|------------------------------------------------------------------------|
| Front + rendu | **Next.js 14+ (App Router, React)** | SSG/ISR pour des pages publiques pré-rendues et légères ; SSR pour l'admin ; streaming ; un seul langage TS du front à l'API. |
| PWA | **next-pwa / Workbox** | Service worker, manifest, install Android, stratégies de cache offline. |
| API | **Next.js Route Handlers (REST versionné `/api/v1`)** | API-first sans serveur séparé à maintenir ; mutualise le déploiement. |
| ORM | **Prisma** | Schéma typé, migrations, lisibilité du modèle relationnel. |
| Base de données | **PostgreSQL 16 + PostGIS** | Relationnel robuste ; PostGIS pour la recherche géospatiale des centres/événements. |
| Auth | **Auth.js (NextAuth) + JWT/session httpOnly** | Sessions sécurisées, providers e-mail/OTP, intégration RBAC. |
| Cache & files d'attente | **Redis** (optionnel phase 2) | Cache d'agrégats du dashboard, throttling. |
| Stockage médias | **S3-compatible** (ex. Cloudflare R2 / Scaleway) | Images/PDF servis via CDN, transformations à la volée. |
| i18n | **next-intl** | Multilingue, FR par défaut. |
| Cartographie | **Leaflet + tuiles OSM/MapTiler** | Léger, libre, pas de coût Google Maps ; tuiles raster compressées. |
| Validation | **Zod** | Contrats partagés front/back. |
| Tests | **Vitest + Playwright** | Unitaire + e2e (parcours critiques < 30 s). |
| Observabilité | **Sentry + logs structurés** | Suivi erreurs, audit applicatif. |

> **Alternatives écartées** : Laravel/PHP (mûr mais double langage et stack séparée) ; SvelteKit (plus léger mais écosystème plus restreint pour l'admin/dashboard). Next.js offre le meilleur compromis SSR léger + écosystème + langage unique.

## 2. Architecture API-first

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTS                                   │
│  PWA publique (SSG/ISR)   │   Admin (SSR, protégé RBAC)       │
└───────────────┬───────────────────────────┬──────────────────┘
                │  fetch /api/v1/*           │
                ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│          API REST versionnée  /api/v1                        │
│  Middleware: auth → RBAC → rate-limit → validation (Zod)     │
│  Couche services (logique métier)  →  audit-log              │
└───────────────┬─────────────────────────────────────────────┘
                ▼
┌──────────────┐   ┌──────────────┐   ┌─────────────────────┐
│ PostgreSQL   │   │ Redis (cache)│   │ S3 (médias/CDN)     │
│ + PostGIS    │   │              │   │                     │
└──────────────┘   └──────────────┘   └─────────────────────┘
```

- **Versionnement** : préfixe `/api/v1`. Toute rupture de contrat → `/api/v2`.
- **Contrats** : schémas Zod partagés ; réponses normalisées `{ data, meta, error }`.
- **Pagination** : curseur (`?cursor=&limit=`) pour les listes longues, plus économe que l'offset.
- **Champs partiels** : `?fields=` pour réduire la charge utile sur réseau lent.
- **Idempotence** : clés d'idempotence sur les POST sensibles (adhésion).

## 3. Stratégie PWA, offline & faible bande passante

### Budget de performance (par page publique)
- JS critique ≤ 90 Ko gzip ; CSS ≤ 25 Ko ; HTML initial ≤ 30 Ko.
- Police système (pas de webfont bloquante) ou une seule variable subsettée.
- Images **WebP/AVIF**, `srcset` responsive, lazy-loading, dimensions explicites (anti-CLS).

### Service worker — stratégies de cache
| Ressource | Stratégie |
|-----------|-----------|
| App shell (HTML/CSS/JS) | `StaleWhileRevalidate` + précache au build |
| Tuiles carte | `CacheFirst`, expiration LRU (ex. 200 tuiles) |
| Listes centres / événements / produits | `StaleWhileRevalidate`, TTL court |
| Détail centre consulté | `CacheFirst` (consultable hors ligne après 1re visite) |
| Ressources éducatives (articles/PDF) | `CacheFirst`, téléchargeables pour lecture offline |
| API mutations (adhésion, contact) | **Background Sync** : file d'attente locale, renvoi auto au retour du réseau |

### Offline « partiel » — ce qui fonctionne sans réseau
- Page d'accueil et 4 actions prioritaires (coquille mise en cache).
- Derniers centres/événements/produits consultés.
- Ressources marquées « disponible hors ligne ».
- Formulaire d'adhésion / contact : saisie possible, envoi différé (Background Sync) avec accusé visuel « sera envoyé dès le retour du réseau ».

### Économie de données
- En-tête `Save-Data` respecté → désactive images non essentielles, réduit la qualité.
- ISR/SSG : pages publiques pré-rendues, servies via CDN au plus près (edge).
- Compression Brotli ; HTTP/2 ; `Cache-Control` long sur assets hashés.

## 4. Géolocalisation & cartographie

- **PostGIS** : colonne `geography(Point,4326)` sur `centers` et `events`.
- Recherche « centres proches » : `ST_DWithin` + tri par `ST_Distance` (index GiST).
- Filtres serveur par **département** / **ville** / **service** (cf. [05](05-modules-fonctionnels.md)).
- Géolocalisation navigateur optionnelle (jamais bloquante) ; repli sur recherche par ville.
- Itinéraire : lien `geo:` / deep-link vers l'app de navigation du téléphone (pas de SDK lourd).

## 5. Sécurité d'infrastructure (résumé — détail en [03](03-rbac-securite.md))

- HTTPS strict (HSTS), en-têtes CSP, `X-Content-Type-Options`, `Referrer-Policy`.
- Rate-limiting sur auth, contact, adhésion (anti-spam/abus).
- Secrets via variables d'environnement / coffre ; jamais en clair dans le dépôt.
- Sauvegardes PostgreSQL chiffrées, restauration testée (PITR).

## 6. SEO

- Métadonnées par page (App Router `metadata`), Open Graph, données structurées **schema.org** (`MedicalOrganization`, `Event`, `LocalBusiness` pour les centres).
- Sitemap.xml + robots.txt générés ; URLs lisibles (`/centres/brazzaville/...`).
- Pages publiques pré-rendues = indexables et rapides.

## 7. Notifications push (prêtes, activées en version future)

- **Web Push (VAPID)** côté service worker, opt-in explicite.
- Modèle de données `notifications` et `push_subscriptions` prévu mais inactif au lancement.
- Cas d'usage futurs : rappel de dépistage à proximité, nouvel événement dans le département du membre.

## 8. Hébergement & déploiement

- **Conteneurs Docker** ; déploiement sur PaaS edge (Vercel) ou VPS régional (proximité Afrique centrale = latence réduite).
- CI/CD : lint → typecheck → tests → migration Prisma → build → déploiement.
- Environnements : `dev`, `staging`, `prod` ; variables séparées.
- DB managée régionale recommandée pour la latence et les sauvegardes.
