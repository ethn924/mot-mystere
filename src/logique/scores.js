// Auteur : Ethan (ethn924) - Le Mot Mystère
// scores.js : gère l'enregistrement des parties et des statistiques dans le localStorage.

// Noms des "cases" du localStorage où on range les données.
const CLE_SCORES = "scores_mot_mystere";
const CLE_STATS = "stats_mot_mystere";

// Lit la liste de toutes les parties enregistrées.
export function lireScores() {
  const texte = localStorage.getItem(CLE_SCORES);
  if (!texte) {
    return [];
  }
  try {
    // Le localStorage ne stocke que du texte : JSON.parse le remet en tableau.
    const tableau = JSON.parse(texte);
    if (Array.isArray(tableau)) {
      return tableau;
    }
    return [];
  } catch {
    return [];
  }
}

// Lit seulement les parties du mot du jour.
export function lireScoresDuJour() {
  const tousLesScores = lireScores();
  const scoresDuJour = [];
  for (let i = 0; i < tousLesScores.length; i++) {
    if (tousLesScores[i].mode === "dujour") {
      scoresDuJour.push(tousLesScores[i]);
    }
  }
  return scoresDuJour;
}

// Lit seulement les parties en mode libre.
export function lireScoresGeneraux() {
  const tousLesScores = lireScores();
  const scoresLibres = [];
  for (let i = 0; i < tousLesScores.length; i++) {
    if (tousLesScores[i].mode !== "dujour") {
      scoresLibres.push(tousLesScores[i]);
    }
  }
  return scoresLibres;
}

// Enregistre une nouvelle partie terminée dans le tableau des scores.
export function enregistrerPartie(pseudo, mot, nombreEssais, points, mode, temps) {
  const scores = lireScores();

  // Valeurs par défaut si une information manque
  if (!pseudo) {
    pseudo = "Anonyme";
  }
  if (!mode) {
    mode = "libre";
  }
  if (!temps) {
    temps = 0;
  }
  const dateDuJour = new Date().toLocaleDateString("fr-FR");

  const nouvellePartie = {
    pseudo: pseudo,
    mot: mot,
    essais: nombreEssais,
    points: points,
    date: dateDuJour,
    mode: mode,
    temps: temps,
  };

  scores.push(nouvellePartie);

  // Trie par points décroissants, puis par nombre d'essais croissants.
  scores.sort(function (a, b) {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.essais - b.essais;
  });

  const top10 = scores.slice(0, 10);
  localStorage.setItem(CLE_SCORES, JSON.stringify(top10));

  mettreAJourStats(points > 0, nombreEssais, points);
}

// Lit les statistiques cumulées du joueur.
export function lireStats() {
  const texte = localStorage.getItem(CLE_STATS);
  const statsDefaut = {
    partiesJouees: 0,
    victoires: 0,
    serieActuelle: 0,
    meilleureSerie: 0,
    totalPoints: 0,
    repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  };

  if (!texte) {
    return statsDefaut;
  }

  try {
    return { ...statsDefaut, ...JSON.parse(texte) };
  } catch {
    return statsDefaut;
  }
}

// Ajoute la partie aux statistiques : parties, victoires, série, points.
// Une défaite remet la série en cours à 0.
function mettreAJourStats(gagne, nombreEssais, points) {
  const stats = lireStats();
  stats.partiesJouees = stats.partiesJouees + 1;
  stats.totalPoints = stats.totalPoints + points;

  if (gagne) {
    stats.victoires = stats.victoires + 1;
    stats.serieActuelle = stats.serieActuelle + 1;
    if (stats.serieActuelle > stats.meilleureSerie) {
      stats.meilleureSerie = stats.serieActuelle;
    }
    if (stats.repartition[nombreEssais] !== undefined) {
      stats.repartition[nombreEssais] = stats.repartition[nombreEssais] + 1;
    }
  } else {
    stats.serieActuelle = 0;
  }

  localStorage.setItem(CLE_STATS, JSON.stringify(stats));
}
