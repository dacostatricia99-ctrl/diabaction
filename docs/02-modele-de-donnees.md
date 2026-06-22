# 02 — Modèle de données

## Conventions communes

Toutes les tables incluent :

| Colonne | Type | Rôle |
|---------|------|------|
| `id` | `uuid` (PK, `gen_random_uuid()`) | Identifiant non énumérable. |
| `created_at` | `timestamptz` not null default `now()` | Création. |
| `updated_at` | `timestamptz` not null | Mise à jour (trigger). |
| `deleted_at` | `timestamptz` null | **Suppression logique** (soft delete). Filtré par défaut. |

Règles transverses :
- **Soft delete** partout : aucune suppression physique via l'application ; `deleted_at IS NULL` par défaut.
- **Audit** : toute mutation admin écrit dans `audit_logs`.
- Slugs SEO sur entités publiques (`slug`, unique).
- Énumérations en types PostgreSQL `enum` (listés ci-dessous).
- Géographie en `geography(Point,4326)` (PostGIS) + index GiST.

## Schéma relationnel (vue d'ensemble)

```
departments ──< cities ──< centers >── center_services >── services
                              │  └──< center_products (tarif solidaire par centre)
                              │
events >── event_categories          children_programs ──< program_centers >── centers
products                              membership_requests
educational_resources                 memberships ── users
                                      │
users >── user_roles >── roles >── role_permissions >── permissions
users ──< audit_logs
partners        metrics        push_subscriptions (futur)
```

## Énumérations

```sql
CREATE TYPE coverage_level   AS ENUM ('complete', 'partielle', 'orientation');
CREATE TYPE event_status     AS ENUM ('brouillon', 'publie', 'termine', 'annule');
CREATE TYPE event_type       AS ENUM ('depistage','caravane','conference','activite_physique',
                                      'journee_mondiale','camp_ete','atelier_educatif');
CREATE TYPE product_category AS ENUM ('insuline','bandelettes','glucometres','aiguilles','consommables');
CREATE TYPE product_status   AS ENUM ('disponible','stock_limite','indisponible');
CREATE TYPE resource_format  AS ENUM ('article','video','infographie','pdf');
CREATE TYPE resource_category AS ENUM ('nutrition','activite_physique','prevention_complications',
                                       'diabete_gestationnel','diabete_enfant','sante_mentale');
CREATE TYPE membership_status AS ENUM ('en_attente','active','expiree','rejetee');
CREATE TYPE request_status    AS ENUM ('nouvelle','en_traitement','acceptee','refusee');
```

## Tables — référentiel géographique

```sql
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,                      -- code département
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id),
  name text NOT NULL,
  location geography(Point,4326),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
```

## Tables — centres

```sql
CREATE TABLE centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  address text,
  city_id uuid REFERENCES cities(id),
  location geography(Point,4326),         -- coordonnées GPS
  phone text,
  whatsapp text,
  email text,
  opening_hours jsonb,                    -- {lun:[{open,close}], ...}
  photos jsonb,                           -- [{url, alt}]
  coverage_level coverage_level NOT NULL DEFAULT 'partielle',
  handles_children boolean NOT NULL DEFAULT false, -- prise en charge enfants
  is_open boolean GENERATED ALWAYS AS (...) STORED, -- ou calculé applicatif
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX idx_centers_location ON centers USING GIST (location);

-- Catalogue des services (référentiel)
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                     -- consultation, dépistage, éducation thérapeutique...
  icon text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Association centre ⇄ service (table center_services demandée)
CREATE TABLE center_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id uuid NOT NULL REFERENCES centers(id),
  service_id uuid NOT NULL REFERENCES services(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (center_id, service_id)
);

-- Produits à tarif solidaire proposés par un centre (disponibilité locale)
CREATE TABLE center_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id uuid NOT NULL REFERENCES centers(id),
  product_id uuid NOT NULL REFERENCES products(id),
  status product_status NOT NULL DEFAULT 'disponible', -- jamais de quantité exacte
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (center_id, product_id)
);
```

## Tables — événements

```sql
CREATE TABLE event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type event_type NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES event_categories(id),
  type event_type NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location_label text,                    -- lieu (ex. "Place de la Mairie, Dolisie")
  location geography(Point,4326),         -- coordonnées GPS
  organizer text,
  phone text,
  capacity int,
  status event_status NOT NULL DEFAULT 'brouillon',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX idx_events_location ON events USING GIST (location);
CREATE INDEX idx_events_starts_at ON events (starts_at) WHERE status = 'publie';
```

## Tables — produits & ressources

