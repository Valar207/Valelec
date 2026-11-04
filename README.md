# Valelec

Site pédagogique pour apprendre l’électricité domestique : leçons, schémas animés, examen pratique interactif (titre pro électricien d’équipement du bâtiment, espaces de travail n°1, n°2 et n°3), bac à sable de schémas et comparaison des tableaux électriques français et américain. Thème clair ou sombre au choix.

- Code source : https://github.com/Valar207/Valelec
- Version en ligne (adresse fixe, GitHub Pages, mise à jour à chaque push) : https://valar207.github.io/Valelec/site/
- Version de test (hébergée sur le NAS via un tunnel Cloudflare) : https://satisfactory-quarter-determination-david.trycloudflare.com — cette adresse change à chaque redémarrage du tunnel.
- Ancienne version (privée, claude.ai) : https://claude.ai/artifact/S6ikzc59nVyA9KQGuzFv2d

## Branche `refonte-design`

Refonte visuelle complète, mêmes fonctionnalités. Thème « coffret électrique » :

- en-tête en rangée de modules sur un rail DIN ; chaque onglet a un petit levier qui monte et passe au jaune sur la page active ;
- accueil réduit au schéma interactif et à un sommaire en étiquettes de départ (Q1 à Q5) ;
- polices Barlow Condensed (titres, étiquettes), Barlow (texte) et JetBrains Mono (repères) ;
- angles presque droits, traits fins, presque pas d’ombres ; titres d’encadrés en étiquettes capitales ;
- textes décoratifs retirés (surtitres, introductions, cartes « Le parcours », bloc « Prochaine étape ») ;
- la couche de style est à la fin du `<style>` (« Refonte coffret électrique ») et surcharge les règles d’origine.

Aperçu de la branche : https://raw.githack.com/Valar207/Valelec/refonte-design/site/index.html

## Contenu du dossier

```
valelec/
├── README.md
├── site/
│   └── index.html          ← le site complet (HTML + CSS + JS dans un seul fichier, aucune dépendance)
└── maquettes-design/       ← maquettes du canevas Design (format .dc.html de claude.ai), pour référence
    ├── canvas.json
    ├── Main.dc.html, Bases.dc.html, Simulateur.dc.html, Editeur.dc.html, BacASable.dc.html
```

`site/index.html` est la source de vérité. Les maquettes ont servi à concevoir le site ; elles ne sont pas utilisées par le site.

## Lancer le site

Aucune compilation. Ouvrir `site/index.html` dans un navigateur, ou le servir en statique :

```
cd site && python3 -m http.server 8080
```

Seule ressource externe : les polices Google Fonts (Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono). Sans réseau, le site retombe sur les polices système.

## Organisation de `site/index.html`

Le fichier est découpé par des commentaires repères (chercher ces lignes) :

| Repère | Rôle |
|---|---|
| `<link rel="icon">` en tête | Favicon : « V » stylisé en éclair jaune sur fond sombre, en SVG intégré (aucun fichier à part) |
| `<script>` juste après `<title>` | Applique le thème mémorisé (`pn-theme`) avant l’affichage, pour éviter un flash clair |
| `<style>` en tête | Jetons de couleurs (thèmes clair et sombre : `prefers-color-scheme` ou `data-theme` sur `<html>`), styles des pages et des symboles |
| `<!-- ============ ACCUEIL / LES BASES / SCHÉMAS / EXAMEN PRATIQUE / BAC À SABLE / TABLEAUX … ============ -->` | HTML de chaque page (une seule page HTML, routage par `#ancre`) Les onglets de l’en-tête (`.nav a`) sont des pastilles bordées ; les espaces de l’examen pratique (`#ex-tabs`, `.extab`) sont des cartes avec numéro, titre et description. |
| `/* Symboles et règles */` | `DEF` : les 23 composants (dont `tele2`, télérupteur bipolaire à bornes A1/A2, 1-2 et 3-4 avec levier manuel, et `detect`, détecteur de mouvement temporisé, et `baes`, bloc d’éclairage de sécurité qui s’allume quand il n’est plus alimenté) (option `volt` sur une source pour afficher une autre tension, `ops` / `sts` sur un interrupteur pour personnaliser ses libellés, comme les déclencheurs manuels) (dont `radio`, bouton poussoir émetteur radio relié à un récepteur Yokis par sa liste `to` de repères) (bornes, dimensions, description), `defSt`, `links` (contacts internes), `loadPair` (récepteurs) |
| `solve()` / `simulate()` | Moteur électrique : réseaux équipotentiels (union-find), récepteurs alimentés, fils parcourus par le courant et sens, court-circuit et déclenchement des protections, bobines (télérupteur, contacteur, minuterie, micromodule Yokis, impulsions radio vers un Yokis alimenté) |
| `/* Son de carillon */` | Synthèse Web Audio (son toujours actif, sans bouton pour le couper ; sur mobile, le contexte audio est déverrouillé au premier contact avec la page, et `navigator.audioSession.type = 'playback'` laisse passer le son en mode silencieux sur iOS 17 et plus) du « ding / dong » de la sonnette, et de l’alarme incendie (554 Hz puis 440 Hz en boucle) jouée tant qu’un composant marqué `alarm` est alimenté (voyant H1 de l’espace n°2) |
| `/* Circuit */` | Classe `Circuit` : modèle, historique (annuler), actions sur les interrupteurs |
| `/* Rendu SVG d’un circuit */` | Classe `Board` : dessin SVG, glisser-déposer, fils, rotation, copier-coller, déplacement et zoom tactile. Dans le bac à sable, `routeAll()` trace chaque fil sur la grille (A*) sans jamais longer un autre fil : croisements à angle droit seulement, pas de passage dans un composant ni sur la borne d’un autre appareil ; quand une borne n’a plus de sortie libre, le fil se pique en T sur un fil de la même borne (point de jonction). Les schémas des autres pages gardent leur tracé en L. Plan du bac à sable : `ED_W` × `ED_H` (1400 × 1000) |
| `/* Schémas prédéfinis */` | `PRESETS` : les 11 circuits de la page Schémas (dont « Télérupteur Legrand 412412 », câblage réel d’un télérupteur bipolaire) (aussi exemples du bac à sable). Dans la liste de gauche (`simNav()`), chaque circuit est une carte cliquable avec l’icône de son appareil principal (`ICON`) |
| `/* Examen pratique (TP-00467, espace n°1) */` | `buildExam1()` : espace n°1, le logement (tableau TR avec ID1/ID2 et D1 à D6, R1/R2 Yokis commandés par S1, E1, E2, contacteur C1 heures creuses commandé par S2, chauffe-eau SC, prises PC1 et PC2). `buildExam2()` : espace n°2, les parties communes (minuterie KT1 commandée par S1 et S2 pour L1 et L2, prise PC1, circuit SSI 24 V avec DM1, DM2 et voyant H1 qui déclenche l’alarme sonore). `buildExam3()` : espace n°3, les locaux tertiaires (détecteur S2 pour L1 et L2, BAES en aval de Q2 et en amont du détecteur, arrêt d’urgence S1 à manque de tension sur la bobine de KM1 qui coupe PC1). `ESPACES` : titre, texte et ordre des commandes de chaque espace ; dans le HTML, `data-espace` affiche les blocs propres à l’espace choisi |
| `/* Bac à sable */` | Palette, barre d’outils, panneau de propriétés, diagnostic, raccourcis clavier |
| `/* Tableaux France / États-Unis */` | Les deux tableaux comparés : données, logique de déclenchement, dessin, messages |
| `/* Navigation */` | Routage par ancre : `#accueil`, `#bases`, `#schemas`, `#examen`, `#bac-a-sable`, `#tableaux` |
| `/* Bouton mode sombre */` | Bascule clair / sombre dans l’en-tête ; par défaut, le thème suit le réglage de l’appareil |

