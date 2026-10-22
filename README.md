# Le Mot Mystère

Un jeu de lettres en React réalisé pour un projet de cours. Le joueur doit
deviner un mot français en six essais.

Le palier visé est le **palier 1 : le jeu**. Le travail est réalisé seul, avec
l'accord du professeur.

## Palier 1 : ce qui est fait, ce qui reste

| Attendu du sujet | État |
| --- | --- |
| Page d'accueil (nom, explication, pseudo, bouton) | à faire |
| Pseudo mémorisé pour les visites suivantes | à faire |
| Partie à une adresse distincte de l'accueil | fait |
| Grille de 6 lignes de 5 cases | fait |
| Le mot mystère est tiré au hasard dans la liste fournie | à faire |
| Les lettres se tapent au clavier | fait |
| Retour arrière efface la dernière lettre | fait |
| Entrée valide une ligne complète | à faire |
| Chaque lettre prend la bonne couleur après validation | à faire |
| Victoire et défaite détectées, mot révélé en cas de défaite | à faire |
| Points affichés, nouvelle partie ou retour à l'accueil | à faire |
| Logique du jeu dans des fonctions séparées de l'affichage | à faire |

## La suite

Ce qu'il me reste à faire pour valider le palier 1, dans l'ordre où je
voulais le faire.

**1. Tirer le mot et valider avec Entrée**

- Dans `src/logique/jeu.js`, une fonction qui tire un mot au hasard dans
  `src/data/mots-solutions.json` (import du JSON, `Math.random()`, index du
  tableau).
- Dans `Partie.jsx`, deux choses en mémoire : `proposition` (ce que je tape en
  ce moment) et `lignes` (les mots déjà validés, dans l'ordre). Pour ajouter
  un mot à la liste : `[...liste, mot]`.
- La touche Entrée se reconnaît par son nom, `event.key === "Enter"`. Elle
  valide la proposition si elle fait cinq lettres, la ligne passe à la
  suite et la proposition repart vide.
- `Grille.jsx` affiche la première ligne validée en ligne 1, la suivante en
  ligne 2, etc. La proposition en cours reste à leur place.

**2. La comparaison, dans `jeu.js`**

- Une fonction `comparer(mot, proposition)` qui rend la couleur de chaque
  lettre de la proposition : `vert` si la lettre est à la bonne place,
  `jaune` si elle est dans le mot mais pas à la bonne place, `gris` sinon.
- Comme elle ne dépend de rien, je peux l'appeler seule dans la console pour
  vérifier un résultat, sans passer par l'interface.
- Les lettres en double : d'abord je marque les lettres bien placées, puis
  j'attribue les jaunes en tenant compte de ce qui reste dans le mot.

**3. Les couleurs à l'écran**

- `CaseLettre.jsx` reçoit la couleur en plus de la lettre, et l'applique
  avec une classe CSS.
- Les couleurs se posent au moment de la validation, pas pendant la frappe :
  une ligne validée ne doit plus changer.

**4. Victoire, défaite, points**

- La partie finit quand le mot est trouvé, ou quand les six essais sont
  passés (à ce moment-là le mot est révélé).
- Les points suivent le barème du sujet : 600 au premier essai, 500 au
  deuxième, et ainsi de suite jusqu'à 100 au sixième, 0 en cas de défaite.
- Un bouton pour rejouer ou revenir à l'accueil.

**5. La page d'accueil**

- Nom du jeu, une phrase d'explication, un champ pour le pseudo, un bouton
  pour lancer la partie.
- Le pseudo est rangé dans `localStorage` pour le retrouver à la prochaine
  visite. Il faut `JSON.stringify` et `JSON.parse`.

## Organisation du code

```text
src/
├── components/       # Éléments réutilisables de l'interface
│   ├── CaseLettre.jsx
│   ├── Grille.jsx
│   └── Ligne.jsx
├── data/             # Données fournies pour le jeu
│   └── mots-solutions.json
├── logique/          # Règles et constantes du jeu
│   └── jeu.js
├── pages/            # Écrans accessibles par une adresse
│   ├── Accueil.jsx
│   └── Partie.jsx
├── App.jsx           # Routes de l'application
├── index.css         # Styles de base
└── main.jsx          # Point d'entrée React
```

## Le circuit des composants

**Partie → Grille → Ligne → CaseLettre**

- `Partie` affiche `Grille` et garde la proposition en cours.
- `Grille` fabrique les 6 lignes (une par essai) et transmet à chacune le
  mot qu'elle doit afficher.
- Chaque `Ligne` fabrique les 5 cases (une par lettre).
- Chaque `CaseLettre` affiche la lettre qu'elle reçoit.

Les données descendent de parent à enfant avec les **props** :
`Grille` → `Ligne` → `CaseLettre`. À retenir : **la grille répète les lignes,
la ligne répète les cases, la case affiche**.

## La saisie au clavier

La proposition est un état de `Partie` :

```jsx
const [proposition, setProposition] = useState("");
```

Deux notions sont utilisées pour la faire changer au clavier.

**`useEffect`** sert à faire une action en dehors de l'affichage. Ici, on
demande au navigateur d'appeler `surTouche` à chaque pression de touche :

```jsx
window.addEventListener("keydown", surTouche);
```

et, quand on quitte l'écran, on retire l'écouteur. C'est la fonction de
nettoyage renvoyée par l'effet :

```jsx
return () => {
  window.removeEventListener("keydown", surTouche);
};
```

**La forme « fonction » de `setProposition`.** L'effet ne se rejoue pas à
chaque frappe, donc la variable `proposition` vue dans `surTouche` est
périmée : elle vaut toujours la valeur initiale. En donnant une fonction à
`setProposition`, React lui passe la proposition du moment de la frappe :

```jsx
setProposition((valeurActuelle) => {
  if (valeurActuelle.length < LONGUEUR_MOT) {
    return valeurActuelle + touche;
  }
  return valeurActuelle;
});
```

C'est la seule forme qui lit la valeur à jour.

## Ce qui m'a posé problème

- **L'état figé dans l'écouteur.** En écrivant
  `setProposition(proposition + touche)`, une seule lettre s'affichait à
  l'écran : `proposition` valait encore la chaîne vide. La forme « fonction »
  de `setProposition` a réglé le problème.
- **La syntaxe de l'effet.** `useEffect(() => { ... }, [])` : la fonction à
  exécuter, puis le tableau des dépendances, puis les accolades et
  parenthèses qui ferment chaque morceau.
- **Deux écritures pour la même donnée.** Le champ de saisie et le clavier
  modifiaient tous deux `proposition`. Le champ est passé en lecture seule
  (`readOnly`) : il affiche la proposition, c'est le clavier qui écrit.
- **La touche Retour arrière.** `slice(0, -1)` retire la dernière lettre,
  alors que `slice(0, 1)` ne garde que la première. En lisant `proposition`
  directement au lieu de la forme fonction, la proposition était vidée à
  chaque appui.

## Outils du projet

- React et Vite
- React Router
- JavaScript
- ESLint
- Git et GitHub

Aucune bibliothèque supplémentaire n'a été ajoutée pour l'instant. Les
constantes du jeu (`NOMBRE_ESSAIS`, `LONGUEUR_MOT`) sont dans
`src/logique/jeu.js`.

## Lancer l'application

Depuis le dossier du projet :

```sh
npm install
npm run dev
```

Vite affiche ensuite l'adresse locale à ouvrir dans un navigateur.

## Vérifications disponibles

```sh
npm run lint
npm run build
```

Le sujet complet est dans `../Le_Mot_Mystere_sujet.pdf`.
