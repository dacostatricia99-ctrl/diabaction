# 03 — RBAC & sécurité

## 1. Principe RBAC

- Chaque utilisateur peut posséder **un ou plusieurs rôles** (`user_roles`).
- Un rôle possède un ensemble de **permissions** atomiques (`role_permissions`).
- Les permissions sont vérifiées à **quatre niveaux** :

| Niveau | Mécanisme |
|--------|-----------|
| **Routes** | Middleware Next.js : redirige/`403` selon les rôles requis par segment (`/admin/*`, `/partenaire/*`, `/pro/*`, `/membre/*`). |
| **API** | Garde sur chaque Route Handler : `requirePermission('events.publish')`. |
| **Composants** | `<Can permission="centers.manage">…</Can>` : masque les actions non autorisées (UI). |
| **Données** | Filtres au niveau service/requête : un partenaire ne reçoit **que** des agrégats ; aucune projection de champs nominatifs. |

> Le contrôle **données** est la dernière ligne de défense : même si l'UI ou la route fuit, la couche service ne renvoie jamais de champ interdit au rôle.

## 2. Les six rôles

### ROLE_VISITOR — `auth: non requise`
Consulter : centres, événements, produits à tarif solidaire, ressources éducatives (publiques), programme enfants. Envoyer une demande d'adhésion. Contacter l'association.
**Restrictions** : aucune modification ; aucun accès aux statistiques internes ; aucune donnée sensible.

### ROLE_MEMBER — `auth: requise`
Consulter les avantages membres et tarifs préférentiels. Gérer son profil. Consulter son statut d'adhésion. Recevoir des notifications ciblées.
**Restrictions** : aucune administration.

### ROLE_HEALTH_PROFESSIONAL — `auth: requise`
Consulter les ressources professionnelles ; accéder aux supports de formation ; télécharger les documents validés ; consulter les protocoles.
**Restrictions** : aucun accès aux données nominatives des patients.

### ROLE_PARTNER — `auth: requise`
Consulter les tableaux de bord ; consulter les indicateurs **agrégés** ; exporter des rapports PDF et Excel.
**Restrictions** : aucune donnée nominative ; aucune donnée médicale individuelle.

### ROLE_ADMIN — `auth: requise`
Gérer : centres, événements, produits, contenus éducatifs, demandes d'adhésion, programmes enfants, indicateurs.
**Restrictions** : **ne peut pas** gérer les rôles ni modifier les permissions système.

### ROLE_SUPER_ADMIN — permissions complètes
Gérer les utilisateurs ; créer des rôles ; modifier les permissions ; configurer la plateforme ; consulter les journaux d'audit.

## 3. Matrice de permissions

Légende : ✅ autorisé · ➖ non applicable · ❌ interdit explicite.

| Permission (`key`) | VISITOR | MEMBER | HEALTH_PRO | PARTNER | ADMIN | SUPER_ADMIN |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| `centers.view` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `events.view` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `products.view` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `resources.view.public` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `children_program.view` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `membership.request` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `contact.send` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `member.benefits.view` | ➖ | ✅ | ➖ | ➖ | ✅ | ✅ |
| `member.preferential_prices.view` | ➖ | ✅ | ➖ | ➖ | ✅ | ✅ |
| `profile.manage` | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `membership.status.view` | ➖ | ✅ | ➖ | ➖ | ✅ | ✅ |
| `notifications.receive` | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `resources.view.professional` | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| `resources.download.validated` | ❌ | ❌ | ✅ | ➖ | ✅ | ✅ |
| `protocols.view` | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| `dashboard.view.aggregated` | ❌ | ❌ | ➖ | ✅ | ✅ | ✅ |
| `reports.export` (PDF/Excel) | ❌ | ❌ | ➖ | ✅ | ✅ | ✅ |
| `centers.manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `events.manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `products.manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `resources.manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `membership_requests.manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `children_program.manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `metrics.manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `partners.manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `users.manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `roles.manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `permissions.manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `platform.configure` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `audit_logs.view` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

> **Note clé** : `ADMIN` gère le contenu et l'opérationnel mais **n'a pas** `roles.manage`, `permissions.manage`, `users.manage`, `audit_logs.view` — réservés à `SUPER_ADMIN`, conformément aux restrictions du brief.

## 4. Authentification

- **Sessions** httpOnly + SameSite=Lax, rotation, expiration ; CSRF token sur mutations.
- Options de connexion : **OTP par e-mail/SMS** (adapté au contexte, pas de mot de passe à mémoriser) ou mot de passe **Argon2id**.
- Verrouillage progressif + rate-limit sur les tentatives.
- Pas de compte exigé pour les services essentiels (visiteur).

## 5. Protection des données personnelles

- **Minimisation** : on ne collecte que nom, prénom, téléphone, e-mail, ville, commentaire pour l'adhésion. Aucune donnée médicale individuelle stockée côté plateforme.
- **Chiffrement** :
  - en transit : TLS 1.2+ / HSTS.
  - au repos : disque DB chiffré ; champs sensibles (téléphone, e-mail des demandes) chiffrés applicativement (pgcrypto/clé gérée hors DB) ou pseudonymisés selon sensibilité.
- **Cloisonnement partenaire** : la couche service expose une **vue agrégée** (`metrics`) ; aucune jointure vers `users`, `membership_requests`, etc. Tentative d'accès → `403` + entrée d'audit.
- **Droits des personnes** : procédures d'accès / rectification / suppression (soft delete + purge planifiée).
- **Rétention** : politique par table (ex. demandes d'adhésion traitées purgées après X mois).
- **Consentement** : bannière claire, opt-in explicite pour les notifications push (futur).

## 6. Journal d'audit (`audit_logs`)

- **Obligatoire** sur toute action administrative : create / update / archive / delete (logique) / export / changement de rôle / login admin.
- Enregistre : acteur, action, entité, `entity_id`, diff (`changes`, champs non sensibles uniquement), IP, user-agent, horodatage.
- Consultable uniquement par `SUPER_ADMIN` (`audit_logs.view`).
- Inscriptible mais **non modifiable** par l'application (append-only au niveau applicatif).

## 7. Durcissement applicatif

- En-têtes : CSP stricte, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
- Validation **Zod** sur toutes les entrées ; échappement systématique des sorties.
- Rate-limiting : auth, `contact.send`, `membership.request`, exports.
- Téléversements : type/taille contrôlés, antivirus, stockage hors racine web, ré-encodage des images (suppression EXIF/géoloc).
- Secrets en variables d'environnement / coffre ; rotation des clés.
