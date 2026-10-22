// Scores : affiche le top 10 des meilleures parties, trie par points puis par nombre d'essais.
// Les données sont lues depuis le localStorage.

import { Link } from "react-router-dom";
import { lireScores } from "../logique/scores.js";

function Scores() {
  const scores = lireScores();

  return (
    <main className="page page-large">
      <header className="page-header">
        <h1>Tableau des scores</h1>
        <p className="sous-titre">Le Top 10 des meilleures parties enregistrées sur cet ordinateur.</p>
      </header>

      <section className="bloc-panneau zone-tableau-scores">
        {scores.length === 0 ? (
          <p className="message-vide">Aucune partie enregistrée pour le moment. Lance une partie pour inaugurer le classement !</p>
        ) : (
          <table className="table-scores">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Joueur</th>
                <th>Mot secret</th>
                <th>Essais</th>
                <th>Points</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td><span className={"badge-rang rang-" + (index + 1)}>{index + 1}</span></td>
                  <td><strong>{score.pseudo}</strong></td>
                  <td><span className="mot-secret-score">{score.mot}</span></td>
                  <td>{score.essais} / 6</td>
                  <td><strong className="points-vert">{score.points} pts</strong></td>
                  <td>{score.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer className="pied-page-action">
        <Link to="/">Retour à l'accueil</Link>
      </footer>
    </main>
  );
}

export default Scores;
