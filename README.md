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
│   ├── presentation.html   ← page de présentation pour les centres de formation (non référencée, captures dans presentation/ : examen, pas-a-pas, qcm, lexique, grandeurs, consignation, panne ; à reprendre après un gros changement)
│   ├── qcm/                ← photos du QCM
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
| `/* Rendu SVG d’un circuit */` | Classe `Board` : sous chaque repère, `subOf()` écrit le nom de l’appareil (`KIND` : « bouton poussoir », « disjoncteur »…) puis sa précision technique (calibre, rôle) ; les noms de pièces (`LAB_LIEU`) ne sont plus affichés ; en lecture (pages Accueil, Schémas, Examen, PV, IRVE), `zoomInit()` ajoute le zoom au pincement, à Ctrl + molette ou au double-clic (jusqu’à ×6, en changeant le `viewBox`), le déplacement une fois zoomé et un bouton « Vue entière » ; un appareil s’actionne au relâchement du doigt, pas à l’appui ; dessin SVG, glisser-déposer, fils, rotation, copier-coller, déplacement et zoom tactile. Sur toutes les pages, `routeAll()` trace chaque fil sur la grille (A*) sans jamais longer un autre fil : croisements à angle droit seulement, pas de passage dans un composant ni sur la borne d’un autre appareil ; quand une borne n’a plus de sortie libre, le fil se pique en T sur un fil de la même borne (point de jonction).  Plan du bac à sable : `ED_W` × `ED_H` (1400 × 1000) |
| `/* Schémas prédéfinis */` | `PRESETS` : les 12 circuits de la page Schémas (dont « Télérupteur Legrand 412412 », câblage réel d’un télérupteur bipolaire) (aussi exemples du bac à sable). Dans la liste de gauche (`simNav()`), chaque circuit est une carte cliquable avec l’icône de son appareil principal (`ICON`) |
| `/* Examen pratique (TP-00467, espace n°1) */` | Câblage à la française sur tous les schémas : chaque circuit part de son propre disjoncteur 1P+N avec sa phase et son neutre, et les neutres de deux circuits ne sont jamais réunis ; chaque interrupteur différentiel a ses peignes phase et neutre. `buildExam1()` : espace n°1, le logement, conforme à l’unifilaire du dossier (tableau TR avec ID1 type A pour D1 à D3 et ID2 type AC pour D4 à D6, R1/R2 Yokis commandés par S1, E1, E2, contacteur C1 heures creuses commandé par S2, chauffe-eau SC, prises PC1 et PC2). `buildExam2()` : espace n°2, les parties communes (minuterie KT1 commandée par S1 et S2 pour L1 et L2, prise PC1, circuit SSI 24 V avec DM1, DM2 et voyant H1 qui déclenche l’alarme sonore). `buildExam3()` : espace n°3, les locaux tertiaires (détecteur S2 pour L1 et L2, BAES en aval de Q2 et en amont du détecteur, arrêt d’urgence S1 à manque de tension sur la bobine de KM1 qui coupe PC1). `ESPACES` : titre, texte et ordre des commandes de chaque espace ; dans le HTML, `data-espace` affiche les blocs propres à l’espace choisi |
| `/* Vue 3D */` | `V3D` : panneau à côté du schéma (pages Schémas et Examen pratique). `Builder` modèle en volumes des appareils réalistes (`dev()` : interrupteur, poussoir, poussoir étanche, prise, luminaire, hublot, déclencheur manuel, arrêt d’urgence, BAES, détecteur, prise RJ45 ; `module()` : module sur rail DIN) et crée le mur, les boîtes de dérivation ouvertes (un connecteur par équipotentielle), les appareils, le tableau, les conduits (ICTA, IRL, goulotte DLP, moulure, câble) et chaque conducteur à sa couleur. `esp1()`, `esp2()`, `esp3()` reprennent l’implantation et les canalisations du dossier TP-00467 ; `auto()` génère la scène d’un schéma à partir de `comps` et `wires`. `View` gère les gestes (au doigt : un doigt pour déplacer, deux doigts qui glissent ensemble pour tourner, deux doigts qui s’écartent pour zoomer, un seul de ces deux gestes par contact ; au trackpad : cliquer-glisser pour déplacer, deux doigts pour tourner, pincer pour zoomer ; à la souris : glisser pour déplacer, molette pour zoomer, Maj + glisser ou clic droit pour tourner), le chargement différé de three.js, et reste branché sur la simulation : un clic ou un toucher sur un appareil à étiquette verte appelle `Circuit.operate()` (`near()` retient l’appareil le plus proche du point touché), et `sync()` met à jour lampes, manettes, poussoirs, fiches, voyants et BAES. Un toucher sur une boîte (étiquette bleue) lance un zoom animé (`openZone()`, retour par `closeZone()`). Construction pas à pas : `Builder.grp()` range chaque objet dans le groupe de son étape (`base`, `sup`, `box`, `tab`, `ALIM:w`, puis `<circuit>:dev` et `<circuit>:w`, enfin `COM:…`), `View.buildSteps()` en déduit la liste et les textes, `stepGo()` affiche les groupes jusqu’à l’étape choisie et `animWires()` déroule les fils. `circuitsOf()` découpe un schéma en circuits (tout ce qui est en aval d’une même protection) et `makeHL()` relie les boutons « Suivre un circuit », le schéma 2D et la 3D : toucher un fil met son circuit en surbrillance (fils lumineux avec halo ; fils, connecteurs et appareils des autres circuits transparents, reste de la scène dans l’ombre) ; le toucher suivant, n’importe où sur la page, réaffiche tout. Seuls les boutons `.ctl` (circuits et commandes) laissent la surbrillance active. Dans les scènes de l’énoncé, `B.cmap` indique à quel circuit appartient chaque conducteur. Chaque scène est construite deux fois : la première passe compte les fils par équipotentielle (`plan`), la seconde dessine des connecteurs à leviers avec un port par fil et leur repère. Rendu illustratif : les diamètres sont légèrement exagérés pour que chaque fil reste visible (rayon d’un conducteur : 3,4 mm dans la scène, à régler avec celui des conduits dans `Builder.run()`). Rendu : sortie sRGB et tons filmiques (ACES), ombres portées (carte d’ombres 2048), reflets d’ambiance générés par `PMREMGenerator` à partir d’une petite pièce, mur crépi en relief et parquet ; `soft()` (fausses ombres) est désactivé |
| Mise en page des pages Schémas et Examen | `.dual` : sur une zone d’au moins 760 px (requête de conteneur sur `.stage`), grille à deux colonnes alignées (titres, schéma 2D et vue 3D de même hauteur, commandes sous chacun) ; en dessous, empilement. Les commandes (`.ctls.cgrid`) sont des cartes de même taille : repère, réglage, action. Les blocs de texte (`.box`, `.ex-table`) de ces deux pages sont des notes compactes en petit, en bas de page |
| `<!-- ============ EXAMEN THÉORIQUE ============ -->` et `/* ---------------- Examen théorique (QCM TP-00467) ---------------- */` | Page `#qcm` : les 60 questions du questionnaire professionnel (`QCM` : énoncé, 5 propositions, bonne réponse, explication du corrigé, photo dans `site/qcm/` ; les champs `w` et `r` gardent la trace des réponses à confirmer et des propositions reconstituées, sans affichage). Choix de la compétence et ordre mélangé ; un clic choisit une proposition, « Valider ma réponse » la confirme (clavier : A à E puis Entrée), explication affichée après chaque réponse, note finale avec visage (moins de 50 % : pleure, 50 à 74 % : mitigé, 75 % et plus : content), score par compétence, révision des erreurs, reprise (`pn-qcm`). Les propositions des questions 10 à 21 sont reconstituées (pages absentes du scan) |
| `/* ---------------- Câblage PV et IRVE (2D + 3D) ---------------- */` | Sections `#pv-cablage` et `#irve-cablage` (un bouton `.lab-view` bascule vers les anciens schémas de principe animés `#pv-svg` et `#ir-svg`, rangés dans la même section ; les sections démarches et qualification, ainsi que les tableaux de détail (fiche technique, coefficients d’orientation, puissances AC, états du signal pilote), sont repliés dans un `details.more` ; restent ouverts le comparatif des onduleurs et le tableau des 4 modes) : `makeLab()` monte un schéma 2D (`Board`), une vue 3D (`V3D.auto`) et les commandes, comme sur la page Schémas. `buildPV()` : champ PV, sectionneur et parafoudre DC, onduleur, disjoncteur et parafoudre AC, compteur, AGCP, consommation ; l’onduleur ne produit que si le réseau est présent (anti-îlotage). `buildIRVE(1 à 4)` : les 4 modes de recharge. Nouveaux composants dans `DEF` (aussi dans la palette du bac à sable) : `pv`, `ond`, `cpt`, `spd`, `evse`, `ev` |
| `<style id="ds-tension">` et `<script id="ds-fx">` | Design system « Tension », posé par-dessus les styles de base. Jetons : couleurs des conducteurs (`--volt`, `--phase`, `--plasma`, `--ion`, `--neutre`, `--terre`), dégradés `--g-arc` (arc complet), `--g-live` (éléments actifs, texte blanc) et `--g-ring` (bord tournant des cartes), rayons `--r-s/m/l`, courbes `--ease` et `--spring` ; thèmes clair et sombre. Police de titres : Sora. Sur téléphone (zone de moins de 760 px), le schéma 2D et la vue 3D sont côte à côte dans un carrousel à glissement (`scroll-snap`), le suivant dépasse sur le bord, avec les boutons « 3D → » et « ← 2D » (`.swp`). Fils sous tension sans courant (`.cur.live`) : étincelles qui crépitent sur place (`pncrack`, `pnflick`) ; fils parcourus par le courant (`.cur.on`) : tirets jaunes qui avancent. Bouton « Plein écran » ajouté à chaque vue 3D (`.v3d-fs`, classe `.fs` sur `.v3d-wrap` ; le pas à pas, les circuits et les gestes restent actifs ; Échap pour sortir). Mouvement : fond à halos qui dérivent et lueur qui suit le pointeur (`#fx`), fil de progression sous l’en-tête (`--sp`), sinusoïdes triphasées sur l’accueil (`#hero-waves`), bandeau défilant (`.ticker`), apparition au défilement (`.rv`, avec filet de sécurité), inclinaison des cartes (`.tilt`), étincelles au clic (`.spark`) et pluie d’étincelles sur une bonne note au QCM. Tout est coupé si l’appareil demande moins d’animations (`prefers-reduced-motion`). Performances : le fond est un calque fixe et les dégradés ne bougent plus (aucun texte ni bouton repeint en continu) ; restent animés le bandeau, les ondes de l’accueil (30 images par seconde), les fils des schémas et les effets au survol ou au clic. En 3D : three.js est préchargé au repos, la passe de comptage du `Builder` (`dry`) ne crée ni géométrie ni texture, les ombres ne sont recalculées que si la scène change (`shadowMap.autoUpdate = false`) |
| Accessibilité | Vérifiée avec axe-core 4.10 (règles WCAG 2.1 A et AA) sur les 9 pages, en clair et en sombre : aucune erreur. Lien « Aller au contenu » (`.skip`), `<main id="main">`, titres masqués (`.sr-only`) là où une section commençait par des h3, en-têtes de tableau nommés, barres d’état annoncées (`role="status"`, `aria-live`), vue 3D nommée (`role="img"`). Les fonds en dégradé sous du texte blanc utilisent `--g-cta` (contraste d’au moins 4,5:1 sur toute la longueur) ; les titres en dégradé utilisent `--g-text` (`--g-cta` en clair, `--g-live` en sombre). Sur téléphone, la liste des circuits a un titre visible (`#sim-pick`) |
| `/* Bac à sable */` | Palette, barre d’outils, panneau de propriétés, diagnostic, raccourcis clavier. Une poubelle rouge apparaît sur l’élément sélectionné, composant ou fil (`Board.delSel()`, annulable) |
| `/* Tableaux France / États-Unis */` | Les deux tableaux comparés : données, logique de déclenchement, dessin, messages |
| `<!-- ============ PANNEAUX PV ============ -->` et `/* ---------------- Panneaux PV ---------------- */` | Module 5 (`#pv`) : principe, courbe I-V interactive d’un module 430 Wc (modèle à une exponentielle), comparatif des onduleurs, estimation de production (productible par ville × coefficient orientation/inclinaison), dimensionnement des chaînes (Voc par grand froid, Vmpp par forte chaleur, plage MPPT, rapport kWc/onduleur), règles de protection DC (fusibles, sectionneur, parafoudre, terre), calcul de chute de tension, schéma animé (sectionneur DC, disjoncteur PV, coupure réseau et découplage), pose pas à pas, démarches de raccordement |
| `<!-- ============ BORNES IRVE ============ -->` et `/* ---------------- Bornes IRVE ---------------- */` | Module 6 (`#irve`) : recharge AC/DC, modes 1 à 4 et connecteurs, calcul du temps de charge (borne × chargeur embarqué), simulateur du signal pilote CP (états A/B/C, rapport cyclique = I ÷ 0,6), dimensionnement du circuit (disjoncteur repère, section avec chute de tension ≤ 3 %, type de différentiel, marge d’abonnement), schéma animé d’une wallbox 7,4 kW avec défaut d’isolement, pose pas à pas, qualification IRVE P1/P2/P3 |
| `/* Navigation */` | En-tête : liens en ligne sur grand écran, menu burger groupé (Apprendre, S’entraîner, Aller plus loin) à 1240 px et moins (`openMenu()` / `closeMenu()`). `NAV_ORDER` définit la barre Précédent / Suivant en bas de page (`#nextbar`) ; l’accueil propose quatre chemins et un bouton Reprendre (`pn-last`). Sur téléphone, la liste des circuits devient une bande horizontale et la palette du bac à sable une feuille ouverte par « Ajouter un composant ». Routage par ancre : `#accueil`, `#bases`, `#schemas`, `#examen`, `#bac-a-sable`, `#tableaux`, `#pv`, `#irve` (les sous-sections `#pv-…` et `#irve-…` ouvrent la bonne page et défilent jusqu’à la section) |
| `/* Bouton mode sombre */` | Bascule clair / sombre dans l’en-tête ; par défaut, le thème suit le réglage de l’appareil |

