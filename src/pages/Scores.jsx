// Rôle du fichier : écran affichant les dix meilleures parties enregistrées.
// Classement conservé dans le localStorage entre deux visites.

import { Link } from "react-router-dom";
import { lireScores } from "../logique/scores.js";

function Scores() {
  const scores = lireScores();

  return (
    <main className="page">
      <h1>Tableau des scores</h1>
      <p>Les 10 meilleures parties enregistrées sur cet ordinateur :</p>

      {scores.length === 0 ? (
        <p>Aucune partie enregistrée pour le moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Pseudo</th>
              <th>Mot</th>
              <th>Essais</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.pseudo}</td>
                <td>{score.mot}</td>
                <td>{score.essais}</td>
                <td>{score.points}</td>
                <td>{score.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    </main>
  );
}

export default Scores;
