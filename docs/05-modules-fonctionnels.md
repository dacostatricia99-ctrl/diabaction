# 05 — Modules fonctionnels

## Règles métier transverses (à appliquer partout)

1. Services essentiels **sans compte**.
2. **Vocabulaire** : utiliser « tarif solidaire », « prix réduit », « avantage membre ». **Ne jamais** écrire « don » ni « médicaments gratuits ».
3. Les produits sont accessibles à tous ; les membres ont des tarifs préférentiels.
4. Les enfants éligibles bénéficient d'une prise en charge dédiée.
5. Programme enfants **national, capacité renforcée à Brazzaville** (message obligatoire affiché).
6. Partenaires = **données agrégées uniquement**.
7. Toute action admin → **journal d'audit**.
8. **Ne jamais afficher les quantités exactes** de produits (uniquement le statut).

---

## A. Modules publics

### A.1 Page d'accueil — 4 actions prioritaires
Affiche, au-dessus de la ligne de flottaison, **Trouver un centre**, **Voir les dépistages**, **Aide pour les enfants diabétiques**, **Ressources et conseils**. Plus bas : centres proches, prochains dépistages, produits à tarif solidaire (réf. mockup, cf. [06](06-design-system.md)).
Accès rapide permanent : **téléphone**, **WhatsApp**, **itinéraire**, **horaires**, **services**.

### A.2 Carte des centres
- Carte interactive (Leaflet/OSM), géolocalisation optionnelle, recherche par **ville** et **département**, **filtres par service**.
- **Fiche centre** : nom, description, adresse, GPS, téléphone, WhatsApp, e-mail, horaires, photos, services disponibles, produits à tarif solidaire, prise en charge des enfants, **niveau de couverture** (`complète` / `partielle` / `orientation`).
- **Actions** : appeler · ouvrir WhatsApp · obtenir un itinéraire · partager (Web Share API).
- Performance : liste pré-rendue, carte chargée à la demande (lazy) pour économiser la data.

### A.3 Calendrier des dépistages & événements
- **Types** : dépistage, caravane de santé, conférence, activité physique, Journée mondiale du diabète, camp d'été, atelier d'éducation thérapeutique.
- **Fiche événement** : titre, description, date, heure, lieu, GPS, organisateur, téléphone, capacité, **statut** (`brouillon` / `publié` / `terminé` / `annulé`). Seuls les `publié` sont visibles au public.
- Vues : liste chronologique (par défaut, légère) + filtre par type/ville/période ; carte optionnelle.

### A.4 Programme enfants
Affiche : présentation, critères d'éligibilité, services inclus, centres participants, procédure d'inscription, documents requis, FAQ.
**Bandeau obligatoire** : « Programme national avec une capacité renforcée à Brazzaville. »

### A.5 Produits à tarif solidaire
- **Fiche produit** : nom, catégorie, photo, description, disponibilité (statut), **tarif indicatif**, conditions d'accès, **avantage membre**.
- **Catégories** : insuline, bandelettes, glucomètres, aiguilles, consommables.
- **Statuts** : `disponible` / `stock limité` / `indisponible`. **Jamais de quantité exacte.**

### A.6 Devenir membre
Affiche : mission, avantages de l'adhésion, modalités d'inscription, montant de la cotisation.
**Formulaire** (simple) : nom, prénom, téléphone, e-mail, ville, commentaire → crée une `membership_request` (status `nouvelle`). Envoi possible hors ligne (Background Sync).

### A.7 Ressources éducatives
- **Catégories** : nutrition, activité physique, prévention des complications, diabète gestationnel, diabète chez l'enfant, santé mentale.
- **Formats** : articles, vidéos, infographies, PDF.
- Ressources marquables « disponible hors ligne ». Ressources `is_professional` masquées au public (réservées HEALTH_PRO).

### A.8 Contact
Téléphone (tap-to-call), WhatsApp (deep-link), e-mail, formulaire. Accessible en 1 clic depuis toute page (objectif « contacter en un clic »).

---

## B. Espace administrateur

**Modules** : centres · événements · produits · ressources éducatives · adhésions · utilisateurs · indicateurs · partenaires · paramètres.

**Fonctionnalités communes à chaque module** :
- Création · Modification · Archivage · **Suppression logique** (`deleted_at`) · Export.
- Liste filtrable/paginée, recherche, tri.
- Toute mutation → `audit_logs`.
- Garde RBAC : `*.manage` pour ADMIN ; `users/roles/permissions/settings/audit` réservés SUPER_ADMIN.

**Workflows clés** :
- **Événements** : cycle de statut `brouillon → publié → terminé | annulé`.
- **Adhésions** : `nouvelle → en_traitement → acceptée | refusée` ; l'acceptation peut créer un compte `MEMBER` + `membership`.
- **Indicateurs** : saisie/validation des `metrics` agrégés qui alimentent le tableau de bord et les exports partenaires.
- **Programme enfants** : édition du contenu + gestion des centres participants (`program_centers`).

---

## Mapping des règles métier → garde-fous techniques

| Règle | Garde-fou |
|-------|-----------|
| Vocabulaire imposé | Lint éditorial + revue ; libellés centralisés i18n (pas de « don »/« gratuit »). |
| Pas de quantité produit | Aucune colonne quantité exposée ; seul `status` est sérialisé. |
| Partenaires = agrégé | Couche service `dashboard/metrics` sans jointure nominative ; `403` + audit sinon. |
| Audit admin | Hook transversal sur mutations admin → `audit_logs`. |
| Programme national/Brazzaville | `notice` par défaut non vide en base + rendu obligatoire. |
| Sans compte | Routes publiques non gardées par auth ; SSG. |
