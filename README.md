# Valelec

Site pédagogique pour apprendre l’électricité domestique : leçons, schémas animés, bac à sable de schémas et comparaison des tableaux électriques français et américain.

- Code source : https://github.com/Valar207/Valelec
- Version en ligne (adresse fixe, GitHub Pages, mise à jour à chaque push) : https://valar207.github.io/Valelec/site/
- Version de test (hébergée sur le NAS via un tunnel Cloudflare) : https://satisfactory-quarter-determination-david.trycloudflare.com — cette adresse change à chaque redémarrage du tunnel.
- Ancienne version (privée, claude.ai) : https://claude.ai/artifact/S6ikzc59nVyA9KQGuzFv2d

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
| `<style>` en tête | Jetons de couleurs (thèmes clair et sombre), styles des pages et des symboles |
| `<!-- ============ ACCUEIL / LES BASES / SCHÉMAS / BAC À SABLE / TABLEAUX … ============ -->` | HTML de chaque page (une seule page HTML, routage par `#ancre`) |
| `/* Symboles et règles */` | `DEF` : les 19 composants (bornes, dimensions, description), `defSt`, `links` (contacts internes), `loadPair` (récepteurs) |
| `solve()` / `simulate()` | Moteur électrique : réseaux équipotentiels (union-find), récepteurs alimentés, fils parcourus par le courant et sens, court-circuit et déclenchement des protections, bobines (télérupteur, contacteur, minuterie, micromodule Yokis) |
| `/* Son de carillon */` | Synthèse Web Audio du « ding / dong » de la sonnette |
| `/* Circuit */` | Classe `Circuit` : modèle, historique (annuler), actions sur les interrupteurs |
| `/* Rendu SVG d’un circuit */` | Classe `Board` : dessin SVG, glisser-déposer, fils, rotation, copier-coller, déplacement et zoom tactile |
| `/* Schémas prédéfinis */` | `PRESETS` : les 10 circuits de la page Schémas (aussi exemples du bac à sable) |
| `/* Bac à sable */` | Palette, barre d’outils, panneau de propriétés, diagnostic, raccourcis clavier |
| `/* Tableaux France / États-Unis */` | Les deux tableaux comparés : données, logique de déclenchement, dessin, messages |
| `/* Navigation */` | Routage par ancre : `#accueil`, `#bases`, `#schemas`, `#bac-a-sable`, `#tableaux` |

## Ajouter un composant

1. Ajouter une entrée dans `DEF` (dimensions multiples de 40, bornes à des multiples de 20 du centre pour tomber sur la grille).
2. Si besoin : état par défaut dans `defSt`, contacts dans `links`, récepteur dans `loadPair`, puissance dans `WATT`.
3. Dessin dans `sym()` (repère local 0..w, 0..h).
4. L’ajouter à un groupe de la palette (`groups` dans la partie Bac à sable).

## Données enregistrées dans le navigateur

`localStorage` : `pn-bac-a-sable` (schéma du bac à sable), `pn-clip` (composant copié), `pn-son` (son activé ou non).

## Hébergement actuel

Le site est servi depuis le NAS par la stack Docker `/volume1/docker/valelec/` :

- `valelec-web` : nginx (non root) qui sert le dossier `site/` en lecture seule ;
- `valelec-tunnel` : tunnel rapide Cloudflare (sans compte), qui donne une adresse `*.trycloudflare.com` aléatoire.

Retrouver l'adresse actuelle : `docker logs valelec-tunnel 2>&1 | grep trycloudflare.com`.
Toute modification de `site/index.html` est en ligne immédiatement.

## Avertissement

Schémas simplifiés à but pédagogique. Références : NF C 15-100 (France), National Electrical Code (États-Unis).