```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category product_category NOT NULL,
  photo_url text,
  description text,
  status product_status NOT NULL DEFAULT 'disponible',
  indicative_price numeric(10,2),         -- tarif INDICATIF (solidaire)
  access_conditions text,                 -- conditions d'accès
  member_benefit text,                    -- avantage membre (texte)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
  -- NB: aucune colonne "quantité" — on n'affiche jamais le stock exact.
);

CREATE TABLE educational_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category resource_category NOT NULL,
  format resource_format NOT NULL,
  summary text,
  body text,                              -- article (markdown) ou description
  media_url text,                         -- vidéo / pdf / infographie
  cover_url text,
  is_professional boolean NOT NULL DEFAULT false, -- réservé ROLE_HEALTH_PROFESSIONAL
  available_offline boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
```

## Tables — programme enfants

```sql
CREATE TABLE children_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  presentation text,                      -- présentation du programme
  eligibility_criteria text,              -- critères d'éligibilité
  included_services text,                 -- services inclus
  registration_procedure text,            -- procédure d'inscription
  required_documents jsonb,               -- documents requis [ ... ]
  faq jsonb,                              -- [{q, a}]
  notice text NOT NULL DEFAULT
    'Programme national avec une capacité renforcée à Brazzaville.', -- message obligatoire
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Centres participants au programme
CREATE TABLE program_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES children_programs(id),
  center_id uuid NOT NULL REFERENCES centers(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (program_id, center_id)
);
```

## Tables — adhésion

```sql
-- Demande publique (sans compte requis)
CREATE TABLE membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_name text NOT NULL,                -- nom
  first_name text NOT NULL,               -- prénom
  phone text NOT NULL,                    -- téléphone
  email text,                             -- email
  city_id uuid REFERENCES cities(id),     -- ville
  comment text,                           -- commentaire
  status request_status NOT NULL DEFAULT 'nouvelle',
  processed_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Adhésion validée, rattachée à un compte
CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  status membership_status NOT NULL DEFAULT 'en_attente',
  started_at date,
  expires_at date,
  fee_amount numeric(10,2),               -- montant de cotisation
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
```

## Tables — utilisateurs & RBAC

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext UNIQUE,
  phone text,
  full_name text,
  password_hash text,                     -- Argon2id (si auth mot de passe)
  email_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,               -- ROLE_VISITOR, ROLE_MEMBER, ...
  name text NOT NULL,
  is_system boolean NOT NULL DEFAULT true,-- rôles système non supprimables
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,               -- centers.manage, events.publish, metrics.view ...
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Un utilisateur peut posséder PLUSIEURS rôles
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  role_id uuid NOT NULL REFERENCES roles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (user_id, role_id)
);

CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id),
  permission_id uuid NOT NULL REFERENCES permissions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (role_id, permission_id)
);
```

## Tables — partenaires, indicateurs, audit

```sql
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  contact_email text,
  user_id uuid REFERENCES users(id),      -- compte d'accès partenaire
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Indicateurs d'impact (agrégés, jamais nominatifs)
CREATE TABLE metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,                      -- active_centers, screenings_done, events_count,
                                          -- participants, children_supported, members,
                                          -- geo_coverage, professionals_trained
  period_start date NOT NULL,
  period_end date NOT NULL,
  department_id uuid REFERENCES departments(id), -- dimension géographique optionnelle
  value numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (key, period_start, period_end, department_id)
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id),     -- qui
  action text NOT NULL,                   -- create/update/archive/delete/export/login...
  entity text NOT NULL,                   -- table concernée
  entity_id uuid,
  changes jsonb,                          -- diff avant/après (champs non sensibles)
  ip inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
```

## Tables — notifications push (prêtes, inactives au lancement)

```sql
CREATE TABLE push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  endpoint text NOT NULL,
  keys jsonb NOT NULL,                    -- {p256dh, auth}
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
```

## Couverture de la liste d'entités demandée

| Entité demandée | Table |
|-----------------|-------|
| users, roles, permissions, user_roles | ✅ (+ `role_permissions`) |
| centers, center_services | ✅ (+ `services`, `center_products`) |
| events, event_categories | ✅ |
| products | ✅ |
| educational_resources | ✅ |
| memberships, membership_requests | ✅ |
| children_programs | ✅ (+ `program_centers`) |
| metrics | ✅ |
| partners | ✅ |
| audit_logs | ✅ |
| departments, cities | ✅ |

Tables ajoutées pour la cohérence : `services`, `center_products`, `role_permissions`, `program_centers`, `push_subscriptions`.
