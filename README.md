# Diabaction Congo — Plateforme

[![CI](https://github.com/dacostatricia99-ctrl/diabaction/actions/workflows/ci.yml/badge.svg)](https://github.com/dacostatricia99-ctrl/diabaction/actions/workflows/ci.yml)

Plateforme numérique de lutte contre le diabète en République du Congo.

> **Statut** : Lots 0–6 complets — site public PWA, carte Leaflet, auth JWT + RBAC 6 rôles, espaces **admin / membre / professionnel / partenaire**, **CRUD complet audité** (centres, événements, produits, ressources), tableau de bord d'impact + exports CSV/PDF, **notifications Web Push** (VAPID), durcissement (CSP/HSTS/rate-limit) et RGPD. Persistance **PostgreSQL/PostGIS** (Prisma) avec repli automatique sur les données de démo, **migrations versionnées** et seed reproductible. Typecheck/build au vert.
> **Stack** : Next.js 14 (App Router, PWA) + PostgreSQL/PostGIS + Prisma + Auth.js (JWT) + Leaflet + web-push.
> **Principes directeurs** : simplicité, rapidité, accessibilité, faible consommation de données, utilité immédiate pour le patient.

## Fonctionnalités

- **Public (sans compte)** : accueil, carte des centres + filtres + géoloc, dépistages & événements, programme enfants, produits à tarif solidaire, ressources éducatives, contact, devenir membre, notifications, confidentialité.
- **Espace admin** : CRUD centres/événements/produits/ressources (création, modification, archivage), adhésions, indicateurs d'impact (saisie/validation), partenaires (activer/suspendre), notifications push ciblées ; **super-admin** : utilisateurs, rôles, paramètres, **journal d'audit**.
- **Espace membre** : adhésion, avantages & tarifs préférentiels, profil.
- **Espace professionnel** : ressources pro, protocoles, formations, profil.
- **Espace partenaire** : tableau de bord d'impact agrégé (filtres période/département), exports CSV & PDF, profil.

## Lancer l'application

```bash
npm install
npm run dev            # http://localhost:3000
# ou
npm run build && npm start
```

Par défaut (`DB_ENABLED=false`), l'app fonctionne **sans base** : les *repositories*
(`src/lib/repo/*`) renvoient les données de `src/data/demo.ts` et l'audit est en mémoire.

### Activer la persistance PostgreSQL/PostGIS (Docker)

Prérequis : **Docker Desktop** installé (https://www.docker.com/products/docker-desktop/).
Une fois Docker lancé :

```bash
npm run db:up                 # démarre PostgreSQL + PostGIS (docker-compose.yml)
npx prisma migrate deploy     # applique les migrations versionnées (prisma/migrations)
npm run prisma:seed           # seed (RBAC, centres, événements, users, partenaires…)
# puis lance l'app avec la persistance active :
DB_ENABLED=true npm run dev
```

À partir de là, tout devient **persistant** : CRUD des contenus, indicateurs, partenaires,
abonnements push, et le **journal d'audit** (table `audit_logs`). Les repositories
(`src/lib/repo/*`) basculent automatiquement sur la base ; en cas d'erreur DB, repli sur la démo.

> Sur une base déjà créée sans historique de migration, utiliser plutôt `npm run db:setup`.
> Pour repartir de zéro (drop + migrations + seed) : `npx prisma migrate reset`.
> Arrêter / purger : `npm run db:down` (ajouter `-v` au compose pour effacer le volume).

### Notifications Web Push (VAPID)

Générer une paire de clés puis renseigner `.env` :

```bash
npx web-push generate-vapid-keys
# -> NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY (+ VAPID_SUBJECT="mailto:…")
```

Opt-in sur **/notifications** ; diffusion ciblée (département / thème) depuis **/admin/notifications**.
Le push nécessite un contexte sécurisé (HTTPS ou `localhost`).

### Espaces connectés (démo)
Page **/connexion** → redirection selon le rôle. Comptes de démonstration :

| Email | Mot de passe | Rôle | Atterrissage |
|-------|--------------|------|--------------|
| `super@diabaction.cg` | `Super1234!` | super-admin (voit tout + audit) | `/admin` |
| `admin@diabaction.cg` | `Admin1234!` | admin (contenu, pas rôles/users/audit) | `/admin` |
| `membre@diabaction.cg` | `Membre1234!` | membre | `/membre` |
| `pro@diabaction.cg` | `Pro1234!` | professionnel de santé | `/pro` |
| `partenaire@diabaction.cg` | `Partenaire1234!` | partenaire (agrégés uniquement) | `/partenaire` |

RBAC appliqué sur middleware (routes), API, composants (`<Can>`) et données. Toute action admin
écrit dans le **journal d'audit** (`/admin/audit`, réservé super-admin).

> ⚠️ Mots de passe de **démonstration** : à changer impérativement avant toute mise en ligne.

### Structure du code
- `src/app/` — routes (pages publiques + `api/v1/*`).
- `src/components/` — design system (`brand`, `ui`, `layout`, `cards`, `home`).
- `src/data/demo.ts` — données de démonstration (forme du modèle Prisma).
- `src/lib/rbac.ts` — **source de vérité RBAC** (rôles, permissions, matrice).
- `prisma/schema.prisma` — modèle de données complet ; `prisma/seed.ts` — seed RBAC.
- `public/` — `manifest.webmanifest`, `sw.js` (offline partiel), `icon.svg`.

## Déploiement (production)

L'app se déploie comme un conteneur Docker + une base PostgreSQL managée. Le schéma
**n'utilise pas PostGIS** (latitude/longitude en `Float`) : un PostgreSQL standard suffit
(Render, Neon, Railway, RDS…).

**Variables d'environnement de prod :**

| Variable | Rôle |
|---|---|
| `DB_ENABLED=true` | active la persistance (sinon repli démo) |
| `DATABASE_URL` | connexion PostgreSQL |
| `AUTH_SECRET` | secret de session (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | clé publique push — **build-arg** (inlinée au build) |
| `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | clés/contact push (runtime) |

**Image Docker** (générique : VPS, Fly.io, Railway…) :

```bash
docker build --build-arg NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxx -t diabaction .
docker run -p 3000:3000 \
  -e DB_ENABLED=true -e DATABASE_URL=... -e AUTH_SECRET=... \
  -e VAPID_PRIVATE_KEY=... -e VAPID_SUBJECT=mailto:contact@diabaction.cg \
  diabaction
```

Au démarrage, l'entrypoint applique les migrations (`prisma migrate deploy`) puis lance Next.js.

**Render** : le fichier [`render.yaml`](render.yaml) crée le service web + la base en un clic
(*New → Blueprint*). Renseigner ensuite les secrets push dans le dashboard.

> Avant la mise en ligne : régénérer `AUTH_SECRET` et les clés VAPID, et **changer les mots de
> passe de démonstration** (table `users` / seed).

## Sommaire du dossier

| # | Document | Contenu |
|---|----------|---------|
| 00 | [Vue d'ensemble](docs/00-vue-densemble.md) | Contexte, objectifs, utilisateurs, principes de conception, critères de succès. |
| 01 | [Architecture technique](docs/01-architecture-technique.md) | Stack et justification, architecture API-first, PWA, stratégie offline & faible bande passante, performance, hébergement. |
| 02 | [Modèle de données](docs/02-modele-de-donnees.md) | Entités, schéma relationnel, DDL PostgreSQL/PostGIS, conventions. |
| 03 | [RBAC & sécurité](docs/03-rbac-securite.md) | Rôles, matrice de permissions, application multi-niveaux, protection des données, audit. |
| 04 | [Routes & API](docs/04-routes-api.md) | Arborescence des pages, cartographie de l'API REST, contrats d'endpoints. |
| 05 | [Modules fonctionnels](docs/05-modules-fonctionnels.md) | Modules publics et espace administrateur, règles métier. |
| 06 | [Design system](docs/06-design-system.md) | Identité visuelle, palette, déclinaisons du logo, typographie, composants (référence mockup). |
| 07 | [Tableau de bord d'impact](docs/07-tableau-de-bord-impact.md) | Indicateurs, agrégations, exports, gouvernance des données. |
| 08 | [Plan de livraison](docs/08-plan-de-livraison.md) | Lots, jalons, dépendances, mapping critères de succès. |

## Décisions structurantes (résumé)

- **Mobile-first, PWA installable**, optimisée Android, utilisable en 2G/3G et partiellement hors ligne.
- **Services essentiels sans compte** : carte des centres, dépistages, programme enfants, produits, ressources, contact.
- **API-first** : tout passe par une API REST versionnée ; le front public et l'admin consomment la même API.
- **RBAC** à 6 rôles appliqué sur routes, API, composants et données.
- **Vocabulaire imposé** : « tarif solidaire », « prix réduit », « avantage membre ». Jamais « don » ni « médicaments gratuits ».
- **Données agrégées uniquement** pour les partenaires ; aucune donnée nominative ni médicale individuelle exposée.
- **Journal d'audit** obligatoire sur toute action administrative.
