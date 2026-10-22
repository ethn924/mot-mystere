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
| Partie à une adresse distincte de l'accueil | à faire |
| Grille de 6 lignes de 5 cases | à faire |
| Le mot mystère est tiré au hasard dans la liste fournie | à faire |
| Les lettres se tapent au clavier | à faire |
| Retour arrière efface la dernière lettre | à faire |
| Entrée valide une ligne complète | à faire |
| Chaque lettre prend la bonne couleur après validation | à faire |
| Victoire et défaite détectées, mot révélé en cas de défaite | à faire |
| Points affichés, nouvelle partie ou retour à l'accueil | à faire |
| Logique du jeu dans des fonctions séparées de l'affichage | à faire |

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

## Outils du projet

- React et Vite
- JavaScript
- ESLint
- Git et GitHub

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
