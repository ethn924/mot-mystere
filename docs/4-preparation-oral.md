# Préparation de l'oral

> **Pourquoi cette fiche :** la soutenance se termine par des questions sur le code. Cette fiche résume chaque fichier et les réponses aux questions les plus probables.

## Comment est organisé le projet

```
src/
├── logique/     -> tout le JavaScript pur (pas de React, pas d'affichage)
├── components/  -> les petits morceaux d'interface (une case, une ligne, la grille, le clavier)
├── pages/       -> les 5 écrans du jeu (accueil, partie, scores, stats, règles)
├── data/        -> la liste des 300 mots mystères (mots-solutions.json)
├── App.jsx      -> configure les 5 adresses (routes) du site
└── main.jsx     -> point de démarrage de l'application
```

## Les 3 fichiers de logique (le plus important)

### `src/logique/jeu.js`
C'est le cerveau du jeu. Rien d'affichage ici, que des fonctions pures.

- `normaliserMot()` : transforme "école" en "ECOLE", enlève les accents, remplace œ par oe. Sert à comparer les mots sans se soucier des accents.
- `tirerMotAleatoire()` : prend un mot au hasard dans la liste (pour la partie libre).
- `comparer(motMystere, proposition)` : c'est LA fonction importante. Elle dit pour chaque lettre si c'est vert, jaune ou gris. Elle fait 2 boucles : d'abord les lettres bien placées (vert), ensuite les lettres mal placées mais présentes (jaune), en ne comptant pas deux fois une lettre qui n'existe qu'une fois.
- `estGagne(couleurs)` : regarde si toutes les lettres sont vertes.
- `estPerdu()` : regarde si on a atteint 6 essais sans avoir gagné.
- `partieEstFinie()` : retourne vrai si le joueur a gagné ou perdu.
- `calculerPoints()` : 600 pts pour 1 essai, 500 pour 2, ..., 100 pour 6, 0 si perdu.
- `calculerStatutsLettres(lignes)` : détermine la couleur de chaque touche du clavier virtuel (vert > jaune > gris, une fois vert ça ne repasse pas en jaune).
- `choisirMotDuJour()` : choisit le mot selon la date (nombre de jours depuis le 1er janvier 2024), donc le même pour tout le monde, qui change à minuit.
- `tempsRestantAvantMinuit()` : calcule combien il reste d'heures/minutes/secondes avant le prochain mot du jour.

### `src/logique/wiktionnaire.js`
C'est le seul fichier qui parle à Internet. Il appelle l'API du Wiktionnaire.

