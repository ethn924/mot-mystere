# Déroulement d'une partie

> **Pourquoi cette fiche :** suivre étape par étape ce qui se passe dans le code, de l'accueil à l'écran de fin, pour savoir quel fichier intervient à quel moment.

---

## 1. Vue d'ensemble du projet : Pourquoi cette structure ?

Le sujet impose une règle stricte : **la logique métier doit être séparée des composants d'affichage**, sinon on perd des points au barème.

Voici comment j'ai organisé mes dossiers dans `src/` :
- `logique/` : contient le pur JavaScript (calcul des scores, comparaison des lettres, requêtes API). Aucun JSX, aucun `useState`. Tout est testable et isolé.
- `components/` : les petits morceaux d'interface réutilisables (une case de lettre, une ligne, la grille de 6 essais, le clavier à l'écran).
- `pages/` : les écrans complets reliés à une URL (`Accueil.jsx` sur `/`, `Partie.jsx` sur `/partie`, `Scores.jsx` sur `/scores`, `Stats.jsx` sur `/stats`, `Regles.jsx` sur `/regles`).
- `data/` : la liste initiale des mots fournis dans le sujet (`mots-solutions.json`).
- `App.jsx` : configure le routeur (`BrowserRouter`, `Routes`, `Route`) pour naviguer d'un écran à l'autre.

---

## 2. Le circuit complet d'une partie (De l'accueil à la fin)

Voici étape par étape ce qui se passe sous le capot dans mon code :

### Étape 1 : Arrivée sur la page d'accueil (`Accueil.jsx`)
1. Le joueur arrive sur l'URL `/`.
2. Le composant lit le `localStorage.getItem("pseudo")` pour pré-remplir le champ texte s'il avait déjà joué.
3. Le joueur tape son pseudo et clique sur « Nouvelle partie ».
4. L'événement `onSubmit` se déclenche : il enregistre le pseudo dans le navigateur (`localStorage.setItem("pseudo", pseudo)`) et appelle `navigate("/partie")` via React Router.

### Étape 2 : Chargement de l'écran de jeu (`Partie.jsx`)
1. React monte le composant `Partie.jsx`.
2. Au premier rendu, il tire un mot secret aléatoire en appelant `tirerMotAleatoire(motsSolutions)` qui vient de `src/logique/jeu.js`. Le mot tiré (ex: `"arbre"` ou `"école"`) est stocké dans l'état `motMystere`.
3. Deux composants enfants sont affichés :
   - `<Grille />` : affiche les 6 lignes de 5 cases vides.
   - `<Clavier />` : affiche les touches AZERTY, qui sont grises/neutres pour l'instant.

### Étape 3 : Le joueur tape des lettres (Clavier physique ou virtuel)
1. Le joueur peut soit taper sur son clavier d'ordinateur (capté par l'écouteur `window.addEventListener("keydown")`), soit cliquer sur les boutons du `<Clavier />`.
2. Les deux appellent la même fonction centrale : `traiterTouche(touche)`.
3. Chaque lettre est normalisée en majuscule sans accent grâce à `normaliserMot(touche)` dans `src/logique/jeu.js` et ajoutée à la variable d'état `proposition`.
4. La prop `proposition` est passée à `<Grille />` qui la transmet à `<Ligne />` puis à chaque `<CaseLettre />` pour afficher la lettre en direct à l'écran.
5. Si le joueur appuie sur `Backspace` ou `⌫`, `slice(0, -1)` retire la dernière lettre.

