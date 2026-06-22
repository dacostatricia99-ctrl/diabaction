# 08 — Plan de livraison

## Approche

Livraison par **lots à valeur croissante**, en priorisant les services essentiels accessibles **sans compte** (le cœur de l'utilité patient), puis l'administration, enfin les espaces connectés et l'impact.

## Lots

### Lot 0 — Fondations (socle)
- Initialisation Next.js (App Router, TS), PWA (manifest + service worker), i18n FR.
- PostgreSQL + PostGIS, Prisma, migrations, **seed** des référentiels (départements, villes, services, rôles, permissions).
- Design system : jetons couleurs, déclinaisons du logo, composants de base, accessibilité.
- CI/CD, environnements, observabilité, en-têtes de sécurité.

### Lot 1 — Public essentiel (objectif des critères de succès)
- Accueil + 4 actions prioritaires (fidèle au mockup).
- **Carte des centres** + filtres + fiche + actions (appeler/WhatsApp/itinéraire/partager).
- **Calendrier dépistages & événements** + fiches.
- **Programme enfants** (avec bandeau obligatoire).
- **Produits à tarif solidaire** + **Ressources éducatives** publiques.
- **Contact** (1 clic) + **Devenir membre** (formulaire → `membership_request`).
- Offline partiel (app shell, dernières fiches, Background Sync formulaires).

### Lot 2 — Administration (contenu & opérations)
- Auth + RBAC complet (routes/API/composants/données).
- Espace admin : centres, événements, produits, ressources, adhésions, programme enfants.
- CRUD + archivage + suppression logique + export ; **journal d'audit** branché.

### Lot 3 — Espaces connectés
- **Membre** : profil, statut d'adhésion, avantages, tarifs préférentiels.
- **Professionnel de santé** : ressources pro, formations, protocoles, documents validés.

### Lot 4 — Impact & partenaires
- Saisie/validation des `metrics` (admin).
- **Tableau de bord d'impact** : KPI, carte, graphiques, filtres période/département.
- Espace **partenaire** : agrégats + exports PDF/Excel (audités).
- Gestion des partenaires (admin).

### Lot 5 — Super-admin & durcissement
- Gestion utilisateurs, rôles, permissions, paramètres, consultation audit.
- Revue sécurité/RGPD, tests de charge réseau lent, optimisation budgets perf.

### Lot 6 (futur) — Notifications push
- Activation Web Push (VAPID), opt-in, ciblage par département/programme.

## Dépendances principales

```
Lot 0 ─┬─> Lot 1 ──> Lot 2 ─┬─> Lot 3
       │                    └─> Lot 4 ──> Lot 5 ──> Lot 6
```
Lot 1 ne dépend pas de l'auth (services sans compte). Lots 3/4 dépendent du RBAC (Lot 2).

## Mapping des critères de succès

| Critère | Lot | Comment c'est atteint |
|---------|-----|------------------------|
| Trouver un centre < 30 s | 1 | Accueil → « Trouver un centre » → géoloc/ville → fiche (≤ 3 clics), pages pré-rendues. |
| Trouver un dépistage < 20 s | 1 | Accueil → « Dépistages » → liste chronologique légère filtrée. |
| Contacter en 1 clic | 1 | Tap-to-call / WhatsApp visibles partout (en-tête, fiches, contact). |
| Comprendre les services sans compte | 1 | Tous les modules publics en SSG, aucune barrière d'auth. |
| Poids/perf (≤ 200 Ko, TTI < 5 s 3G, Lighthouse ≥ 90) | 0–1 | Budgets de perf, SSG/ISR, images compressées, JS minimal, service worker. |
| Données sensibles protégées | 2–5 | RBAC 4 niveaux, chiffrement, cloisonnement partenaire, audit. |

## Risques & parades

| Risque | Parade |
|--------|--------|
| Connectivité 2G/3G instable | Offline partiel, Background Sync, budgets de poids stricts, CDN edge. |
| Coût cartographie | OSM/MapTiler (libre), tuiles mises en cache, carte lazy. |
| Fuite de données vers partenaires | Couche service agrégée + tests d'autorisation négatifs + audit. |
| Dérive de vocabulaire (« don »/« gratuit ») | Libellés i18n centralisés + revue éditoriale. |
| Hébergement/latence régionale | DB managée régionale + CDN ; sauvegardes chiffrées testées. |

## Définition de « terminé » (par lot)

Tests unitaires + e2e des parcours critiques au vert · Lighthouse Perf/A11y/PWA ≥ 90 · revue accessibilité AA · revue sécurité · documentation à jour · migrations et seed reproductibles.
