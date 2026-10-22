# Le Mot Mystère

Jeu de lettres en React, projet de cours en binôme.

Palier visé : **palier 2 (le dictionnaire)**.

## Binôme

Ethan (ethn924) et Marcel.

## État des paliers

| Palier | État |
| --- | --- |
| Palier 1 : le jeu | Fait |
| Palier 2 : le dictionnaire | Fait |
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

## Palier 2, ce qui marche

- Vérification de chaque proposition auprès de l'API du Wiktionnaire (`https://fr.wiktionary.org/w/api.php`).
- Seuls les vrais mots français sont acceptés (on vérifie la présence d'une section Français sur la page).
- Gestion des accents : un mot tapé sans accent (ex: ECOLE) est retrouvé via l'action de recherche et validé s'il correspond à un mot français accentué (ex: école).
- Si le mot est refusé, il ne compte pas comme un essai, la ligne rougit visuellement et un message l'indique au joueur.
- Pendant l'appel API, un indicateur de chargement bloque toute double validation.
- Comportement en cas de panne API : si le Wiktionnaire ne répond pas ou qu'on est hors-ligne, on affiche un message d'information mais on accepte le mot pour ne pas bloquer la partie du joueur.
- À la fin de la partie, le mot mystère s'affiche avec ses accents et contient un lien vers sa définition sur le Wiktionnaire.

La comparaison et les points sont dans `src/logique/jeu.js`, les appels réseau au dictionnaire sont isolés dans `src/logique/wiktionnaire.js`. Les composants ne s'occupent que de l'affichage.

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
├── logique/      jeu.js, wiktionnaire.js
├── pages/        Accueil, Partie
├── App.jsx       routes
└── main.jsx
```

## Difficultés

On a galéré un moment avec les lettres en double. Exemple : mot ARBRE, proposition ERRER. Si on colore trop vite, on met trop de jaunes alors qu’il n’y a que deux R et un E. On a fini par faire deux passages : d’abord les verts, ensuite les jaunes avec un tableau `disponibles` où on barre les lettres déjà utilisées.

Pour l'API Wiktionnaire, il fallait obligatoirement `origin=*` sinon le navigateur bloquait la requête avec une erreur CORS. On a aussi dû faire attention aux mots tapés sans accents au clavier : si le joueur tape ECOLE, la page `ecole` n'existe pas directement telle quelle en français, il faut chercher via `list=search` pour trouver la page `école`. On vérifie ensuite que la page a bien une section de niveau 2 en langue française pour ne pas valider des mots d'autres langues.

Autre piège : l’écouteur clavier. Si on oublie `proposition` dans les dépendances du `useEffect`, Entrée valide encore l’ancienne ligne. C’est pour ça que les dépendances sont `[proposition, motMystere, finie, enChargement]`.
