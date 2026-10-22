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

Ce qu'il me reste à faire pour valider le palier 1 :

1. Tirer le mot mystère au hasard et le valider avec la touche Entrée.
2. Comparer la proposition avec le mot mystère et afficher les couleurs.
3. Poser les couleurs à l'écran au moment de la validation.
4. Détecter la victoire et la défaite, révéler le mot, compter les points.
5. Créer la page d'accueil avec le pseudo mémorisé.

Je ferai ces étapes dans cet ordre, une à une.

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

**`useEffect`** sert à faire une action en dehors de l'affichage. Ici, on
demande au navigateur d'appeler `surTouche` à chaque pression de touche :

```jsx
window.addEventListener("keydown", surTouche);
```

et, quand on quitte l'écran, on retire l'écouteur.

**La forme « fonction » de `setProposition`.** En donnant une fonction à
`setProposition`, React lui passe la proposition du moment de la frappe :

```jsx
setProposition((valeurActuelle) => {
  if (valeurActuelle.length < LONGUEUR_MOT) {
    return valeurActuelle + touche;
  }
  return valeurActuelle;
});
```

## Ce qui m'a posé problème

- **L'état figé dans l'écouteur.** En écrivant
  `setProposition(proposition + touche)`, une seule lettre s'affichait à
  l'écran : `proposition` valait encore la chaîne vide. La forme « fonction »
  de `setProposition` a réglé le problème.
- **La syntaxe de l'effet.** `useEffect(() => { ... }, [])` : la fonction à
  exécuter, puis le tableau des dépendances.
- **Deux écritures pour la même donnée.** Le champ de saisie et le clavier
  modifiaient tous deux `proposition`. Le champ est passé en lecture seule
  (`readOnly`) : il affiche la proposition, c'est le clavier qui écrit.
- **La touche Retour arrière.** `slice(0, -1)` retire la dernière lettre.

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
