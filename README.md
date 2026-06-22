# Diabaction Congo — Plateforme

Plateforme numérique de lutte contre le diabète en République du Congo.

> **Statut** : Lots 0–2 + persistance — socle, site public (PWA), carte Leaflet, auth/RBAC, espace admin avec audit, et couche de persistance PostgreSQL/PostGIS (Prisma) activable via Docker, avec repli automatique sur les données de démo. Buildé et testé.
> **Stack** : Next.js 14 (App Router, PWA) + PostgreSQL/PostGIS + Prisma.
> **Principes directeurs** : simplicité, rapidité, accessibilité, faible consommation de données, utilité immédiate pour le patient.

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
npm run db:up        # démarre PostgreSQL + PostGIS (docker-compose.yml)
npm run db:setup     # migre le schéma Prisma + seed (RBAC, centres, événements, users…)
# puis passe DB_ENABLED="true" dans .env, et :
npm run dev
```

À partir de là, tout devient **persistant** : archivage de centres, changement de statut
d'événements, demandes d'adhésion, et surtout le **journal d'audit** (table `audit_logs`).
Les repositories basculent automatiquement sur la base ; en cas d'erreur DB, repli sur la démo.

Pour arrêter / réinitialiser : `npm run db:down` (ajouter `-v` au compose pour purger les données).

### Espace connecté (démo)
Page **/connexion** → **/admin**. Comptes de démonstration :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `super@diabaction.cg` | `Super1234!` | super-admin (voit tout + audit) |
| `admin@diabaction.cg` | `Admin1234!` | admin (contenu, pas les rôles/users/audit) |
| `partenaire@diabaction.cg` | `Partenaire1234!` | partenaire (agrégés uniquement) |

RBAC appliqué sur middleware (routes), API, composants (`<Can>`) et données. Toute action admin
écrit dans le **journal d'audit** (`/admin/audit`, réservé super-admin).

### Structure du code
- `src/app/` — routes (pages publiques + `api/v1/*`).
- `src/components/` — design system (`brand`, `ui`, `layout`, `cards`, `home`).
- `src/data/demo.ts` — données de démonstration (forme du modèle Prisma).
- `src/lib/rbac.ts` — **source de vérité RBAC** (rôles, permissions, matrice).
- `prisma/schema.prisma` — modèle de données complet ; `prisma/seed.ts` — seed RBAC.
- `public/` — `manifest.webmanifest`, `sw.js` (offline partiel), `icon.svg`.

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
