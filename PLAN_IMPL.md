# Plan d'implémentation (après la présentation du 23/10, 14h30)

Ce qui est fait après la présentation est noté ici, pas dans le README.

## Déjà fait après la présentation

- Vérification Wiktionnaire simplifiée : **un seul appel** (`list=search` avec `incategory:français`) au lieu de deux ou trois.

## Reste à faire pour valider le palier 4 (16/20)

### 1. Tests automatisés (environ 2 h)
Vitest est déjà installé et `npm test` existe déjà.

1. Créer `src/logique/jeu.test.js`.
2. Tests de `comparer()` (dont au moins 2 sur les lettres en double) :
   - ARBRE / ARBRE : 5 verts
   - ARBRE / ERRER : gris, vert, jaune, gris, gris
   - ROUGE / OOXXX : gris, vert, gris, gris, gris
   - ROUGE / XXXXX : 5 gris
3. Tests de `calculerPoints()` : 1 essai = 600, 6 essais = 100, perdu = 0.
4. Lancer `npm test`, tout doit être vert.

### 2. Déploiement Vercel (environ 1 h)
1. Créer `vercel.json` à la racine pour que React Router gère toutes les adresses :
   `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`
2. Sur vercel.com : importer le dépôt GitHub `ethn924/mot-mystere` (Vercel détecte Vite tout seul).
3. Tester en ligne : ouvrir directement `/scores`, `/stats`, `/partie` et rafraîchir chaque page.
4. Vérifier que le mot du jour est le même sur deux appareils.

### 3. Finitions (environ 30 min)
1. Ajouter l'adresse Vercel tout en haut du README.
2. Ajouter `npm test` dans la partie « Lancer le projet » du README.
3. Passer le palier 4 à « Fait » dans le README.

## Pas prévu

Paliers 5 et 6 : l'objectif est d'abord de valider complètement le palier 4.