### Étape 4 : Validation de la ligne (Appel à l'API Wiktionnaire)
Quand le joueur a 5 lettres et appuie sur `Entrée` :
1. **Verrouillage** : je passe `enChargement` à `true` et j'affiche « Vérification dans le dictionnaire... ». Les touches sont bloquées pour empêcher de valider deux fois.
2. **Appel réseau** : `Partie.jsx` appelle la fonction `verifierMotWiktionnaire(proposition)` située dans `src/logique/wiktionnaire.js`.
3. **Dans `wiktionnaire.js`** :
   - Je fais un `fetch` sur l'API MediaWiki : `https://fr.wiktionary.org/w/api.php?action=parse&page=...&prop=sections&format=json&origin=*`.
   - J'envoie l'en-tête obligatoire `Api-User-Agent`.
   - J'inspecte les sections retournées pour m'assurer qu'il existe bien une section `level: "2"` nommée `"Français"`.
   - Si le mot n'est pas trouvé directement (ex: joueur ayant tapé `ECOLE`), je fais une recherche avec `action=query&list=search&srsearch=ecole` pour trouver la page accentuée `école` et vérifier qu'elle est française.
   - Si l'API est en panne ou hors-ligne, j'attrape l'erreur et je laisse le mot valide pour ne pas bloquer le jeu.