- `verifierMotWiktionnaire(proposition)` : teste si le mot tapé est un vrai mot français.
  - D'abord, il teste le mot directement (ex: "arbre").
  - Si ça ne marche pas, il fait une recherche sur le Wiktionnaire pour trouver la version avec accents (ex: joueur tape "ECOLE", trouve "école").
  - Il vérifie que la page a bien une section "Français" (pour éviter les mots d'autres langues).
  - `origin=*` est ajouté dans l'URL sinon le navigateur bloque la réponse (CORS).
  - Si l'API ne répond pas, on accepte le mot par défaut pour ne pas bloquer le joueur.

### `src/logique/scores.js`
Gère tout ce qui est enregistré dans le navigateur (localStorage).

- `lireScores()` : lit la liste de toutes les parties terminées.
- `lireScoresDuJour()` : ne garde que les parties en mode "mot du jour".
- `lireScoresGeneraux()` : ne garde que les parties en mode "libre".
- `enregistrerPartie()` : ajoute une partie à la liste, trie par points (puis par essais), garde le top 10, et met à jour les stats personnelles.
- `lireStats()` : lit les statistiques (nombre de parties, victoires, série, points, répartition par essai).

## Les composants d'affichage

### `src/components/CaseLettre.jsx`
Une seule case de la grille. Affiche une lettre et sa couleur (vert/jaune/gris). Chaque case a un petit décalage d'animation pour qu'elles ne se retournent pas toutes en même temps.

### `src/components/Ligne.jsx`
Une ligne complète de 5 cases. Ajoute l'animation de tremblement si le mot est refusé par le dictionnaire.

### `src/components/Grille.jsx`
Affiche les 6 lignes du jeu : les lignes déjà jouées (avec leurs couleurs), la ligne en cours de frappe, et les lignes vides restantes.

### `src/components/Clavier.jsx`
Clavier virtuel AZERTY à l'écran. Les touches changent de couleur selon ce qu'on sait des lettres. Écoute aussi le clavier physique (touche Entrée, Retour arrière, lettres A-Z).

## Les 5 écrans (pages)

### `src/pages/Accueil.jsx` (adresse `/`)
- Affiche le nom du jeu et une phrase d'explication.
- Champ pour saisir le pseudo (mémorisé dans le navigateur).
- Deux boutons radio pour choisir : "Partie libre" ou "Mot du jour".
- Bouton pour lancer la partie.
- Liens vers les scores, les statistiques et les règles.

### `src/pages/Partie.jsx` (adresse `/partie`)
C'est l'écran principal du jeu. Il fait le lien entre tout :
- Affiche la grille, le clavier virtuel et le compte à rebours (mode du jour).
- Gère la saisie au clavier physique et virtuel.
- Appelle le Wiktionnaire pour valider chaque mot.
- Calcule les couleurs avec `comparer()`.
- Enregistre le score à la fin de la partie.
- Affiche l'écran de fin (victoire/défaite, points, lien Wiktionnaire, bouton partager).
- Sauvegarde la partie du jour pour pouvoir la reprendre après un rechargement de page.

### `src/pages/Scores.jsx` (adresse `/scores`)
Affiche deux tableaux séparés :
- Classement "Mot du Jour" : trié par points, puis par temps de résolution.
- Classement "Général" : trié par points, puis par nombre d'essais.
- Chaque tableau montre le top 10.

### `src/pages/Stats.jsx` (adresse `/stats`)
Affiche les statistiques du joueur : parties jouées, taux de victoires, série en cours, meilleure série, total des points, et combien de victoires en 1, 2, 3... essais.

### `src/pages/Regles.jsx` (adresse `/regles`)
Explique les trois couleurs (vert/jaune/gris) avec des exemples visuels, et affiche le barème officiel des points (600 à 0).

## Les réponses aux questions classiques du prof

**Q : Pourquoi avoir séparé la logique de l'affichage ?**
R : Pour que le code soit facile à tester et à comprendre. `jeu.js` ne contient que du JavaScript pur, sans React. On peut donc vérifier que `comparer()` marche bien sans lancer l'interface.

**Q : Comment gère-t-on les lettres en double (ex: ARBRE / ERRER) ?**

R : C'est le point le plus délicat du jeu. Le mot ARBRE contient deux R et un seul E. La proposition ERRER contient trois R et deux E. Je ne peux pas mettre trois R en jaune parce qu'il n'y en a que deux dans le mot mystère.

Ma solution : je fais deux boucles séparées.

**Première boucle** : je regarde lettre par lettre si elle est bien placée (même lettre, même indice). Si oui, je marque vert et je "biffe" cette lettre dans une liste de lettres disponibles (je remplace par `null`). Une lettre biffée ne peut plus servir de jaune après.

**Deuxième boucle** : je cherche les lettres jaunes seulement parmi les lettres qui n'ont pas été biffées (celles qui ne sont pas `null`). Dès qu'une lettre sert de jaune, je la biffe aussi.

Exemple avec ARBRE / ERRER :

- Boucle 1 (verts) : seule la lettre R à l'index 1 est bien placée. Je marque vert et je biffe le R de l'index 1 dans ma liste.
- Boucle 2 (jaunes) : je cherche les lettres restantes (E, R, E, R) dans ma liste qui contient encore [A, null, B, R, E]. 
  - Le premier E trouve le E à l'index 4 → jaune, je biffe.
  - Le R à l'index 2 trouve le R à l'index 3 → jaune, je biffe.
  - Le deuxième E ne trouve plus de E disponible (le seul était déjà biffé) → gris.
  - Le dernier R ne trouve plus de R disponible (les deux R étaient déjà biffés) → gris.

Résultat final : gris, vert, jaune, gris, gris. C'est correct.

Dans le code, `null` signifie simplement : "cette lettre du mot mystère est déjà utilisée, elle ne compte plus".


**Q : Comment choisit-on le mot du jour ?**
R : On compte le nombre de jours écoulés depuis une date de référence (1er janvier 2024), on prend le reste de la division par le nombre de mots dans la liste. Comme c'est basé sur la date, tout le monde a le même mot, et il change à minuit. Pas besoin de Math.random().

**Q : Que se passe-t-il si le Wiktionnaire ne répond pas ?**
R : On affiche un message mais on accepte le mot par défaut, pour ne pas bloquer le joueur. La partie continue normalement.

**Q : Comment est mémorisée une partie du jour en cours ?**
R : Dans le localStorage, sous la clé "partieDuJour", avec la date du jour. Si on recharge la page, on relit la sauvegarde et on reprend là où on en était. Une fois la partie terminée, elle ne peut plus être rejouée le même jour.

**Q : Pourquoi `origin=*` dans les requêtes Wiktionnaire ?**
R : Sans ce paramètre, le navigateur bloque la réponse à cause du CORS (Cross-Origin Resource Sharing). Le sujet le précise explicitement.

## Pour le partage (presse-papiers)

Quand le joueur termine une partie, on génère un texte avec des emoji de couleurs (🟩🟨⬛) sans révéler les lettres, et on le copie dans le presse-papiers avec `navigator.clipboard.writeText()`. Si la copie est refusée, on affiche un message d'erreur.
