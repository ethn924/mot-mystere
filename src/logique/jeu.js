// FICHIER COMPLEXE
// Toute la logique pure du jeu se trouve ici. Rien d'affichage.
// Mon plus gros casse-tête : le traitement des lettres en double pour les couleurs (vert/jaune/gris).

export const NOMBRE_ESSAIS = 6;
export const LONGUEUR_MOT = 5;

export function normaliserMot(mot) {
  let texte = mot.toUpperCase();
  texte = texte.replaceAll("Œ", "OE");
  texte = texte.replaceAll("Æ", "AE");
  // NFD sépare "É" en "E" + accent, on garde que les lettres A-Z
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

// comparaison entre mot mystère et proposition
// GROS PIÈGE : lettres en double
// On fait 2 passes pour ne pas donner 2 fois une lettre qui n'existe qu'une fois
export function comparer(motMystere, proposition) {
  const mystere = normaliserMot(motMystere);
  const essai = normaliserMot(proposition);

  const resultat = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    resultat[i] = "gris";
  }

  // copie du mot mystère pour pouvoir "consommer" les lettres
  const disponibles = [];
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    disponibles[i] = mystere[i];
  }

  // 1ère boucle : VERT
  // on regarde lettre par lettre à la même place
  // si ça matche on marque vert et on retire cette lettre du mot pour qu'elle ne serve plus
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    if (essai[i] === mystere[i]) {
      resultat[i] = "vert";
      disponibles[i] = null;
    }
  }

  // 2ème boucle : JAUNE
  // maintenant on cherche dans ce qui reste
  // on ne touche pas aux verts, on cherche la lettre quelque part ailleurs
  // dès qu'on trouve on consomme cette occurrence
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

// Sert à colorer le clavier virtuel
// on veut garder la meilleure info trouvée : vert > jaune > gris
// si une lettre devient verte un jour, on ne repasse jamais en jaune/gris
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

// Date de référence : le 1er janvier 2024 à minuit
const DATE_REFERENCE = new Date("2024-01-01T00:00:00Z");

// Calcule le nombre de jours écoulés depuis la date de référence
// Le changement de mot se fait à minuit (heure locale)
function nombreDepuisReference() {
  const maintenant = new Date();
  const difference = maintenant - DATE_REFERENCE;
  return Math.floor(difference / (1000 * 60 * 60 * 24));
}

// Choisit le mot du jour : le même pour tous les joueurs qui jouent le même jour
// Change à minuit, sans utiliser Math.random() pour que tout le monde ait le même mot
export function choisirMotDuJour(listeMots) {
  const nombreDeJours = nombreDepuisReference();
  const indice = nombreDeJours % listeMots.length;
  return listeMots[indice];
}

// Calcule le temps restant avant minuit (prochain changement de mot du jour)
// Retourne un objet avec heures, minutes et secondes
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

  return { heures, minutes, secondes };
}
