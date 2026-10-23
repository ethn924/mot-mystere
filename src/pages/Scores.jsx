// Scores : affiche deux classements séparés : le mot du jour et le général.
// Les données sont lues depuis le localStorage.

import { Link } from "react-router-dom";
import { lireScoresDuJour, lireScoresGeneraux } from "../logique/scores.js";

// Affiche un classement. trierParTemps : true = départage au temps, false = aux essais.
function TableauScores({ titre, scores, trierParTemps }) {
  if (scores.length === 0) {
    return (
      <section className="bloc-panneau zone-tableau-scores">
        <h2>{titre}</h2>
        <p className="message-vide">Aucune partie pour le moment.</p>
      </section>
    );
  }

  const scoresTries = [...scores].sort(function (a, b) {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (trierParTemps) {
      return a.temps - b.temps;
    }
    return a.essais - b.essais;
  });

  // On ne montre que les 10 meilleures parties.
  const top10 = scoresTries.slice(0, 10);

  return (
    <section className="bloc-panneau zone-tableau-scores">
      <h2>{titre}</h2>
      <table className="table-scores">
        <thead>
          <tr>
            <th>Rang</th>
            <th>Joueur</th>
            <th>Mot secret</th>
            <th>Essais</th>
            <th>Points</th>
            <th>Temps</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {top10.map(function (score, index) {
            let affichageTemps = "-";
            if (score.temps > 0) {
              const minutes = Math.floor(score.temps / 60);
              const secondes = score.temps % 60;
              affichageTemps = minutes + "m " + secondes + "s";
            }
            return (
              <tr key={index}>
                <td><span className={"badge-rang rang-" + (index + 1)}>{index + 1}</span></td>
                <td><strong>{score.pseudo}</strong></td>
                <td><span className="mot-secret-score">{score.mot}</span></td>
                <td>{score.essais} / 6</td>
                <td><strong className="points-vert">{score.points} pts</strong></td>
                <td>{affichageTemps}</td>
                <td>{score.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function Scores() {
  const scoresDuJour = lireScoresDuJour();
  const scoresGeneraux = lireScoresGeneraux();

  return (
    <main className="page page-large">
      <header className="page-header">
        <h1>Tableau des scores</h1>
        <p className="sous-titre">Les meilleurs parties enregistrées sur cet ordinateur.</p>
      </header>

      <div className="grille-stats">
        {/* Classement du mot du jour : tri par points puis par temps de résolution */}
        <TableauScores
          titre="Classement Mot du Jour"
          scores={scoresDuJour}
          trierParTemps={true}
        />

        {/* Classement général : tri par points puis par nombre d'essais */}
        <TableauScores
          titre="Classement Général"
          scores={scoresGeneraux}
          trierParTemps={false}
        />
      </div>

      <footer className="pied-page-action">
        <Link to="/">Retour à l'accueil</Link>
      </footer>
    </main>
  );
}

export default Scores;