## Symboles expliqués (page Les bases)

La section « Les symboles à connaître » est générée par `symbols()` : un lexique repliable (`MOTS`, ouvert d’office sur grand écran), puis les symboles rangés par famille (`FAM`). Chaque carte affiche une phrase en clair (`AIDE[clé][0]`) et un menu déroulant « Comprendre en détail » : où on croise l’appareil, un détail utile, la description technique (`DEF[clé].desc`) et la définition des mots du lexique utilisés. Un symbole ajouté à `order` sans entrée dans `AIDE` s’affiche quand même, avec sa description technique, dans « Ce qui consomme ». Toutes les cartes fermées prennent la même hauteur : `egal()` mesure la plus haute et l’applique en `min-height` à toutes (au chargement, au redimensionnement et à l’affichage de la page ; désactivé sous 560 px de large). Une carte ouverte s’agrandit seule. Styles : bloc `<style id="sym-aide">` juste après la couche de design.

## Lexique et infobulles

`GLOSSAIRE` (avant le routeur) liste les mots techniques : clé, motif, titre, définition, et s’il figure dans le lexique de début (section `#lexique` en tête des Bases, bloc repliable `#lex-det` fermé au départ, ouvert par le lien du sommaire). Ordre du lexique et des familles de symboles : chaque explication ne s’appuie que sur des mots ou des appareils déjà présentés avant elle. Chaque mot du lexique est écrit en italique, finement souligné et suivi d’une astérisque, une fois par section ; survol à la souris, toucher sur mobile, Entrée au clavier ; fermeture par clic ailleurs ou Échap. Le balayage se relance quand le contenu change (MutationObserver). Les cartes de symboles (`AIDE`) affichent « Sur le schéma » : le dessin, un exemple dans un schéma du site et un bouton qui l’ouvre (`data-ouvrir`).

