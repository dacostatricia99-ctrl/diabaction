# 06 — Design system (référence : mockup fourni, à suivre fidèlement)

## 1. Intentions

L'interface doit transmettre **confiance, proximité, solidarité, bienveillance**.
Éviter : interfaces surchargées, jargon médical, formulaires complexes.

## 2. Palette de couleurs

| Jeton | Hex | Usage |
|-------|-----|-------|
| `--color-primary` (bleu) | `#1F4E79` | Marque, en-tête, titres, boutons primaires, icônes clés. |
| `--color-accent` (rouge) | `#D94B5A` | Accent, CTA « Devenir membre », bandeaux importants, pin actif sur carte. |
| `--color-white` | `#FFFFFF` | Fonds de cartes, surfaces. |
| `--color-gray-100` | `#F5F7FA` | Fond de page, sections alternées, fonds d'icônes. |
| `--color-gray-800` | `#2D3748` | Texte courant, libellés. |

États dérivés (à générer) : `primary-hover` (assombri ~8 %), `accent-hover`, `success` (vert pour pastilles « À venir »/« Ouvert », ex. `#2F855A` sur fond `#E6F4EA`), `border` (`#E2E8F0`).

Contrastes : vérifier WCAG AA (texte `#2D3748` sur `#FFFFFF`/`#F5F7FA` OK ; texte blanc sur `#1F4E79` et `#D94B5A` OK).

## 3. Déclinaisons du logo à produire automatiquement

À partir du logo officiel (marque circulaire + « Diabaction Congo ») :

| Livrable | Spécification |
|----------|---------------|
| **Horizontal** | Symbole + texte sur une ligne (en-tête desktop, cf. mockup). |
| **Simplifié mobile** | Symbole seul + « Diabaction Congo » compact (barre mobile). |
| **Favicon** | `favicon.ico` + `favicon.svg` (16/32/48). |
| **Icônes PWA** | `192×192`, `512×512`, maskable (safe zone), Apple touch `180×180`. |
| **Version claire** | Marque couleur + texte `#1F4E79` (fonds clairs). |
| **Version sombre** | Texte/symbole en blanc, symbole conservé (fonds foncés). |

Formats : **SVG** source + PNG exportés. Manifest PWA référence les icônes maskables.

## 4. Typographie

- **Police système** prioritaire (`-apple-system, Segoe UI, Roboto, …`) pour zéro coût réseau ; option : une police variable subsettée (latin) si l'identité l'exige.
- Échelle (mobile-first) : H1 28–32 px / H2 22 px / H3 18 px / corps 16 px / légende 14 px. Interlignage 1.5.
- Poids : 700 titres, 600 sous-titres/CTA, 400 corps.

## 5. Grille & layout (d'après le mockup)

- **En-tête** : logo à gauche ; nav (Accueil, Trouver un centre, Dépistages & événements, Programme enfants, Produits solidaires, Ressources, À propos) ; bouton **Contact** (outline) + **Devenir membre** (plein rouge) à droite.
- **Hero** : titre fort à gauche (« Ensemble contre le diabète en République du Congo »), sous-titre, CTA primaire bleu « Trouver un centre près de moi » ; visuel famille à droite ; **carte flottante « Programme enfants 0–18 ans »** avec bandeau rouge « Programme national avec une capacité renforcée à Brazzaville ».
- **Bande 4 actions** : 4 cartes (icône ronde, titre, description, lien fléché) — *Trouver un centre*, *Dépistages & événements*, *Aide pour les enfants*, *Ressources & conseils*. Couleurs d'icône : bleu, rouge, vert, violet.
- **3 colonnes** : « Centres proches de vous » (mini-carte + fiche centre), « Prochains dépistages » (liste à pastille date + statut « À venir »), « Produits à tarif solidaire » (vignette + libellés).
- **Bande valeurs** (pied de contenu) : Tarif solidaire · Accompagnement · Proximité · Éducation (icône + titre + phrase).
- **Mobile** : barre supérieure (burger, logo, cloche) ; mêmes 4 actions en grille 2×2 ; **barre de navigation basse** : Accueil · Centres · Événements · Ressources · Contact.

Conteneur max ~1200 px, gouttières 16–24 px, rayon de carte ~12–16 px, ombres douces.

## 6. Composants (bibliothèque)

- **Boutons** : primaire (bleu plein), accent (rouge plein), secondaire (outline bleu), lien fléché. Hauteur tactile ≥ 44 px.
- **Cartes** : action, centre, événement, produit, ressource.
- **Pastilles/badges** : statut (`À venir`, `Ouvert`, `Disponible`/`Stock limité`/`Indisponible`), niveau de couverture.
- **Pastille date** : bloc jour (gros) + mois (petit), coin bleu.
- **Carte interactive** : pin par défaut bleu, pin actif rouge (marque), popup fiche compacte.
- **Barre de navigation basse** (mobile, 5 entrées avec icônes).
- **Boutons de contact rapide** : Appeler · WhatsApp · Itinéraire · Partager.
- **Champs de formulaire** : larges, labels visibles, messages d'erreur clairs, autocomplétion ville.
- **Bandeau d'information** (rouge) pour le message programme enfants.

## 7. Accessibilité (WCAG 2.1 AA)

- Cibles tactiles ≥ 44 px, focus visible, navigation clavier complète.
- Contrastes AA vérifiés ; ne pas coder l'information uniquement par la couleur (ajouter texte/icône aux statuts).
- `alt` sur toutes les images ; hiérarchie de titres correcte ; landmarks ARIA.
- Respect `prefers-reduced-motion` et `prefers-color-scheme` (mode sombre via jeton).
- Langage simple, sans jargon ; libellés d'action explicites.

## 8. Mode sombre

Mêmes jetons inversés : fond `#2D3748`/proche noir, surfaces légèrement plus claires, texte `#F5F7FA`, primaire éclairci pour le contraste, logo version sombre. Bascule auto (`prefers-color-scheme`) + override manuel.

## 9. Jetons (extrait CSS)

```css
:root{
  --color-primary:#1F4E79; --color-accent:#D94B5A;
  --color-white:#FFFFFF; --color-gray-100:#F5F7FA; --color-gray-800:#2D3748;
  --radius-card:14px; --tap-min:44px; --container-max:1200px;
}
```
