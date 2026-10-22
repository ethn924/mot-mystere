# Mémo oral de soutien - Ethan (Le Mot Mystère)

Ce fichier me sert d'aide-mémoire pour la soutenance de 10 minutes avec le prof.
Le but est de pouvoir expliquer l'architecture, chaque fichier et chaque choix technique avec mes propres mots, sans hésiter.

---

## 1. Vue d'ensemble du projet : Pourquoi cette structure ?

Le sujet impose une règle stricte : **la logique métier doit être séparée des composants d'affichage**, sinon on perd des points au barème.

Voici comment on a organisé nos dossiers dans `src/` :
- `logique/` : contient le pur JavaScript (calcul des scores, comparaison des lettres, requêtes API). Aucun JSX, aucun `useState`. Tout est testable et isolé.
- `components/` : les petits morceaux d'interface réutilisables (une case de lettre, une ligne, la grille de 6 essais).
- `pages/` : les écrans complets reliés à une URL (`Accueil.jsx` sur `/`, `Partie.jsx` sur `/partie`).
- `data/` : la liste initiale des 300 mots fournis dans le sujet (`mots-solutions.json`).
- `App.jsx` : configure le routeur (`BrowserRouter`, `Routes`, `Route`) pour naviguer d'un écran à l'autre.

---

## 2. Qui fait quoi ? (Fiche par fichier)

### Dans `src/logique/`

1. **`jeu.js`** :
   - `LONGUEUR_MOT = 5` et `NOMBRE_ESSAIS = 6` : constantes de base du jeu.
   - `normaliserMot(mot)` : met tout en majuscules, retire les accents avec `normalize("NFD")` et remplace les ligatures `Œ` par `OE` et `Æ` par `AE`. On compare toujours des lettres simples de A à Z.
   - `tirerMotAleatoire(listeMots)` : prend un mot au hasard avec `Math.random()`.
   - `comparer(motMystere, proposition)` : **Le cœur de l'algorithme**. Il fonctionne en deux passes obligatoires pour ne pas se faire piéger par les doublons (ex: ARBRE / ERRER) :
     1. Première passe : on repère les lettres à la bonne place (vert). On met la lettre à `null` dans une copie du mot mystère (`disponibles`) pour qu'elle ne soit plus réutilisée.
     2. Deuxième passe : on cherche les lettres restantes mal placées (jaune). Dès qu'on en trouve une, on la consomme (`null`). Tout le reste reste gris.
   - `estGagne(couleurs)` : vérifie si les 5 cases sont vertes.
   - `estPerdu(nombreLignes, gagne)` : vérifie si on a atteint 6 essais sans trouver.
   - `calculerPoints(nombreEssais, gagne)` : tableau officiel du PDF : 1er essai = 600 pts, puis 500, 400, 300, 200, 100, et 0 si perdu.

2. **`wiktionnaire.js`** :
   - Isole tous les échanges avec l'API MediaWiki Wiktionnaire (`https://fr.wiktionary.org/w/api.php`).
   - Obligatoire : en-tête `Api-User-Agent` demandé par la fondation Wikimedia et paramètre `origin=*` pour éviter le blocage CORS du navigateur.
   - `verifierSectionFrancaise(titre)` : regarde si la page a bien une section de niveau 2 en langue française (pour éviter d'accepter un mot qui n'existe qu'en anglais ou en latin).
   - Gestion des accents : si on tape `ECOLE` sans accent, l'API ne trouve pas la page directe, donc on lance `action=query&list=search` pour trouver les pages associées et tomber sur `école`.
   - En cas de coupure internet : on attrape l'erreur dans un `catch` et on laisse le mot valide pour que le joueur ne soit pas bloqué.

### Dans `src/components/`

1. **`CaseLettre.jsx`** :
   - Affiche une seule case carrée.
   - Reçoit la lettre et la couleur (`vert`, `jaune`, `gris`).
   - Applique la bonne classe CSS (`case-verte`, `case-jaune`, `case-grise`).

2. **`Ligne.jsx`** :
   - Fait une boucle de 0 à 4 pour créer 5 `CaseLettre`.
   - Gère aussi la classe CSS `ligne-refusee` quand le mot n'est pas dans le dictionnaire.

3. **`Grille.jsx`** :
   - Affiche les 6 lignes fixes du jeu.
   - Pour chaque indice de 0 à 5 :
     - Si la ligne est déjà jouée : on affiche le mot et ses couleurs.
     - Si c'est la ligne en cours : on affiche la frappe en direct (`proposition`).
     - Si c'est en dessous : ligne vide.

### Dans `src/pages/`

1. **`Accueil.jsx`** :
   - Présente le jeu avec les règles en une phrase.
   - Un formulaire simple avec un champ `pseudo`.
   - `localStorage.getItem("pseudo")` recharge le pseudo au retour du joueur.
   - À la soumission, `localStorage.setItem("pseudo", pseudo)` et `navigate("/partie")` lancent la partie.

2. **`Partie.jsx`** :
   - Gère la vie de la partie avec plusieurs états : `proposition`, `motMystere`, `lignes`, `enChargement`, `message`, `ligneRefusee`.
   - Écouteur clavier physique `useEffect` :
     - Écoute l'événement `keydown` sur la fenêtre `window`.
     - `Enter` valide la ligne si elle fait 5 lettres (en vérifiant d'abord l'API Wiktionnaire).
     - `Backspace` efface la dernière lettre avec `slice(0, -1)`.
     - Bloque les touches si la partie est finie ou pendant le chargement de l'API.
     - **Point clé pour le prof** : on met `[proposition, motMystere, finie, enChargement]` dans les dépendances du `useEffect` pour que la fonction ait toujours les valeurs à jour.
     - Nettoyage obligatoire avec `removeEventListener` dans le return pour éviter les fuites mémoire.
   - En fin de partie : affiche les points obtenus, le mot avec ses accents, et un lien cliquable vers sa définition sur le Wiktionnaire.

---

## 3. Ce que je dis au prof en cas de question piège

- **Pourquoi stocker les points dans `jeu.js` et pas directement dans le composant ?**  
  *Réponse* : Pour respecter le barème du sujet qui interdit de mélanger la logique et l'affichage, et pour que les calculs restent testables indépendamment de React.
- **Pourquoi `origin=*` dans les requêtes Wiktionnaire ?**  
  *Réponse* : Parce qu'on fait un appel depuis le navigateur vers un domaine différent. Sans `origin=*`, le navigateur bloque la réponse avec une erreur CORS.
- **Comment gérez-vous le mot ECOLE tapé sans accent ?**  
  *Réponse* : Le mot mystère a des accents dans le dictionnaire, mais le joueur tape sans accent. Quand la requête directe échoue, on fait une recherche de titre avec `list=search` sur le Wiktionnaire, on normalise les résultats sans accent, et dès qu'on trouve une correspondance française (ex: `école`), on valide.
- **Comment sont gérés les doublons (ex: ARBRE et ERRER) ?**  
  *Réponse* : En deux passes dans `comparer()`. D'abord tous les verts, et on barre les lettres utilisées. Ensuite seulement les jaunes sur les lettres restantes. Ça empêche de colorer deux fois une lettre qui n'apparaît qu'une fois.
