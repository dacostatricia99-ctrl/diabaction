# 00 — Vue d'ensemble

## Contexte

Diabaction Congo est une association de lutte contre le diabète en République du Congo. Ses missions : prévention, dépistage urbain et rural, éducation thérapeutique, promotion de l'activité physique, sensibilisation scolaire, formation des professionnels de santé, événements communautaires, création de centres spécialisés, programme dédié aux enfants diabétiques (0–18 ans), et collecte d'indicateurs épidémiologiques.

Le **programme enfants est national, avec une capacité renforcée à Brazzaville**. Les produits sont accessibles à tous selon un modèle de **tarif solidaire** ; les membres bénéficient d'avantages spécifiques.

## Objectifs de la plateforme

**Pour les patients et familles** — trouver un centre, localiser les campagnes de dépistage, accéder aux ressources éducatives, découvrir les programmes, identifier les produits à tarif solidaire, comprendre l'adhésion, contacter l'association.

**Pour Diabaction Congo** — gérer centres, événements, programmes, produits ; publier des contenus éducatifs ; suivre les indicateurs d'impact ; produire des rapports pour les partenaires.

## Utilisateurs cibles

| Public (sans compte) | Connecté |
|----------------------|----------|
| Patients, familles, aidants, personnes à risque, grand public | Membres, professionnels de santé, administrateurs, partenaires institutionnels, super-administrateurs |

## Principes de conception

1. **Mobile-first & responsive** — conçu d'abord pour smartphone Android d'entrée de gamme.
2. **PWA installable** — ajout à l'écran d'accueil, fonctionnement partiel hors ligne.
3. **Accessible** — conformité WCAG 2.1 AA, contrastes, navigation clavier, lecteurs d'écran, langage simple sans jargon médical.
4. **Multilingue** — français (par défaut), extensible (lingala, kituba/kongo).
5. **2G/3G & faible data** — budget de poids strict par page, images compressées, cache agressif.
6. **Règle des 3 clics** — toute information essentielle accessible en ≤ 3 interactions.
7. **Sans friction** — services essentiels sans création de compte ; pas de formulaires complexes.
8. **Données sensibles protégées** — chiffrement, minimisation, accès au plus juste.

## Critères de succès (mesurables)

| Objectif | Cible |
|----------|-------|
| Trouver un centre | < 30 s |
| Trouver un dépistage | < 20 s |
| Contacter l'association | 1 clic (téléphone / WhatsApp) |
| Comprendre les services | Sans création de compte |
| Poids page d'accueil | ≤ 200 Ko transférés (hors images au-dessus de la ligne de flottaison déjà compressées) |
| Time-to-interactive en 3G simulée | < 5 s |
| Score Lighthouse (Perf / A11y / PWA) | ≥ 90 |

Voir le détail du mapping dans [08 — Plan de livraison](08-plan-de-livraison.md#mapping-des-critères-de-succès).

## Arbitrage permanent

En cas d'options multiples, l'ordre de priorité est **toujours** : simplicité → rapidité → accessibilité → utilité immédiate pour le patient.
