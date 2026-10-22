// Stats : affiche les statistiques personnelles du joueur (taux de victoire, séries, points, répartition par essai).
// Données lues depuis le localStorage.

import { Link } from "react-router-dom";
import { lireStats } from "../logique/scores.js";

function Stats() {
  const stats = lireStats();

  // pourcentage de victoires arrondi à l'entier
  let pourcentageVictoires = 0;
  if (stats.partiesJouees > 0) {
    pourcentageVictoires = Math.round(
      (stats.victoires / stats.partiesJouees) * 100
    );
  }

  return (
    <main className="page page-large">
      <header className="page-header">
        <h1>Statistiques du joueur</h1>
        <p className="sous-titre">Tes performances et records enregistrés sur cet ordinateur.</p>
      </header>

      <div className="grille-stats">
        {/* Colonne 1 : chiffres clés (parties, victoires, séries, points) */}
        <section className="bloc-panneau">
          <h2>Indicateurs généraux</h2>
          <div className="grille-chiffres-cles">
            <div className="chiffre-carte">
              <span className="chiffre-valeur">{stats.partiesJouees}</span>
              <span className="chiffre-libelle">Parties jouées</span>
            </div>
            <div className="chiffre-carte">
              <span className="chiffre-valeur">{pourcentageVictoires}%</span>
              <span className="chiffre-libelle">Victoires ({stats.victoires})</span>
            </div>
            <div className="chiffre-carte">
              <span className="chiffre-valeur">{stats.serieActuelle}</span>
              <span className="chiffre-libelle">Série en cours</span>
            </div>
            <div className="chiffre-carte">
              <span className="chiffre-valeur">{stats.meilleureSerie}</span>
              <span className="chiffre-libelle">Record de série</span>
            </div>
            <div className="chiffre-carte chiffre-carte-large">
              <span className="chiffre-valeur">{stats.totalPoints}</span>
              <span className="chiffre-libelle">Total des points cumulés</span>
            </div>
          </div>
        </section>

        {/* Colonne 2 : combien de victoires en 1, 2, 3... essais */}
        <section className="bloc-panneau">
          <h2>Répartition par essai</h2>
          <table className="table-bareme">
            <thead>
              <tr>
                <th>Essais</th>
                <th>Victoires</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1 essai (600 pts)</td><td><strong>{stats.repartition[1]}</strong></td></tr>
              <tr><td>2 essais (500 pts)</td><td><strong>{stats.repartition[2]}</strong></td></tr>
              <tr><td>3 essais (400 pts)</td><td><strong>{stats.repartition[3]}</strong></td></tr>
              <tr><td>4 essais (300 pts)</td><td><strong>{stats.repartition[4]}</strong></td></tr>
              <tr><td>5 essais (200 pts)</td><td><strong>{stats.repartition[5]}</strong></td></tr>
              <tr><td>6 essais (100 pts)</td><td><strong>{stats.repartition[6]}</strong></td></tr>
            </tbody>
          </table>
        </section>
      </div>

      <footer className="pied-page-action">
        <Link to="/">Retour à l'accueil</Link>
      </footer>
    </main>
  );
}

export default Stats;