## Cartes U, I, R et page « Sécurité et dépannage »

- **Cartes U, I, R (Bases)** : chaque carte porte une petite animation du tuyau d’eau (`.qanim` : pompe et manomètre pour U, débit au compteur pour I, rétrécissement pour R) et une ligne « Se mesure avec ». `grandeurs()` alterne toutes les 3,2 s entre deux situations (classe `b`, légendes `data-a` / `data-b`), seulement quand les cartes sont visibles, et jamais si l’utilisateur réduit les animations.
- **Page `#depannage`** (menu « S’entraîner », après l’examen théorique) :
  - `consignation()` : les étapes de la NF C 18-510 à choisir dans l’ordre (`ETAPES`) parmi des pièges (`PIEGES`) : un clic sélectionne une étape, le bouton « Valider cette étape » (`#cons-ok`) la vérifie ; le tableau dessiné réagit (disjoncteur ouvert, cadenas, pancarte, VAT).
  - `panne()` : 7 pannes (`SC`) construites à partir des schémas (`PRESETS`) ou de `BASES`. Un fil en défaut porte `cut: true` : il reste dessiné mais `solve()` l’ignore. Le VAT mesure entre deux bornes (`etat()` : phase, neutre, terre ou en l’air ; un récepteur transmet le potentiel à une borne isolée). La lueur « sous tension » est masquée sur ce schéma pour ne pas trahir la panne.

