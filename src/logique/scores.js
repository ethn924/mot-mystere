// Rôle du fichier : gestion de la persistance locale des scores et statistiques du joueur.
// Enregistre les parties dans le localStorage et calcule le classement des 10 meilleurs scores.

const CLE_SCORES = "scores_mot_mystere";
const CLE_STATS = "stats_mot_mystere";

// Récupère la liste de toutes les parties enregistrées
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

// Enregistre une nouvelle partie terminée dans le tableau des scores
export function enregistrerPartie(pseudo, mot, nombreEssais, points) {
  const scores = lireScores();
  const dateDuJour = new Date().toLocaleDateString("fr-FR");

  const nouvellePartie = {
    pseudo: pseudo || "Anonyme",
    mot: mot,
    essais: nombreEssais,
    points: points,
    date: dateDuJour,
  };

  scores.push(nouvellePartie);

  // Tri : par points décroissants, puis par nombre d'essais croissants
  scores.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.essais - b.essais;
  });

  // On ne garde que les 10 meilleurs
  const top10 = scores.slice(0, 10);
  localStorage.setItem(CLE_SCORES, JSON.stringify(top10));

  // Mise à jour des statistiques personnelles du joueur
  mettreAJourStats(points > 0, nombreEssais, points);
}

// Récupère les statistiques cumulées
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