4. **Retour du résultat à `Partie.jsx`** :
   - **Si le mot est invalide (refusé)** : j'active `ligneRefusee = true`, j'incrémente `compteurRefus` (ce qui relance l'animation CSS de tremblement sur la grille), et j'affiche « Ce mot n'est pas dans le dictionnaire. ». **La tentative n'est pas décomptée.**
   - **Si le mot est valide** : je continue vers le calcul des couleurs.

### Étape 5 : Calcul des couleurs et mise à jour de la grille
1. `Partie.jsx` appelle `comparer(motMystere, proposition)` dans `src/logique/jeu.js`.
2. L'algorithme en **deux passes** tourne :
   - 1ère passe : lettres bien placées -> marquées `"vert"`, lettres consommées barrées avec `null`.
   - 2ème passe : lettres restantes mal placées -> marquées `"jaune"`. Les autres restent `"gris"`.
3. `comparer()` renvoie un tableau de 5 couleurs (ex: `["vert", "jaune", "gris", "vert", "gris"]`).
4. J'ajoute `{ mot: proposition, couleurs: [...] }` dans la liste `lignes` via `setLignes()`.
5. `<CaseLettre />` reçoit sa couleur et applique la classe CSS avec un décalage d'animation (`animationDelay: index * 0.15s`) pour faire tourner les cases une à une.
6. Le composant `<Clavier />` reçoit le résultat calculé par `calculerStatutsLettres(lignes)` dans `jeu.js` et colore immédiatement ses touches en vert, jaune ou gris.
7. Je vide `proposition` pour passer à la ligne suivante.

### Étape 6 : Fin de partie et calcul des points
Après chaque ligne ajoutée :
1. `partieEstFinie(lignes)` vérifie si le joueur a gagné (5 verts) ou perdu (6 essais atteints).
2. Si la partie est finie :
   - `calculerPoints(lignes.length, gagne)` applique le tableau du PDF (600, 500, 400, 300, 200, 100 ou 0 point).
   - `Partie.jsx` appelle automatiquement `enregistrerPartie(pseudo, motMystere, lignes.length, points)` dans `src/logique/scores.js`.
   - Cette fonction ajoute la partie au tableau des scores dans le `localStorage`, trie par points décroissants, garde le Top 10 et met à jour les statistiques globales (taux de victoire, séries).
3. L'écran de fin s'affiche sous la grille avec :
   - Le message de victoire ou de défaite.
   - En cas de défaite, le mot secret dévoilé avec ses accents.
   - Un lien direct vers sa fiche Wiktionnaire (`https://fr.wiktionary.org/wiki/...`).
   - Le score obtenu.
   - Un bouton « Rejouer » (qui remet tout à zéro et tire un nouveau mot).
   - Des liens vers « Voir les scores » (`/scores`) et « Accueil » (`/`).

---

## 3. Qui fait quoi ? (Fiche par fichier)

### Dans `src/logique/`

1. **`jeu.js`** :
   - `LONGUEUR_MOT = 5` et `NOMBRE_ESSAIS = 6` : constantes de base du jeu.
   - `normaliserMot(mot)` : met tout en majuscules, retire les accents avec `normalize("NFD")` et remplace les ligatures `Œ` par `OE` et `Æ` par `AE`.
   - `tirerMotAleatoire(listeMots)` : prend un mot au hasard avec `Math.random()`.
   - `comparer(motMystere, proposition)` : compare la proposition au mot secret en deux passes pour les doublons.
   - `estGagne(couleurs)` : vérifie si toutes les cases sont vertes.
   - `estPerdu(nombreLignes, gagne)` : vérifie si 6 essais ont été joués sans victoire.
   - `partieEstFinie(lignes)` : regroupe victoire ou défaite.
   - `calculerPoints(nombreEssais, gagne)` : barème officiel de 600 à 0 points.
   - `calculerStatutsLettres(lignes)` : donne au clavier la meilleure couleur connue pour chaque lettre (vert > jaune > gris).

2. **`wiktionnaire.js`** :
   - C'est **ce fichier** et lui seul qui contacte l'API Wiktionnaire.
   - Contient `verifierMotWiktionnaire(proposition)`.
   - Utilise `origin=*` et `Api-User-Agent`.
   - Vérifie la section `"Français"`.
   - Fait la recherche pour les mots avec accents tapés sans accent.

3. **`scores.js`** :
   - Gère le stockage dans le `localStorage`.
   - `enregistrerPartie()` : stocke la partie, trie le Top 10 et met à jour les stats.
   - `lireScores()` : renvoie le Top 10.
   - `lireStats()` : renvoie les compteurs (victoires, séries, répartition).

### Dans `src/components/`

1. **`CaseLettre.jsx`** : case carrée affichant une lettre, avec classe de couleur et animation de rotation.
2. **`Ligne.jsx`** : assemble 5 `CaseLettre`. Gère la classe de secousse `ligne-refusee`.
3. **`Grille.jsx`** : assemble les 6 lignes fixes (validées, en cours, vides).
4. **`Clavier.jsx`** : clavier AZERTY virtuel réactif, cliquable et coloré selon les lettres trouvées.

### Dans `src/pages/`

1. **`Accueil.jsx`** (`/`) : présentation, saisie du pseudo mémorisé, lien vers règles/scores/stats.
2. **`Partie.jsx`** (`/partie`) : chef d'orchestre de la partie (clavier, appel à `wiktionnaire.js`, grille, écran de fin).
3. **`Scores.jsx`** (`/scores`) : tableau des 10 meilleurs scores.
4. **`Stats.jsx`** (`/stats`) : graphiques/tableau de statistiques du joueur.
5. **`Regles.jsx`** (`/regles`) : règles du jeu avec exemples visuels des 3 couleurs.

---

## 4. Réponses aux questions pièges en soutenance

- **Quel fichier appelle l'API Wiktionnaire ?**  
  *Réponse* : C'est `src/logique/wiktionnaire.js` via sa fonction `verifierMotWiktionnaire()`. `Partie.jsx` ne fait que l'appeler au moment de la touche Entrée. L'affichage ne contient aucune URL ni aucun code réseau direct.
- **Pourquoi `origin=*` dans les requêtes Wiktionnaire ?**  
  *Réponse* : Pour autoriser les requêtes cross-origin (CORS) depuis le navigateur, sinon la réponse est bloquée par la sécurité du navigateur.
- **Comment gérez-vous un mot avec accents tapé sans accent (ex: ECOLE) ?**  
  *Réponse* : Si la page directe `ecole` n'est pas un mot français, j'utilise l'API de recherche `action=query&list=search` qui me renvoie `école`. Je vérifie que cette page a une section française de niveau 2, et je valide le mot.
- **Pourquoi deux passes dans `comparer()` ?**  
  *Réponse* : Pour les lettres en double (ex: ARBRE et ERRER). La première passe marque tous les verts et neutralise les lettres correspondantes. La deuxième passe s'occupe des jaunes avec seulement les lettres restantes du mot mystère.
