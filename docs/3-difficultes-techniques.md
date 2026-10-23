# Difficultés techniques et solutions

> **Pourquoi cette fiche :** le sujet demande de présenter une difficulté rencontrée. Je regroupe ici les points qui m'ont posé problème et comment je les ai résolus, pour ne pas refaire les mêmes erreurs en modifiant la logique.

## 1. Les lettres en double dans comparer() — le gros piège

C'est le point le plus délicat. Avec le mot mystère `ARBRE` et la proposition `ERRER`, on ne peut pas mettre trois `R` jaunes parce qu'il n'y a que deux `R` dans le mot.

Ma première idée : une seule boucle qui regarde lettre par lettre et met vert/jaune/gris au fur et à mesure. Ça ne marche pas pour les doublons.

Ma solution : deux boucles séparées.

- **Première boucle** : je regarde seulement les lettres bien placées (même lettre, même index). Je les marque en vert et je "consomme" la lettre correspondante dans le mot mystère (je la remplace par `null` dans un tableau de disponible) pour qu'elle ne puisse plus servir de jaune après.
- **Deuxième boucle** : je regarde les lettres restantes qui ne sont pas déjà vertes. Pour chaque lettre de la proposition, je cherche si elle existe encore dans le mot mystère parmi les lettres non consommées. Si oui, je marque jaune et je consomme cette occurrence.

Ça donne le bon résultat même avec des lettres en double des deux côtés.

## 2. L'écouteur clavier et l'état périmé

Quand le joueur appuie sur une touche du clavier physique, j'utilise `window.addEventListener("keydown", ...)`. Au début, la fonction dans l'écouteur utilisait une version vieille du state (la proposition vide par exemple), donc Entrée validait n'importe quoi.

Il faut faire attention aux dépendances du `useEffect` et surtout bien appeler `removeEventListener` dans le nettoyage, sinon on empile des écouteurs à chaque rendu.

## 3. Les accents et le Wiktionnaire

Le joueur tape sans accent (ex: `ECOLE`), mais la page Wiktionnaire est titrée `école`. Une requête directe sur `ecole` échoue.

J'ai résolu ça en deux étapes :
1. Je teste directement le mot tapé (en minuscule).
2. Si ça ne marche pas, je fais une recherche `action=query&list=search` pour trouver les titres approchants, je normalise chaque résultat (enlève les accents), et je vérifie qu'il y a bien une section `"Français"` de niveau 2 sur la page trouvée.

Il faut aussi ajouter `origin=*` dans l'URL sinon le navigateur bloque la réponse (CORS), et envoyer l'en-tête `Api-User-Agent` comme demandé par Wikimedia.

## 4. L'animation de tremblement qui ne se relance pas

Quand un mot est refusé, j'ajoute une classe CSS `ligne-refusee` pour faire trembler la ligne. Mais si le joueur enchaîne deux mots refusés, la classe est déjà là et l'animation ne se rejoue pas.

J'ai suivi l'indice du sujet : j'utilise un compteur de refus dans la prop `key` de la ligne active. Changer la clé force React à recréer la ligne, ce qui relance l'animation à chaque refus.

## 5. Les couleurs du clavier virtuel

Une lettre peut être jaune au tour 1 puis devenir verte au tour 2. Il ne faut surtout pas qu'elle repasse au jaune ou au gris au tour 3. J'ai mis une règle de priorité stricte dans `calculerStatutsLettres()` : le vert écrase tout et est définitif, le jaune ne s'applique que si la lettre n'est pas déjà verte, et le gris seulement si la lettre n'a jamais été jaune ni verte.

## 6. normaliserMot

Je transforme tout en majuscule, je remplace `Œ` par `OE` et `Æ` par `AE` à la main (la ligature n'est pas gérée par `normalize("NFD")`), puis j'utilise `normalize("NFD")` pour séparer les lettres accentuées en lettre de base + accent, et je garde uniquement les caractères de `A` à `Z`.

---

Si tu modifies quelque chose dans `jeu.js` ou `wiktionnaire.js`, commence par lire ce fichier pour éviter de refaire les mêmes erreurs. Le README renvoie ici pour les détails.
