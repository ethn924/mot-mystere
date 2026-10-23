// Logique du jeu : règles, comparaison des lettres, calcul des points et mot du jour.
// Rien d'affichage ici, tout est séparé de React pour rester facile à comprendre.

export const NOMBRE_ESSAIS = 6;
export const LONGUEUR_MOT = 5;

// Transforme un mot en majuscules sans accents (ex: école -> ECOLE, cœur -> COEUR).
export function normaliserMot(mot) {
  let texte = mot.toUpperCase();
  texte = texte.replaceAll("Œ", "OE");
  texte = texte.replaceAll("Æ", "AE");
  texte = texte.normalize("NFD"); // Décompose les lettres avec accent pour les comparaisons

  let resultat = "";
  for (let i = 0; i < texte.length; i++) {
    const lettre = texte[i];
    if (lettre >= "A" && lettre <= "Z") {
      resultat = resultat + lettre;
    }
  }
  return resultat;
}

// Choisit un mot au hasard dans la liste fournie.
export function tirerMotAleatoire(listeMots) {
  let random = Math.random();
  random = random * listeMots.length;
  random = Math.floor(random);
  return listeMots[random];
}

// Compare le mot mystère et la proposition du joueur.
// Retourne une liste de couleurs : "vert", "jaune" ou "gris" pour chaque lettre.
//
// Ce qui m'a fait galérer : les lettres en double.
// Exemple concret : mot mystère = ARBRE, proposition = ERRER.
// Il n'y a que deux R et un E dans ARBRE. Je ne peux pas mettre trois R en jaune.
//
// Ma première idée : une seule boucle qui regarde lettre par lettre.
// Résultat : je donnais trop de lettres jaunes. Ça ne marche pas.
//
// Ma solution : deux boucles séparées.
// 1) D'abord, je marque en vert les lettres bien placées (même lettre, même place).
//    Quand une lettre devient verte, je la "biffe" dans une liste séparée pour
//    qu'elle ne puisse plus servir de jaune après.
// 2) Ensuite, je cherche les lettres jaunes seulement parmi celles qui n'ont pas
//    été biffées. Dès qu'une lettre sert de jaune, je la biffe aussi.
//
// Pour "biffer" une lettre, je remplace sa valeur par null dans le tableau des
// lettres disponibles. Quand je vois null, je sais que cette lettre est déjà utilisée
// et je ne la compte plus.
export function comparer(motMystere, proposition) {
  const mystere = normaliserMot(motMystere);
  const essai = normaliserMot(proposition);

  const couleurs = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    couleurs[i] = "gris";
  }

  // Tableau des lettres du mot mystère encore disponibles.
  // Quand je mets null à une position, ça signifie : cette lettre est déjà utilisée.
  const disponibles = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    disponibles[i] = mystere[i];
  }

  // Première boucle : les lettres bien placées deviennent vertes.
  // Je biffe la lettre utilisée en mettant null.
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    if (essai[i] === mystere[i]) {
      couleurs[i] = "vert";
      disponibles[i] = null;
    }
  }

  // Deuxième boucle : les lettres mal placées mais présentes deviennent jaunes.
  // Je saute les lettres déjà vertes.
  // Je cherche seulement parmi les lettres encore disponibles (celles qui ne sont pas null).
  // Dès que je trouve une correspondance, je biffe cette lettre en mettant null.
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    if (couleurs[i] === "vert") {
      continue;
    }

    const lettre = essai[i];
    for (let j = 0; j < LONGUEUR_MOT; j++) {
      if (disponibles[j] === lettre) {
        couleurs[i] = "jaune";
        disponibles[j] = null;
        break;
      }
    }
  }

  return couleurs;
}

// Retourne vrai si toutes les lettres sont vertes.
export function estGagne(couleurs) {
  for (let i = 0; i < couleurs.length; i++) {
    if (couleurs[i] !== "vert") {
      return false;
    }
  }
  return true;
}

// Retourne vrai si le joueur a utilisé tous ses essais sans gagner.
export function estPerdu(nombreLignes, gagne) {
  if (gagne) {
    return false;
  }
  return nombreLignes >= NOMBRE_ESSAIS;
}

// Retourne vrai si la partie est terminée (gagnée ou perdue).
export function partieEstFinie(lignes) {
  if (lignes.length === 0) {
    return false;
  }

  const derniereLigne = lignes[lignes.length - 1];
  const gagne = estGagne(derniereLigne.couleurs);
  const perdu = estPerdu(lignes.length, gagne);
  return gagne || perdu;
}

// Calcule les points selon le nombre d'essais.
// 600 pour 1 essai, 500 pour 2, ..., 100 pour 6, 0 si perdu.
export function calculerPoints(nombreEssais, gagne) {
  if (!gagne) {
    return 0;
  }
  if (nombreEssais === 1) {
    return 600;
  }
  if (nombreEssais === 2) {
    return 500;
  }
  if (nombreEssais === 3) {
    return 400;
  }
  if (nombreEssais === 4) {
    return 300;
  }
  if (nombreEssais === 5) {
    return 200;
  }
  if (nombreEssais === 6) {
    return 100;
  }
  return 0;
}

// Calcule la couleur de chaque touche du clavier virtuel.
// Priorité : vert > jaune > gris. Une fois vert, ça ne repasse jamais en jaune ou gris.
export function calculerStatutsLettres(lignes) {
  const statuts = {};

  for (let i = 0; i < lignes.length; i++) {
    const mot = lignes[i].mot;
    const couleurs = lignes[i].couleurs;

    for (let j = 0; j < mot.length; j++) {
      const lettre = mot[j].toUpperCase();
      const couleur = couleurs[j];
      const statutActuel = statuts[lettre];

      if (statutActuel === "vert") {
        continue;
      }

      if (couleur === "vert") {
        statuts[lettre] = "vert";
      } else if (couleur === "jaune" && statutActuel !== "vert") {
        statuts[lettre] = "jaune";
      } else if (couleur === "gris" && !statutActuel) {
        statuts[lettre] = "gris";
      }
    }
  }

  return statuts;
}

// Date de référence pour le mot du jour (1er janvier 2024).
const DATE_REFERENCE = new Date("2024-01-01T00:00:00Z");

// Calcule le nombre de jours écoulés depuis la date de référence.
function nombreDeJoursDepuisReference() {
  const maintenant = new Date();
  const difference = maintenant - DATE_REFERENCE;
  return Math.floor(difference / (1000 * 60 * 60 * 24));
}

// Choisit le mot du jour : le même pour tous, change à minuit.
// On n'utilise pas Math.random() car deux ordinateurs auraient des mots différents.
export function choisirMotDuJour(listeMots) {
  const nombreDeJours = nombreDeJoursDepuisReference();
  const indice = nombreDeJours % listeMots.length;
  return listeMots[indice];
}

// Calcule le temps restant avant minuit (prochain changement de mot du jour).
// Retourne un objet avec heures, minutes et secondes.
export function tempsRestantAvantMinuit() {
  const maintenant = new Date();
  const demain = new Date(maintenant);
  demain.setDate(demain.getDate() + 1);
  demain.setHours(0, 0, 0, 0);

  const difference = demain - maintenant;
  const secondesTotales = Math.floor(difference / 1000);

  const heures = Math.floor(secondesTotales / 3600);
  const minutes = Math.floor((secondesTotales % 3600) / 60);
  const secondes = secondesTotales % 60;

  return { heures: heures, minutes: minutes, secondes: secondes };
}
