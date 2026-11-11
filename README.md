# Valelec

Site pédagogique pour apprendre l’électricité domestique : leçons, schémas animés, examen pratique interactif (titre pro électricien d’équipement du bâtiment, espaces de travail n°1, n°2 et n°3), bac à sable de schémas, comparaison des tableaux électriques français et américain, et deux modules métier : panneaux photovoltaïques et bornes de recharge IRVE. Thème clair ou sombre au choix.

- Code source : https://github.com/Valar207/Valelec
- Adresse principale (Cloudflare Pages, projet `formationeeb`, branche `main`, dossier publié `site`, mise à jour automatique à chaque push) : https://formationeeb.pages.dev/
- Copie GitHub Pages (même contenu, mise à jour à chaque push) : https://valar207.github.io/Valelec/site/
- Version de test (hébergée sur le NAS via un tunnel Cloudflare) : https://satisfactory-quarter-determination-david.trycloudflare.com — cette adresse change à chaque redémarrage du tunnel.
- Ancienne version (privée, claude.ai) : https://claude.ai/artifact/S6ikzc59nVyA9KQGuzFv2d

## Contenu du dossier

```
valelec/
├── README.md
├── site/
│   ├── index.html          ← le site complet (HTML + CSS + JS dans un seul fichier)
│   └── vendor/three.min.js ← three.js r150.1 (licence MIT), chargé seulement quand une vue 3D devient visible
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

Seule ressource externe : les polices Google Fonts (Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono). Sans réseau, le site retombe sur les polices système. La vue 3D utilise `site/vendor/three.min.js`, livré avec le site (pas de CDN) ; si la création du rendu échoue, `View.renderer()` essaie quatre réglages (antialiasing, sans antialiasing, précision moyenne, WebGL 1) ; en dernier recours, `showFailure()` affiche la cause probable et le détail technique, et le schéma 2D reste utilisable.

## Organisation de `site/index.html`

Le fichier est découpé par des commentaires repères (chercher ces lignes) :

| Repère | Rôle |
|---|---|
| `<link rel="icon">` en tête | Favicon : « V » stylisé en éclair jaune sur fond sombre, en SVG intégré (aucun fichier à part) |
| `<script>` juste après `<title>` | Applique le thème mémorisé (`pn-theme`) avant l’affichage, pour éviter un flash clair |
| `<style>` en tête | Jetons de couleurs (thèmes clair et sombre : `prefers-color-scheme` ou `data-theme` sur `<html>`), styles des pages et des symboles |
| `<!-- ============ ACCUEIL / LES BASES / SCHÉMAS / EXAMEN PRATIQUE / BAC À SABLE / TABLEAUX … ============ -->` | HTML de chaque page (une seule page HTML, routage par `#ancre`) Les onglets de l’en-tête (`.nav a`) sont des pastilles bordées ; les espaces de l’examen pratique (`#ex-tabs`, `.extab`) sont des cartes avec numéro, titre et description. |
| `/* Symboles et règles */` | `DEF` : les 24 composants (dont `dpn`, disjoncteur phase + neutre à bornes 1-2 et N1-N2, qui coupe les deux pôles, et `tele2`, télérupteur bipolaire à bornes A1/A2, 1-2 et 3-4 avec levier manuel, et `detect`, détecteur de mouvement temporisé, et `baes`, bloc d’éclairage de sécurité qui s’allume quand il n’est plus alimenté) (option `volt` sur une source pour afficher une autre tension, `ops` / `sts` sur un interrupteur pour personnaliser ses libellés, comme les déclencheurs manuels) (dont `radio`, bouton poussoir émetteur radio relié à un récepteur Yokis par sa liste `to` de repères) (bornes, dimensions, description), `defSt`, `links` (contacts internes), `loadPair` (récepteurs) |
| `solve()` / `simulate()` | Moteur électrique : réseaux équipotentiels (union-find), récepteurs alimentés, fils parcourus par le courant et sens, court-circuit et déclenchement des protections, bobines (télérupteur, contacteur, minuterie, micromodule Yokis, impulsions radio vers un Yokis alimenté) |
| `/* Son de carillon */` | Synthèse Web Audio (son toujours actif, sans bouton pour le couper ; sur mobile, le contexte audio est déverrouillé au premier contact avec la page, et `navigator.audioSession.type = 'playback'` laisse passer le son en mode silencieux sur iOS 17 et plus) du « ding / dong » de la sonnette, et de l’alarme incendie (554 Hz puis 440 Hz en boucle) jouée tant qu’un composant marqué `alarm` est alimenté (voyant H1 de l’espace n°2) |
| `/* Circuit */` | Classe `Circuit` : modèle, historique (annuler), actions sur les interrupteurs |
| `/* Rendu SVG d’un circuit */` | Classe `Board` : dessin SVG, glisser-déposer, fils, rotation, copier-coller, déplacement et zoom tactile. Sur toutes les pages, `routeAll()` trace chaque fil sur la grille (A*) sans jamais longer un autre fil : croisements à angle droit seulement, pas de passage dans un composant ni sur la borne d’un autre appareil ; quand une borne n’a plus de sortie libre, le fil se pique en T sur un fil de la même borne (point de jonction).  Plan du bac à sable : `ED_W` × `ED_H` (1400 × 1000) |
| `/* Schémas prédéfinis */` | `PRESETS` : les 11 circuits de la page Schémas (dont « Télérupteur Legrand 412412 », câblage réel d’un télérupteur bipolaire) (aussi exemples du bac à sable). Dans la liste de gauche (`simNav()`), chaque circuit est une carte cliquable avec l’icône de son appareil principal (`ICON`) |
| `/* Examen pratique (TP-00467, espace n°1) */` | Câblage à la française sur tous les schémas : chaque circuit part de son propre disjoncteur 1P+N avec sa phase et son neutre, et les neutres de deux circuits ne sont jamais réunis ; chaque interrupteur différentiel a ses peignes phase et neutre. `buildExam1()` : espace n°1, le logement, conforme à l’unifilaire du dossier (tableau TR avec ID1 type A pour D1 à D3 et ID2 type AC pour D4 à D6, R1/R2 Yokis commandés par S1, E1, E2, contacteur C1 heures creuses commandé par S2, chauffe-eau SC, prises PC1 et PC2). `buildExam2()` : espace n°2, les parties communes (minuterie KT1 commandée par S1 et S2 pour L1 et L2, prise PC1, circuit SSI 24 V avec DM1, DM2 et voyant H1 qui déclenche l’alarme sonore). `buildExam3()` : espace n°3, les locaux tertiaires (détecteur S2 pour L1 et L2, BAES en aval de Q2 et en amont du détecteur, arrêt d’urgence S1 à manque de tension sur la bobine de KM1 qui coupe PC1). `ESPACES` : titre, texte et ordre des commandes de chaque espace ; dans le HTML, `data-espace` affiche les blocs propres à l’espace choisi |
| `/* Vue 3D */` | `V3D` : panneau à côté du schéma (pages Schémas et Examen pratique). `Builder` modèle en volumes des appareils réalistes (`dev()` : interrupteur, poussoir, poussoir étanche, prise, luminaire, hublot, déclencheur manuel, arrêt d’urgence, BAES, détecteur, prise RJ45 ; `module()` : module sur rail DIN) et crée le mur, les boîtes de dérivation ouvertes (un connecteur par équipotentielle), les appareils, le tableau, les conduits (ICTA, IRL, goulotte DLP, moulure, câble) et chaque conducteur à sa couleur. `esp1()`, `esp2()`, `esp3()` reprennent l’implantation et les canalisations du dossier TP-00467 ; `auto()` génère la scène d’un schéma à partir de `comps` et `wires`. `View` gère les gestes (au doigt : un doigt pour déplacer, deux doigts qui glissent ensemble pour tourner, deux doigts qui s’écartent pour zoomer, un seul de ces deux gestes par contact ; au trackpad : cliquer-glisser pour déplacer, deux doigts pour tourner, pincer pour zoomer ; à la souris : glisser pour déplacer, molette pour zoomer, Maj + glisser ou clic droit pour tourner), le chargement différé de three.js, et reste branché sur la simulation : un clic ou un toucher sur un appareil à étiquette verte appelle `Circuit.operate()` (`near()` retient l’appareil le plus proche du point touché), et `sync()` met à jour lampes, manettes, poussoirs, fiches, voyants et BAES. Un toucher sur une boîte (étiquette bleue) lance un zoom animé (`openZone()`, retour par `closeZone()`). Construction pas à pas : `Builder.grp()` range chaque objet dans le groupe de son étape (`base`, `sup`, `box`, `tab`, `ALIM:w`, puis `<circuit>:dev` et `<circuit>:w`, enfin `COM:…`), `View.buildSteps()` en déduit la liste et les textes, `stepGo()` affiche les groupes jusqu’à l’étape choisie et `animWires()` déroule les fils. `circuitsOf()` découpe un schéma en circuits (tout ce qui est en aval d’une même protection) et `makeHL()` relie les boutons « Suivre un circuit », le schéma 2D et la 3D : toucher un fil met son circuit en surbrillance (fils lumineux avec halo ; fils, connecteurs et appareils des autres circuits transparents, reste de la scène dans l’ombre) ; le toucher suivant, n’importe où sur la page, réaffiche tout. Seuls les boutons `.ctl` (circuits et commandes) laissent la surbrillance active. Dans les scènes de l’énoncé, `B.cmap` indique à quel circuit appartient chaque conducteur. Chaque scène est construite deux fois : la première passe compte les fils par équipotentielle (`plan`), la seconde dessine des connecteurs à leviers avec un port par fil et leur repère. Rendu illustratif : les diamètres sont légèrement exagérés pour que chaque fil reste visible (rayon d’un conducteur : 3,4 mm dans la scène, à régler avec celui des conduits dans `Builder.run()`). Rendu : sortie sRGB et tons filmiques (ACES), ombres portées (carte d’ombres 2048), reflets d’ambiance générés par `PMREMGenerator` à partir d’une petite pièce, mur crépi en relief et parquet ; `soft()` (fausses ombres) est désactivé |
| Mise en page des pages Schémas et Examen | `.dual` : sur une zone d’au moins 760 px (requête de conteneur sur `.stage`), grille à deux colonnes alignées (titres, schéma 2D et vue 3D de même hauteur, commandes sous chacun) ; en dessous, empilement. Les commandes (`.ctls.cgrid`) sont des cartes de même taille : repère, réglage, action. Les blocs de texte (`.box`, `.ex-table`) de ces deux pages sont des notes compactes en petit, en bas de page |
| `<!-- ============ EXAMEN THÉORIQUE ============ -->` et `/* ---------------- Examen théorique (QCM TP-00467) ---------------- */` | Page `#qcm` : les 60 questions du questionnaire professionnel (`QCM` : énoncé, 5 propositions, bonne réponse, explication du corrigé, photo dans `site/qcm/` ; les champs `w` et `r` gardent la trace des réponses à confirmer et des propositions reconstituées, sans affichage). Choix de la compétence et ordre mélangé ; un clic choisit une proposition, « Valider ma réponse » la confirme (clavier : A à E puis Entrée), explication affichée après chaque réponse, note finale avec visage (moins de 50 % : pleure, 50 à 74 % : mitigé, 75 % et plus : content), score par compétence, révision des erreurs, reprise (`pn-qcm`). Les propositions des questions 10 à 21 sont reconstituées (pages absentes du scan) |
| `/* ---------------- Câblage PV et IRVE (2D + 3D) ---------------- */` | Sections `#pv-cablage` et `#irve-cablage` (un bouton `.lab-view` bascule vers les anciens schémas de principe animés `#pv-svg` et `#ir-svg`, rangés dans la même section ; les sections démarches et qualification, ainsi que les tableaux de détail (fiche technique, coefficients d’orientation, puissances AC, états du signal pilote), sont repliés dans un `details.more` ; restent ouverts le comparatif des onduleurs et le tableau des 4 modes) : `makeLab()` monte un schéma 2D (`Board`), une vue 3D (`V3D.auto`) et les commandes, comme sur la page Schémas. `buildPV()` : champ PV, sectionneur et parafoudre DC, onduleur, disjoncteur et parafoudre AC, compteur, AGCP, consommation ; l’onduleur ne produit que si le réseau est présent (anti-îlotage). `buildIRVE(1 à 4)` : les 4 modes de recharge. Nouveaux composants dans `DEF` (aussi dans la palette du bac à sable) : `pv`, `ond`, `cpt`, `spd`, `evse`, `ev` |
| `<style id="ds-tension">` et `<script id="ds-fx">` | Design system « Tension », posé par-dessus les styles de base. Jetons : couleurs des conducteurs (`--volt`, `--phase`, `--plasma`, `--ion`, `--neutre`, `--terre`), dégradés `--g-arc` (arc complet), `--g-live` (éléments actifs, texte blanc) et `--g-ring` (bord tournant des cartes), rayons `--r-s/m/l`, courbes `--ease` et `--spring` ; thèmes clair et sombre. Police de titres : Sora. Bouton « Plein écran » ajouté à chaque vue 3D (`.v3d-fs`, classe `.fs` sur `.v3d-wrap` ; le pas à pas, les circuits et les gestes restent actifs ; Échap pour sortir). Mouvement : fond à halos qui dérivent et lueur qui suit le pointeur (`#fx`), fil de progression sous l’en-tête (`--sp`), sinusoïdes triphasées sur l’accueil (`#hero-waves`), bandeau défilant (`.ticker`), apparition au défilement (`.rv`, avec filet de sécurité), inclinaison des cartes (`.tilt`), étincelles au clic (`.spark`) et pluie d’étincelles sur une bonne note au QCM. Tout est coupé si l’appareil demande moins d’animations (`prefers-reduced-motion`) |
| `/* Bac à sable */` | Palette, barre d’outils, panneau de propriétés, diagnostic, raccourcis clavier. Une poubelle rouge apparaît sur l’élément sélectionné, composant ou fil (`Board.delSel()`, annulable) |
| `/* Tableaux France / États-Unis */` | Les deux tableaux comparés : données, logique de déclenchement, dessin, messages |
| `<!-- ============ PANNEAUX PV ============ -->` et `/* ---------------- Panneaux PV ---------------- */` | Module 5 (`#pv`) : principe, courbe I-V interactive d’un module 430 Wc (modèle à une exponentielle), comparatif des onduleurs, estimation de production (productible par ville × coefficient orientation/inclinaison), dimensionnement des chaînes (Voc par grand froid, Vmpp par forte chaleur, plage MPPT, rapport kWc/onduleur), règles de protection DC (fusibles, sectionneur, parafoudre, terre), calcul de chute de tension, schéma animé (sectionneur DC, disjoncteur PV, coupure réseau et découplage), pose pas à pas, démarches de raccordement |
| `<!-- ============ BORNES IRVE ============ -->` et `/* ---------------- Bornes IRVE ---------------- */` | Module 6 (`#irve`) : recharge AC/DC, modes 1 à 4 et connecteurs, calcul du temps de charge (borne × chargeur embarqué), simulateur du signal pilote CP (états A/B/C, rapport cyclique = I ÷ 0,6), dimensionnement du circuit (disjoncteur repère, section avec chute de tension ≤ 3 %, type de différentiel, marge d’abonnement), schéma animé d’une wallbox 7,4 kW avec défaut d’isolement, pose pas à pas, qualification IRVE P1/P2/P3 |
| `/* Navigation */` | En-tête : liens en ligne sur grand écran, menu burger groupé (Apprendre, S’entraîner, Aller plus loin) à 1240 px et moins (`openMenu()` / `closeMenu()`). `NAV_ORDER` définit la barre Précédent / Suivant en bas de page (`#nextbar`) ; l’accueil propose quatre chemins et un bouton Reprendre (`pn-last`). Sur téléphone, la liste des circuits devient une bande horizontale et la palette du bac à sable une feuille ouverte par « Ajouter un composant ». Routage par ancre : `#accueil`, `#bases`, `#schemas`, `#examen`, `#bac-a-sable`, `#tableaux`, `#pv`, `#irve` (les sous-sections `#pv-…` et `#irve-…` ouvrent la bonne page et défilent jusqu’à la section) |
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

Schémas simplifiés à but pédagogique. Références : NF C 15-100 (France), National Electrical Code (États-Unis), guide UTE C 15-712-1 (photovoltaïque), NF C 15-100 partie 7-722, IEC 61851, IEC 62196 et IEC 62955 (IRVE). Les valeurs des calculateurs PV et IRVE (productibles, disjoncteurs et sections repères) sont des ordres de grandeur : la notice du fabricant et l’étude de l’installation priment.