## Mesure d'audience (GoatCounter)

Tableau de bord : https://valaris.goatcounter.com (compte de Valentin). Comptage anonyme, sans cookie, actif seulement sur `formationeeb.pages.dev` (`STAT_ON`) : les essais en local et la copie GitHub Pages ne comptent pas.

- **Pages** : une vue par page du site (`/bases`, `/schemas`, `/depannage`…), calculée depuis le `#` de l’adresse (`audience()`).
- **Événements** (`stat(nom, titre)`) : `schema/<id>`, `schema-30s/<id>`, `examen/espace-<n>`, `symbole/…`, `lexique/infobulle-<mot>`, `lexique/ouvert`, `qcm/commence`, `qcm-termine/<complet|partiel>/<tranche de note>`, `consignation/reussie`, `consignation/piege-<clé>`, `panne/choisie-<n>`, `panne/<n>-<trouvee|erreur>`, `panne/indice`, `3d/plein-ecran/<page>`, `3d/pas-a-pas/<page>`.
- **Temps passé** : `temps/<page>/30s` et `temps/<page>/2min`, onglet visible uniquement.
- La page de présentation compte ses visites avec le script standard.

## Zoom sur téléphone

`html{touch-action:manipulation}` supprime le zoom au double toucher, sans bloquer le pincement à deux doigts (nécessaire pour l’accessibilité, et que Safari impose de toute façon). Sous 820 px de large, les champs de saisie sont en 16 px au moins, pour que l’iPhone ne zoome pas quand on les touche. Les schémas gardent leur propre zoom au pincement (`touch-action:none` sur les tableaux de dessin).

