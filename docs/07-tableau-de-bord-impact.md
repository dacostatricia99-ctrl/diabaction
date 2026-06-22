# 07 — Tableau de bord d'impact

## 1. Indicateurs affichés

| Indicateur | Clé `metrics.key` | Source / calcul |
|------------|-------------------|-----------------|
| Centres actifs | `active_centers` | `count(centers WHERE deleted_at IS NULL AND actif)` |
| Dépistages réalisés | `screenings_done` | Saisie validée par admin (événements `depistage` terminés). |
| Événements | `events_count` | `count(events WHERE status IN ('publie','termine'))` sur période. |
| Participants | `participants` | Saisie agrégée par événement. |
| Enfants accompagnés | `children_supported` | Saisie agrégée du programme enfants. |
| Membres | `members` | `count(memberships WHERE status='active')`. |
| Couverture géographique | `geo_coverage` | Nb de départements/villes couverts. |
| Professionnels formés | `professionals_trained` | Saisie agrégée des formations. |

> Tous les indicateurs sont **agrégés** ; aucune donnée nominative ni médicale individuelle.

## 2. Vues & visualisations

- **Cartes chiffres** (KPI) en tête, grandes valeurs lisibles.
- **Carte géographique** : couverture par département (choroplèthe légère, PostGIS + GeoJSON simplifié).
- **Graphiques** : évolution temporelle (lignes), répartition par catégorie/type (barres), répartition géographique.
- **Filtres** : par **période** (mois/trimestre/année, plage personnalisée) et par **département**.
- Bibliothèque légère (ex. uPlot/Chart.js) chargée à la demande pour préserver la data.

## 3. Exports

- **PDF** : rapport partenaire mis en page (logo, période, KPI, graphiques, carte) — génération serveur.
- **Excel (XLSX)** : données tabulaires agrégées par indicateur/période/département.
- Endpoint : `POST /api/v1/reports/export?format=pdf|xlsx` (permission `reports.export`).
- Chaque export est **audité** (`audit_logs`, action `export`).

## 4. Accès & gouvernance des données

| Rôle | Accès dashboard |
|------|-----------------|
| PARTNER | Lecture des **agrégats** + exports. **Aucune** donnée nominative/médicale individuelle. |
| ADMIN | Lecture + saisie/validation des `metrics`. |
| SUPER_ADMIN | Idem + configuration. |

- La couche service du dashboard ne lit **que** la table `metrics` (et référentiels géo) ; aucune jointure vers `users`, `membership_requests`, etc.
- Mise en cache (Redis/ISR) des agrégats pour des chargements rapides en réseau lent.
- Cohérence : les `metrics` sont validés avant publication ; un indicateur non validé n'apparaît pas côté partenaire.
