# Le Mot Mystère

Jeu de lettres en React, projet de cours.

Palier visé : **palier 4 (le mot du jour)**.

## Auteur

Ethan ([@ethn924](https://github.com/ethn924)). Projet réalisé seul, sans binôme, avec l'accord du professeur : tous les commits sont donc les miens.

## État des paliers

| Palier | État |
| --- | --- |
| Palier 1 : le jeu | Fait |
| Palier 2 : le dictionnaire | Fait |
| Palier 3 : le confort de jeu | Fait |
| Palier 4 : le mot du jour | En cours (sans tests ni mise en ligne encore) |
| Palier 5 : les variantes | Pas commencé |
| Palier 6 : les quatre grilles | Pas commencé |

## Palier 1, ce qui marche

- Accueil avec le nom du jeu, une phrase d’explication, un champ pseudo et un bouton Jouer.
- Le pseudo est rangé dans `localStorage`, il revient au prochain passage.
- La partie est sur `/partie`, l’accueil sur `/`.
- Grille 6 lignes × 5 cases.
- Mot mystère tiré au hasard dans `src/data/mots-solutions.json` (environ 300 mots).
- Saisie au clavier, Retour arrière, Entrée pour valider une ligne complète.
- Couleurs vert / jaune / gris, y compris quand une lettre est en double.
- Victoire et défaite. En cas de défaite le mot s’affiche.
- Points : 600 / 500 / 400 / 300 / 200 / 100 / 0.
- Boutons Rejouer et Accueil à la fin.

## Palier 2, ce qui marche

- Vérification de chaque proposition auprès de l'API du Wiktionnaire (`https://fr.wiktionary.org/w/api.php`).
- Seuls les vrais mots français sont acceptés (je vérifie la présence d'une section Français sur la page).
- Gestion des accents : un mot tapé sans accent (ex: ECOLE) est retrouvé via l'action de recherche et validé s'il correspond à un mot français accentué (ex: école).
- Si le mot est refusé, il ne compte pas comme un essai, la ligne rougit visuellement et un message l'indique au joueur.
- Pendant l'appel API, un indicateur de chargement bloque toute double validation.
- Comportement en cas de panne API : si le Wiktionnaire ne répond pas ou que la connexion est coupée, un message d'information s'affiche mais le mot est accepté pour ne pas bloquer la partie.
- À la fin de la partie, le mot mystère s'affiche avec ses accents et un lien vers sa page du Wiktionnaire.

## Palier 3, ce qui marche

- Clavier virtuel complet à l'écran, cliquable à la souris ou au tactile sur mobile, synchronisé avec les couleurs révélées sur la grille (vert, jaune, gris).
- Animations CSS : retournement progressif des cases révélées (avec décalage par case) et tremblement de la ligne en cas de mot refusé.
- Tableau des scores : enregistre et classe les dix meilleures parties (pseudo, mot, nombre d'essais, points, date), conservées dans `localStorage`.
- Écran des statistiques : parties jouées, taux de victoires, série en cours, meilleure série, total des points et répartition des victoires par nombre d'essais.
- Écran des règles : explications détaillées et exemple illustré des trois couleurs.
- Navigation React Router dédiée : chaque écran a sa propre adresse distincte (`/`, `/partie`, `/scores`, `/stats`, `/regles`).
- Bouton Retour à l'accueil disponible depuis la page de partie pour quitter une partie en cours.

## Palier 4, ce qui marche

- Mot du jour : le même mot pour tous les joueurs, choisi selon la date (change à minuit)
- Choix entre "Partie libre" (mot aléatoire) et "Mot du jour" au lancement de la partie
- Compte à rebours indiquant le temps restant avant le prochain mot
- Une partie du jour commencée reprend où elle en était si la page est rechargée
- Une fois la partie du jour terminée, elle ne peut pas être rejouée le même jour
- Partage du résultat dans le presse-papiers (texte avec couleurs emoji, sans révéler les lettres)
- Tableau des scores en deux classements : Mot du Jour (tri par points puis temps) et Général (tri par points puis essais)

Ce qui est prévu pour plus tard (non encore fait) :
- Les tests automatisés (Vitest, Testing Library)
- Le déploiement sur Vercel

## Lancer le projet

```sh
npm install
npm run dev
```

Vite affiche une adresse locale (souvent `http://localhost:5173`).

```sh
npm run lint
npm test
npm run build
```

Uniquement React, React Router et Vite en dépendances de production. Les outils de test (Vitest, Testing Library, jsdom) ont été installés pour anticiper les tests automatisés demandés au palier 4, mais ils ne sont pas encore utilisés.

## Design et interface

Pour le style visuel, j'ai conçu un thème sombre moderne et épuré (ardoise / nuit) :
- Interface centrée sous forme de carte sombre avec léger dégradé radial et ombres douces.
- Clavier virtuel ergonomique avec sensation tactile mécanique et touches contrastées.
- Cases de jeu avec micro-animation d'apparition « pop » à la frappe et retournement 3D à la validation.
- Palette de couleurs soignée (vert émeraude, jaune ambré, gris ardoise) garantissant un confort visuel optimal sans éblouir.

## Documentation

Le dossier `docs/` contient mes fiches, chacune commence par la raison de son existence :

| Fiche | Contenu |
| --- | --- |
| [1-structure-du-projet.md](docs/1-structure-du-projet.md) | Organisation des dossiers et rôle de chaque fonction |
| [2-deroulement-d-une-partie.md](docs/2-deroulement-d-une-partie.md) | Ce qui se passe dans le code, de l'accueil à la fin de partie |
| [3-difficultes-techniques.md](docs/3-difficultes-techniques.md) | Les problèmes rencontrés et leurs solutions |
## Organisation

```text
docs/            fiches de documentation (voir ci-dessus)
src/
├── components/   Grille, Ligne, CaseLettre, Clavier
├── data/         mots-solutions.json
├── logique/      jeu.js, wiktionnaire.js, scores.js
├── pages/        Accueil, Partie, Scores, Stats, Regles
├── App.jsx       routes
└── main.jsx
```

## Difficultés rencontrées et solutions

Le détail est dans [docs/3-difficultes-techniques.md](docs/3-difficultes-techniques.md).

1. **Lettres en double dans `comparer()`** : deux boucles, d'abord les verts, puis les jaunes avec les lettres restantes.
2. **Écouteur `keydown` et état périmé** : bonnes dépendances du `useEffect` et `removeEventListener` au nettoyage.
3. **Wiktionnaire et accents** : `origin=*` pour le CORS et une recherche `list=search` pour retrouver les mots accentués.
4. **Animation de tremblement** : un compteur de refus dans la `key` de la ligne pour la relancer.
5. **Couleurs du clavier** : priorité vert > jaune > gris dans `calculerStatutsLettres()`.

## Fait après l'oral (23/10/2026, 14h30)

Tout ce qui est au-dessus a été présenté à l'oral. Ce qui suit a été fait après.

- Fin du palier 4 :
  - 8 tests automatiques avec Vitest (dont 2 sur les lettres en double), à lancer avec `npm test`.
  - Fichier `vercel.json` pour le déploiement.
  - Site en ligne sur Vercel : [mot-mystere-theta.vercel.app](https://mot-mystere-theta.vercel.app) (toutes les pages marchent, même en rafraîchissant).
- Vérification Wiktionnaire simplifiée : 1 seul appel, qui vérifie que le mot est français.
- Code simplifié et commentaires plus clairs.
- Doc mise à jour.
