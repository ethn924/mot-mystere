// Auteur : Ethan (ethn924) - Le Mot Mystère
// scores.js : gère l'enregistrement des parties et des statistiques dans le localStorage.

const CLE_SCORES = "scores_mot_mystere";
const CLE_STATS = "stats_mot_mystere";

// Lit la liste de toutes les parties enregistrées.
export function lireScores() {
  const texte = localStorage.getItem(CLE_SCORES);
  if (!texte) {
    return [];
  }
  try {
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
  const seulementDuJour = [];
  for (let i = 0; i < tousLesScores.length; i++) {
    if (tousLesScores[i].mode === "dujour") {
      seulementDuJour.push(tousLesScores[i]);
    }
  }
  return seulementDuJour;
}

// Lit seulement les parties en mode libre.
export function lireScoresGeneraux() {
  const tousLesScores = lireScores();
  const seulementGeneraux = [];
  for (let i = 0; i < tousLesScores.length; i++) {
    if (tousLesScores[i].mode !== "dujour") {
      seulementGeneraux.push(tousLesScores[i]);
    }
  }
  return seulementGeneraux;
}

// Enregistre une nouvelle partie terminée dans le tableau des scores.
export function enregistrerPartie(pseudo, mot, nombreEssais, points, mode, temps) {
  const scores = lireScores();
  const dateDuJour = new Date().toLocaleDateString("fr-FR");

  const nouvellePartie = {
    pseudo: pseudo || "Anonyme",
    mot: mot,
    essais: nombreEssais,
    points: points,
    date: dateDuJour,
    mode: mode || "libre",
    temps: temps || 0,
  };

  scores.push(nouvellePartie);

  // Trie par points décroissants, puis par nombre d'essais croissants.
  scores.sort(function (a, b) {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.essais - b.essais;
  });

  // Garde seulement les 10 meilleurs.
  const top10 = scores.slice(0, 10);
  localStorage.setItem(CLE_SCORES, JSON.stringify(top10));

  // Met à jour les statistiques personnelles du joueur.
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
