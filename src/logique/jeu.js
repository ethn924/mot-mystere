// Auteur : Ethan (ethn924) - Le Mot Mystère
// Logique du jeu : règles, comparaison des lettres, calcul des points et mot du jour.

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

export function tirerMotAleatoire(listeMots) {
  return listeMots[Math.floor(Math.random() * listeMots.length)];
}

// Compare la proposition au mot mystère : "vert", "jaune" ou "gris" pour chaque lettre.
// Deux passages pour gérer les lettres en double (ex : ARBRE / ERRER) :
// d'abord les verts, puis les jaunes avec les lettres pas encore utilisées.
export function comparer(motMystere, proposition) {
  const mystere = normaliserMot(motMystere);
  const essai = normaliserMot(proposition);

  const couleurs = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    couleurs[i] = "gris";
  }

  // Lettres du mot encore utilisables (null = déjà utilisée)
  const disponibles = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    disponibles[i] = mystere[i];
  }

  // 1er passage : les verts. On les fait en premier pour qu'une lettre bien placée
  // garde sa lettre. Ex : ROUGE / OOXXX, le 2e O doit être vert et le 1er gris,
  // sinon le 1er O prendrait le seul O en jaune et le 2e n'aurait plus rien.
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    if (essai[i] === mystere[i]) {
      couleurs[i] = "vert";
      disponibles[i] = null;
    }
  }

  // 2e passage : les jaunes, seulement avec les lettres restantes
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

export function estGagne(couleurs) {
  for (let i = 0; i < couleurs.length; i++) {
    if (couleurs[i] !== "vert") {
      return false;
    }
  }
  return true;
}

export function estPerdu(nombreLignes, gagne) {
  return !gagne && nombreLignes >= NOMBRE_ESSAIS;
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

// 600 pour 1 essai, 500 pour 2, ..., 100 pour 6, 0 si perdu.
export function calculerPoints(nombreEssais, gagne) {
  if (!gagne) {
    return 0;
  }
  if (nombreEssais < 1 || nombreEssais > NOMBRE_ESSAIS) {
    return 0;
  }
  // 1 essai -> (7 - 1) * 100 = 600 ; 6 essais -> (7 - 6) * 100 = 100
  return (7 - nombreEssais) * 100;
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
      } else if (couleur === "jaune") {
        statuts[lettre] = "jaune";
      } else if (couleur === "gris" && !statutActuel) {
        statuts[lettre] = "gris";
      }
    }
  }

  return statuts;
}

// Le mot du jour change à minuit heure française, pour tout le monde.
// On lit donc toujours la date et l'heure de Paris, quel que soit le fuseau de l'ordinateur.
const FUSEAU = "Europe/Paris";

// Renvoie la date de Paris sous forme "AAAA-MM-JJ" (ex : "2026-10-23").
export function dateDeParis() {
  // Le format "en-CA" donne directement AAAA-MM-JJ.
  return new Date().toLocaleDateString("en-CA", { timeZone: FUSEAU });
}

// Calcule le nombre de jours écoulés depuis le 1er janvier 2024, en date de Paris.
function nombreDeJoursDepuisReference() {
  const morceaux = dateDeParis().split("-");
  const annee = Number(morceaux[0]);
  const mois = Number(morceaux[1]);
  const jour = Number(morceaux[2]);

  // On compare deux dates "pures" (sans heure) pour éviter les décalages.
  const aujourdhui = Date.UTC(annee, mois - 1, jour);
  const reference = Date.UTC(2024, 0, 1);
  return Math.floor((aujourdhui - reference) / (1000 * 60 * 60 * 24));
}

// Choisit le mot du jour : le même pour tous, change à minuit (heure de Paris).
// On n'utilise pas Math.random() car deux ordinateurs auraient des mots différents.
export function choisirMotDuJour(listeMots) {
  const nombreDeJours = nombreDeJoursDepuisReference();
  const indice = nombreDeJours % listeMots.length;
  return listeMots[indice];
}

// Calcule le temps restant avant minuit à Paris (prochain mot du jour).
export function tempsRestantAvantMinuit() {
  // Heure actuelle à Paris, ex : "14:05:32".
  const heureParis = new Date().toLocaleTimeString("fr-FR", { timeZone: FUSEAU });
  const morceaux = heureParis.split(":");
  const secondesEcoulees =
    Number(morceaux[0]) * 3600 + Number(morceaux[1]) * 60 + Number(morceaux[2]);

  const secondesTotales = 24 * 3600 - secondesEcoulees;

  const heures = Math.floor(secondesTotales / 3600);
  const minutes = Math.floor((secondesTotales % 3600) / 60);
  const secondes = secondesTotales % 60;

  return { heures: heures, minutes: minutes, secondes: secondes };
}
