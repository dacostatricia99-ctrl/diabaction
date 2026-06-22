# 04 — Routes & API

## 1. Arborescence des pages

### Public (sans compte) — pré-rendu SSG/ISR
```
/                         Accueil — 4 actions prioritaires, centres proches, dépistages, produits
/centres                  Carte + liste, filtres (ville, département, service)
/centres/[slug]           Fiche centre (appeler, WhatsApp, itinéraire, partager)
/evenements               Calendrier dépistages & événements
/evenements/[slug]        Fiche événement
/programme-enfants        Présentation, éligibilité, FAQ + bandeau obligatoire
/produits                 Produits à tarif solidaire (filtre catégorie)
/produits/[slug]          Fiche produit (tarif indicatif, avantage membre)
/ressources               Ressources éducatives (filtre catégorie/format)
/ressources/[slug]        Article / vidéo / infographie / PDF
/devenir-membre           Mission, avantages, cotisation + formulaire
/a-propos                 Présentation de l'association
/contact                  Téléphone, WhatsApp, e-mail, formulaire
```

### Authentifié — SSR, protégé RBAC
```
/connexion  /deconnexion
/membre                   Espace membre : profil, statut d'adhésion, avantages, tarifs préférentiels
/pro                      Espace pro : ressources pro, formations, protocoles, documents validés
/partenaire               Tableau de bord agrégé + exports PDF/Excel
/admin                    Espace admin (cf. ci-dessous)
```

### Admin `/admin/*` (ROLE_ADMIN, + extensions SUPER_ADMIN)
```
/admin                    Vue d'ensemble
/admin/centres            CRUD + archivage
/admin/evenements         CRUD + statuts (brouillon→publié→terminé/annulé)
/admin/produits           CRUD
/admin/ressources         CRUD éditorial
/admin/adhesions          Demandes (nouvelle→en_traitement→acceptée/refusée) + adhésions
/admin/programmes-enfants CRUD programme + centres participants
/admin/indicateurs        Saisie/validation des metrics
/admin/partenaires        Gestion des comptes partenaires
/admin/utilisateurs       (SUPER_ADMIN) gestion utilisateurs
/admin/roles              (SUPER_ADMIN) rôles & permissions
/admin/parametres         (SUPER_ADMIN) configuration plateforme
/admin/audit              (SUPER_ADMIN) journal d'audit
```

## 2. Cartographie de l'API REST `/api/v1`

Réponses normalisées : `{ "data": ..., "meta": { pagination }, "error": null }`.
Pagination par curseur ; `?fields=` pour charges partielles ; filtres en query.

### Public (lecture, non authentifié)
| Méthode | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/centers` | Liste + filtres `?city=&department=&service=&near=lat,lng&radius=` | `centers.view` |
| GET | `/centers/{slug}` | Fiche centre (services, produits locaux, horaires) | `centers.view` |
| GET | `/events` | Liste `?type=&from=&to=&city=&status=publie` | `events.view` |
| GET | `/events/{slug}` | Fiche événement | `events.view` |
| GET | `/products` | Liste `?category=&status=` (jamais de quantité) | `products.view` |
| GET | `/products/{slug}` | Fiche produit | `products.view` |
| GET | `/resources` | Liste publiques `?category=&format=` | `resources.view.public` |
| GET | `/resources/{slug}` | Détail ressource publique | `resources.view.public` |
| GET | `/children-program` | Programme + bandeau obligatoire | `children_program.view` |
| GET | `/geo/departments` · `/geo/cities` | Référentiel pour filtres | public |
| POST | `/membership-requests` | Demande d'adhésion (Zod, idempotent, rate-limit) | `membership.request` |
| POST | `/contact` | Message de contact (rate-limit) | `contact.send` |

### Authentifié
| Méthode | Endpoint | Permission |
|--------|----------|------------|
| GET/PATCH | `/me` / `/me/profile` | `profile.manage` |
| GET | `/me/membership` | `membership.status.view` |
| GET | `/me/benefits` | `member.benefits.view` |
| GET | `/pro/resources` · `/pro/protocols` | `resources.view.professional` |
| GET | `/pro/resources/{id}/download` | `resources.download.validated` |
| GET | `/dashboard/metrics` | `dashboard.view.aggregated` |
| POST | `/reports/export?format=pdf\|xlsx` | `reports.export` |

### Admin (mutations — déclenchent un `audit_log`)
| Méthode | Endpoint | Permission |
|--------|----------|------------|
| POST/PATCH/DELETE | `/admin/centers[/{id}]` | `centers.manage` |
| POST/PATCH/DELETE | `/admin/events[/{id}]` (+ `/{id}/status`) | `events.manage` |
| POST/PATCH/DELETE | `/admin/products[/{id}]` | `products.manage` |
| POST/PATCH/DELETE | `/admin/resources[/{id}]` | `resources.manage` |
| GET/PATCH | `/admin/membership-requests[/{id}]` | `membership_requests.manage` |
| POST/PATCH/DELETE | `/admin/children-programs[/{id}]` | `children_program.manage` |
| POST/PATCH/DELETE | `/admin/metrics[/{id}]` | `metrics.manage` |
| POST/PATCH/DELETE | `/admin/partners[/{id}]` | `partners.manage` |

### Super-admin
| Méthode | Endpoint | Permission |
|--------|----------|------------|
| CRUD | `/admin/users[/{id}]` (+ `/{id}/roles`) | `users.manage` |
| CRUD | `/admin/roles[/{id}]` · `/admin/permissions` | `roles.manage` / `permissions.manage` |
| GET/PATCH | `/admin/settings` | `platform.configure` |
| GET | `/admin/audit-logs` | `audit_logs.view` |

## 3. Pipeline de chaque requête API

```
Requête → CORS/headers → Auth (session) → RBAC (requirePermission)
        → Rate-limit → Validation Zod → Service métier
        → [si mutation admin] écriture audit_logs → Réponse normalisée
```

## 4. Conventions

- Codes : `200/201/204` ; `400` validation ; `401` non authentifié ; `403` interdit (RBAC) ; `404` ; `409` conflit/idempotence ; `429` rate-limit.
- `403` sur partenaire tentant d'accéder à des données nominatives → audité.
- Cache HTTP : `Cache-Control` long sur listes publiques (revalidation ISR) ; `no-store` sur espaces authentifiés.
