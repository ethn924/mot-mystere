// Rôle du fichier : écran affichant les statistiques personnelles du joueur.
// Parties jouées, pourcentage de victoires, séries et répartition des essais.

import { Link } from "react-router-dom";
import { lireStats } from "../logique/scores.js";

function Stats() {
  const stats = lireStats();

  let pourcentageVictoires = 0;
  if (stats.partiesJouees > 0) {
    pourcentageVictoires = Math.round(
      (stats.victoires / stats.partiesJouees) * 100
    );
  }

  return (
    <main className="page">
      <h1>Statistiques du joueur</h1>

      <ul>
        <li>Parties jouées : {stats.partiesJouees}</li>
        <li>Victoires : {stats.victoires} ({pourcentageVictoires}%)</li>
        <li>Série en cours : {stats.serieActuelle}</li>
        <li>Meilleure série : {stats.meilleureSerie}</li>
        <li>Total des points : {stats.totalPoints}</li>
      </ul>

      <h2>Répartition des victoires par essai</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre d'essais</th>
            <th>Victoires</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1 essai (600 pts)</td><td>{stats.repartition[1]}</td></tr>
          <tr><td>2 essais (500 pts)</td><td>{stats.repartition[2]}</td></tr>
          <tr><td>3 essais (400 pts)</td><td>{stats.repartition[3]}</td></tr>
          <tr><td>4 essais (300 pts)</td><td>{stats.repartition[4]}</td></tr>
          <tr><td>5 essais (200 pts)</td><td>{stats.repartition[5]}</td></tr>
          <tr><td>6 essais (100 pts)</td><td>{stats.repartition[6]}</td></tr>
        </tbody>
      </table>

      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    </main>
  );
}

export default Stats;