## Variateur

Composant `vari` (variateur) : il ferme le circuit comme un interrupteur dès que son réglage `st.lvl` dépasse 0 ; chaque action le fait passer à 25, 50, 75, 100 % puis l’éteint. Dans `solve()`, une lampe placée après un variateur (recherche sans les liens internes des variateurs) consomme `watt × réglage` (`res.dim`) ; `simulate()` recopie ce réglage dans `st.dim` de la lampe, qui règle son éclat en 2D (`sym`) et en 3D (`sync`). En 3D, le variateur reprend le modèle de l’interrupteur. Schéma `vari` (« Variateur ») dans les circuits de base, après le double allumage ; symbole dans les Bases et la palette du bac à sable.

## Arrêt d'urgence (espace n°3)

`S1` est un interrupteur marqué `au` : au repos son contact est fermé ; un appui (« coup de poing ») l’ouvre ; le déverrouillage le remet en place sans refermer le contact (`st.arme = false`) ; seul le réarmement volontaire referme le circuit et réalimente la bobine de KM1. Symbole : contact fermé au repos avec tête rouge, et mention « enfoncé » ou « à réarmer ».

## Navigation

Au-delà de 1 240 px de large, la barre du haut montre, à droite du logo, trois menus déroulants (`.nav-g` : « Apprendre », « S’entraîner », « Aller plus loin »), chacun avec un bouton `.nav-t` et un panneau `.nav-p` : ouverture au survol, au clic ou au clavier (Entrée), fermeture par Échap, clic ailleurs ou changement de page (`menusDeroulants()`). Le groupe de la page en cours prend la classe `actif` (pas `cur`, déjà utilisé par l’animation du courant, qui bloque les clics). En dessous de 1 240 px, le menu burger affiche les mêmes groupes en liste.

## Vue éclatée d'un circuit

Quand on choisit un circuit (bouton « Suivre un circuit » ou toucher d’un fil), le schéma 2D passe en vue éclatée (`Board.explode`) : seuls les appareils et les fils de ce circuit restent ; ils sont rangés en colonnes à partir du disjoncteur du circuit en suivant la phase (récepteurs dans la dernière colonne, appareils reliés seulement au neutre en bas), avec une transition animée, puis les fils sont retracés et nommés (phase, neutre, retour lampe, navette, commande), d’après `cablage(C)`. Le bandeau « Vue éclatée · circuit … » propose « Tout le schéma » pour revenir. Pendant l’animation, le tracé reste simple (`exAnim`) ; il est recalculé à l’arrivée. Les appareils restent actionnables. En 3D, le circuit choisi **sort du mur** (`View.floatOut`, appelée par `Board.opts.onExploded` à la fin de l’animation 2D avec la géométrie de `Board.exGeom()`) : un voile sombre couvre le mur et ses étiquettes, chaque appareil devient un bloc à son nom qui s’envole de sa place réelle jusqu’à sa position dans la rangée (même disposition que la vue éclatée 2D), puis les fils apparaissent en tubes droits, colorés et nommés (phase, neutre, terre, retour). Les lampes suivent l’état réel. Tout est retiré et la caméra revient à la vue d’ensemble quand on quitte. L’ancien éventail de fils sur le mur reste dans le code, désactivé (`this.fan`).

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

## Bouton test du différentiel

En 3D, toucher le bouton jaune d’un interrupteur différentiel (ID1, ID2) appelle `Circuit.testDiff` : s’il est armé et sous tension, il déclenche comme en vrai (fuite volontaire de plus de 30 mA) et un message l’explique ; s’il est déjà déclenché ou hors tension, rien ne se passe et le message dit pourquoi. `View.nearTest` ne retient le bouton que s’il est plus proche du doigt que le centre du module.
