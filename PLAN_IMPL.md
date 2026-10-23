# Plan d'implémentation (après la présentation du 23/10, 14h30)

Ce qui est fait après la présentation est noté ici, pas dans le README.

## Déjà fait après la présentation

- Vérification Wiktionnaire simplifiée : **un seul appel** (`list=search` avec `incategory:français`) au lieu de deux ou trois.
- Tests automatisés : `src/logique/jeu.test.js` (8 tests Vitest, dont 2 sur les lettres en double). Lancer avec `npm test`.
- `vercel.json` créé à la racine pour que React Router gère toutes les adresses.

## Reste à faire pour valider le palier 4 (16/20)

### 1. Déploiement Vercel (environ 1 h)
1. Sur vercel.com : importer le dépôt GitHub `ethn924/mot-mystere` (Vercel détecte Vite tout seul).
2. Tester en ligne : ouvrir directement `/scores`, `/stats`, `/partie` et rafraîchir chaque page.
3. Vérifier que le mot du jour est le même sur deux appareils.

### 2. Finitions (environ 30 min)
1. Ajouter l'adresse Vercel tout en haut du README.
2. Ajouter `npm test` dans la partie « Lancer le projet » du README.
3. Passer le palier 4 à « Fait » dans le README.

## Pas prévu

Paliers 5 et 6 : l'objectif est d'abord de valider complètement le palier 4.
