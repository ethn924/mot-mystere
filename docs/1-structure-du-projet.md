# Structuration du projet

> **Pourquoi cette fiche :** le sujet retire des points si le code est mal organisé (logique mêlée à l'affichage, appels à l'API dispersés, composants géants). Cette fiche montre le découpage choisi et dit où se trouve chaque fonction, pour pouvoir expliquer n'importe quelle partie du code.

## Organisation des dossiers

```text
src/
├── logique/      JavaScript pur : règles, API, stockage (aucun React)
├── components/   petits morceaux d'affichage réutilisables
├── pages/        un écran par adresse (React Router)
├── data/         mots-solutions.json (environ 300 mots mystères)
├── App.jsx       les routes
└── main.jsx      démarrage de l'application
```

## src/logique/jeu.js : les règles du jeu

| Fonction | Rôle |
| --- | --- |
| `NOMBRE_ESSAIS`, `LONGUEUR_MOT` | Constantes : 6 essais, 5 lettres |
| `normaliserMot()` | Majuscules sans accents (école -> ECOLE, cœur -> COEUR) |
| `tirerMotAleatoire()` | Mot au hasard pour la partie libre |
| `comparer()` | Couleur de chaque lettre (vert / jaune / gris), gère les lettres en double |
| `estGagne()` | Les 5 lettres sont vertes ? |
| `estPerdu()` | 6 essais joués sans gagner ? |
| `partieEstFinie()` | Gagné ou perdu ? |
| `calculerPoints()` | Barème 600 / 500 / 400 / 300 / 200 / 100 / 0 |
| `calculerStatutsLettres()` | Couleur des touches du clavier à l'écran (vert > jaune > gris) |
| `dateDeParis()` | Date du jour à Paris (fuseau Europe/Paris) |
| `nombreDeJoursDepuisReference()` | Jours écoulés depuis le 1er janvier 2024 |
| `choisirMotDuJour()` | Mot du jour, le même pour tous, change à minuit heure de Paris |
| `tempsRestantAvantMinuit()` | Compte à rebours jusqu'à minuit à Paris |

## src/logique/wiktionnaire.js : le seul fichier qui appelle Internet

| Fonction | Rôle |
| --- | --- |
| `verifierMotWiktionnaire()` | Dit si le mot tapé existe en français (retrouve aussi la version avec accents) |

## src/logique/scores.js : ce qui est enregistré dans le navigateur

| Fonction | Rôle |
| --- | --- |
| `lireScores()` | Toutes les parties enregistrées |
| `lireScoresDuJour()` | Seulement les parties « mot du jour » |
| `lireScoresGeneraux()` | Seulement les parties libres |
| `enregistrerPartie()` | Enregistre une partie terminée |
| `lireStats()` | Statistiques du joueur |
| `mettreAJourStats()` | Met à jour victoires, séries, points |

## src/components/ : l'affichage

| Composant | Rôle |
| --- | --- |
| `CaseLettre` | Une case : lettre + couleur + animation de retournement |
| `Ligne` | 5 cases ; tremble si le mot est refusé |
| `Grille` | Les 6 lignes |
| `Clavier` | Clavier AZERTY à l'écran, coloré selon les lettres connues |

## src/pages/ : les écrans

| Fichier (adresse) | Fonctions |
| --- | --- |
| `Accueil.jsx` (`/`) | `Accueil()`, `lirePseudoSauve()`, `changerPseudo()`, `changerMode()`, `lancerPartie()` |
| `Partie.jsx` (`/partie`) | `Partie()`, `chargerPartieDuJour()`, `traiterTouche()`, `surTouche()`, `rejouer()`, `genererTextePartage()`, `partagerResultat()`, `retirerDerniereLettre()`, `ajouterLettre()` |
| `Scores.jsx` (`/scores`) | `Scores()`, `TableauScores()` |
| `Stats.jsx` (`/stats`) | `Stats()` |
| `Regles.jsx` (`/regles`) | `Regles()` |

## Qui appelle quoi pendant une partie

1. `Partie.jsx` reçoit une touche dans `traiterTouche()`.
2. À Entrée, il appelle `verifierMotWiktionnaire()` (wiktionnaire.js).
3. Si le mot est valide, il appelle `comparer()` (jeu.js) pour les couleurs.
4. Si la partie est finie, il appelle `calculerPoints()` (jeu.js) puis `enregistrerPartie()` (scores.js).