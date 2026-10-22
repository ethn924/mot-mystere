export const NOMBRE_ESSAIS = 6;
export const LONGUEUR_MOT = 5;

export function normaliserMot(mot) {
  let texte = mot.toUpperCase();
  texte = texte.replaceAll("Œ", "OE");
  texte = texte.replaceAll("Æ", "AE");
  // NFD sépare "É" en "E" + accent, qu'on jette ensuite
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

export function tirerMotAleatoire(listeMots) {
  let random = Math.random();
  random = random * listeMots.length;
  random = Math.floor(random);

  return listeMots[random];
}

export function comparer(motMystere, proposition) {
  const mystere = normaliserMot(motMystere);
  const essai = normaliserMot(proposition);

  const resultat = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    resultat[i] = "gris";
  }

  const disponibles = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    disponibles[i] = mystere[i];
  }

  // D'abord les verts : même lettre, même place. On barre la lettre utilisée.
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    if (essai[i] === mystere[i]) {
      resultat[i] = "vert";
      disponibles[i] = null;
    }
  }

  // Ensuite les jaunes, seulement avec les lettres encore disponibles.
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    if (resultat[i] === "vert") {
      continue;
    }

    const lettre = essai[i];
    for (let j = 0; j < LONGUEUR_MOT; j++) {
      if (disponibles[j] === lettre) {
        resultat[i] = "jaune";
        disponibles[j] = null;
        break;
      }
    }
  }

  return resultat;
}

export function estGagne(couleurs) {
  if (couleurs.length !== LONGUEUR_MOT) {
    return false;
  }

  for (let i = 0; i < couleurs.length; i++) {
    if (couleurs[i] !== "vert") {
      return false;
    }
  }
  return true;
}

export function estPerdu(nombreLignes, gagne) {
  if (gagne) {
    return false;
  }
  return nombreLignes >= NOMBRE_ESSAIS;
}

export function partieEstFinie(lignes) {
  if (lignes.length === 0) {
    return false;
  }

  const derniereLigne = lignes[lignes.length - 1];
  const gagne = estGagne(derniereLigne.couleurs);
  const perdu = estPerdu(lignes.length, gagne);
  return gagne || perdu;
}

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
