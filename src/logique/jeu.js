// Logique du jeu : règles, comparaison des lettres, calcul des points et mot du jour.
// Rien d'affichage ici, tout est séparé de React pour rester facile à comprendre.

export const NOMBRE_ESSAIS = 6;
export const LONGUEUR_MOT = 5;

// Transforme un mot en majuscules sans accents (ex: école -> ECOLE, cœur -> COEUR).
export function normaliserMot(mot) {
  let texte = mot.toUpperCase();
  texte = texte.replaceAll("Œ", "OE");
  texte = texte.replaceAll("Æ", "AE");
  texte = texte.normalize("NFD");

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
// Piège des lettres en double : 2 boucles.
// 1) D'abord les lettres bien placées (vert).
// 2) Ensuite les lettres mal placées mais présentes (jaune), en ne comptant pas deux fois une lettre.
export function comparer(motMystere, proposition) {
  const mystere = normaliserMot(motMystere);
  const essai = normaliserMot(proposition);

  const couleurs = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    couleurs[i] = "gris";
  }

  // On copie le mot mystère pour pouvoir "consommer" les lettres déjà utilisées.
  const disponibles = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    disponibles[i] = mystere[i];
  }

  // Première boucle : les lettres bien placées deviennent vertes.
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    if (essai[i] === mystere[i]) {
      couleurs[i] = "vert";
      disponibles[i] = null;
    }
  }

  // Deuxième boucle : les lettres mal placées mais présentes deviennent jaunes.
  // On ne touche pas aux lettres déjà vertes.
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