## Ajouter un composant

1. Ajouter une entrée dans `DEF` (dimensions multiples de 40, bornes à des multiples de 20 du centre pour tomber sur la grille). Mettre `norot: true` pour un composant qui ne doit pas pivoter (c’est le cas de la borne de connexion, qui n’est qu’un point).
2. Si besoin : état par défaut dans `defSt`, contacts dans `links`, récepteur dans `loadPair`, puissance dans `WATT`.
3. Dessin dans `sym()` (repère local 0..w, 0..h).
4. L’ajouter à un groupe de la palette (`groups` dans la partie Bac à sable).

## Données enregistrées dans le navigateur

`localStorage` : `pn-bac-a-sable` (schéma du bac à sable), `pn-clip` (composant copié), `pn-theme` (`light` ou `dark`, choisi avec le bouton de l’en-tête), `pn-espace` (dernier espace ouvert dans l’examen pratique).

## Hébergement actuel

Le site est servi depuis le NAS par la stack Docker `/volume1/docker/valelec/` :

- `valelec-web` : nginx (non root) qui sert le dossier `site/` en lecture seule ;
- `valelec-tunnel` : tunnel rapide Cloudflare (sans compte), qui donne une adresse `*.trycloudflare.com` aléatoire.

Retrouver l'adresse actuelle : `docker logs valelec-tunnel 2>&1 | grep trycloudflare.com`.
Toute modification de `site/index.html` est en ligne immédiatement.

## Examen pratique : hypothèses

Ces hypothèses ne sont plus affichées sur le site (encarts retirés à la demande) ; elles restent notées ici.

La page Examen pratique reprend le dossier candidat TP-00467 (espaces de travail n°1, n°2 et n°3).

Espace n°1 : La page du schéma unifilaire du tableau TR n’était pas disponible : la répartition des circuits (D1 → PC1, D2 → L1 + L3, D3 → L2, D4 → PC2, D5 → commande de C1, D6 → chauffe-eau) est une proposition cohérente avec la NF C 15-100, à vérifier avec le dossier. Les différentiels sont dessinés sur la phase seulement, et l’interphone I1 (très basse tension) n’est pas représenté.

Espace n°2 : la minuterie KT1 et les disjoncteurs Q1 (20 A, prise) et Q2 (16 A, éclairage) représentent l’armoire des services généraux, en amont de la boîte 5 ; leur calibre est une hypothèse. Le câble C9 (SSI) est représenté par un voyant H1 alimenté en 24 V, et les déclencheurs manuels par des contacts ouverts au repos : le câblage réel dépend de la centrale.

Espace n°3 : Q1 (20 A, prise), Q2 (16 A, éclairage), Q3 (2 A, commande) et le contacteur KM1 représentent l’armoire tertiaire, en amont de la boîte 7 ; leur calibre et le fait que l’arrêt d’urgence coupe la prise PC1 sont des hypothèses. L’arrêt d’urgence est représenté à manque de tension, la télécommande du BAES par un bouton « mise au repos », et les prises RJ45 ne sont pas simulées.

## Avertissement

Schémas simplifiés à but pédagogique. Références : NF C 15-100 (France), National Electrical Code (États-Unis).
