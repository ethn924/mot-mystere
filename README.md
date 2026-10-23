# Le Mot Mystère

Jeu de lettres en React, projet de cours.

Palier visé : **palier 4 (le mot du jour)**.

## Auteur

Ethan (ethn924) — projet réalisé individuellement avec l'accord du professeur.

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
- Mot mystère tiré au hasard dans `src/data/mots-solutions.json` (300 mots).
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
npm run build
```

Uniquement React, React Router et Vite en dépendances de production. Les outils de test (Vitest, Testing Library, jsdom) ont été ajoutés et configurés pour anticiper les tests automatisés demandés au palier 4, mais ils ne sont pas encore utilisés.

## Design et interface

Pour le style visuel, j'ai conçu un thème sombre moderne et épuré (ardoise / nuit) :
- Interface centrée sous forme de carte sombre avec léger dégradé radial et ombres douces.
- Clavier virtuel ergonomique avec sensation tactile mécanique et touches contrastées.
- Cases de jeu avec micro-animation d'apparition « pop » à la frappe et retournement 3D à la validation.
- Palette de couleurs soignée (vert émeraude, jaune ambré, gris ardoise) garantissant un confort visuel optimal sans éblouir.

## Organisation

```text
src/
├── components/   Grille, Ligne, CaseLettre, Clavier
├── data/         mots-solutions.json
├── logique/      jeu.js, wiktionnaire.js, scores.js
├── pages/        Accueil, Partie, Scores, Stats, Regles
├── App.jsx       routes
└── main.jsx
```

## Difficultés rencontrées et solutions

Franchement, j'ai passé pas mal de temps sur plusieurs points du sujet où je me suis pris la tête avant de trouver la bonne approche. J'ai consigné les galères les plus techniques dans le fichier `LIRE_AVANT_MODIF_LOGIQUE.md` à la racine, avec ce qui m'a vraiment semblé complexe et comment je m'en suis sorti.

1. **Le piège des lettres en double dans `comparer()`** :  
   Au début, je voulais faire une seule boucle simple pour colorer les lettres au fur et à mesure. Grosse erreur : sur un mot comme ARBRE avec une proposition ERRER, ça me mettait trois R jaunes alors qu'il n'y en a que deux dans le mot. J'ai dû tout poser sur papier et séparer en 2 boucles : d'abord tous les verts (et je marque les lettres consommées à `null`), et ensuite seulement les jaunes avec ce qui reste de disponible.

2. **L'écouteur d'événement `keydown` et l'état périmé** :  
   Un vrai casse-tête au début : quand j'appuyais sur Entrée, le composant validait une chaîne vide ou l'ancienne lettre tapée. J'ai compris que la fonction dans `addEventListener` gardait la référence de la première valeur du state. J'ai dû faire attention aux dépendances du `useEffect` et m'assurer de bien nettoyer avec `removeEventListener` pour ne pas empiler 15 écouteurs à chaque touche.

3. **Les requêtes Wiktionnaire et les mots sans accents** :  
   Deux galères ici. D'abord l'erreur CORS : l'API refusait de répondre dans le navigateur tant que je n'avais pas ajouté `origin=*` dans l'URL. Ensuite, je tape toujours sans accent au clavier (ex: `ECOLE`), mais la page brute sur le Wiktionnaire est titrée `école`. La requête directe échouait pour rien. J'ai résolu ça en utilisant `list=search` pour récupérer les titres approchants, puis en vérifiant que le mot normalisé correspondait bien et qu'il possédait une section de langue française (`level: "2"`).

4. **Rejouer l'animation de tremblement CSS** :  
   Quand un mot était refusé une première fois, la classe CSS `.ligne-refusee` se mettait bien et la ligne tremblait. Mais si je réessayais un deuxième mot faux tout de suite après, la classe était déjà là, donc le navigateur ne rejouait pas l'animation. J'ai suivi l'indice du sujet en mettant un simple compteur de refus dans la prop `key` de la ligne active : changer la clé force React à remonter la ligne, ce qui relance l'animation à chaque refus.

5. **La synchronisation des couleurs du clavier virtuel** :  
   Au début, je mettais à jour la couleur d'une touche dès qu'une lettre était jouée. Mais si une lettre était jaune au tour 1 puis devenait verte au tour 2, il ne fallait surtout pas qu'elle repasse au jaune ou au gris au tour 3. J'ai réglé ça dans `calculerStatutsLettres()` avec une règle de priorité stricte : le vert écrase tout et ne peut plus jamais être rétrogradé, le jaune ne s'applique que si la lettre n'est pas déjà verte, et le gris seulement si la lettre n'a jamais été jaune ni verte.
