# Le Mot Mystère

Jeu de lettres en React, projet de cours en binôme.

Palier visé : **palier 1 (le jeu)**.

## Binôme

Ethan (ethn924) et Marcel.

## État des paliers

| Palier | État |
| --- | --- |
| Palier 1 : le jeu | Fait |
| Palier 2 : le dictionnaire | Pas commencé |
| Palier 3 : le confort de jeu | Pas commencé |
| Palier 4 : le mot du jour | Pas commencé |
| Palier 5 : les variantes | Pas commencé |
| Palier 6 : les quatre grilles | Pas commencé |

## Palier 1, ce qui marche

- Accueil avec le nom du jeu, une phrase d’explication, un champ pseudo et un bouton Jouer.
- Le pseudo est rangé dans `localStorage`, il revient au prochain passage.
- La partie est sur `/partie`, l’accueil sur `/`.
- Grille 6 lignes × 5 cases.
- Mot mystère tiré au hasard dans `src/data/mots-solutions.json` (300 mots).
- Saisie au clavier, Retour arrière, Entrée pour valider une ligne complète.
- Couleurs vert / jaune / gris, y compris quand une lettre est en double.
- Victoire et défaite. En cas de défaite le mot s’affiche.
- Points : 600 / 500 / 400 / 300 / 200 / 100 / 0.
- Boutons Rejouer et Accueil à la fin.

La comparaison, les points et l’état de la partie sont dans `src/logique/jeu.js`. Les composants ne font que l’affichage et la saisie.

## Lancer le projet

```sh
npm install
npm run dev
```

Vite affiche une adresse locale (souvent `http://localhost:5173`).

```sh
npm run lint
npm run build
```

Aucune bibliothèque en plus de React, React Router et Vite.

## Organisation

```text
src/
├── components/   Grille, Ligne, CaseLettre
├── data/         mots-solutions.json
├── logique/      jeu.js
├── pages/        Accueil, Partie
├── App.jsx       routes
└── main.jsx
```

## Difficultés

On a galéré un moment avec les lettres en double. Exemple : mot ARBRE, proposition ERRER. Si on colore trop vite, on met trop de jaunes alors qu’il n’y a que deux R et un E. On a fini par faire deux passages : d’abord les verts, ensuite les jaunes avec un tableau `disponibles` où on barre les lettres déjà utilisées.

Autre piège : l’écouteur clavier. Si on oublie `proposition` dans les dépendances du `useEffect`, Entrée valide encore l’ancienne ligne. C’est pour ça que les dépendances sont `[proposition, motMystere, finie]`.

On avait aussi une petite liste de mots cassée (certains n’avaient pas 5 lettres). On l’a remplacée par le JSON fourni, 300 mots.

Les accents : on compare toujours en majuscules sans accents (`normalize("NFD")`), comme demandé dans le sujet.
