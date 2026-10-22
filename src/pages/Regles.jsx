// Rôle du fichier : écran affichant les règles du jeu avec des exemples illustrés pour chaque couleur.
// Mise en page en colonnes horizontales compactes pour éviter tout défilement d'écran.

import { Link } from "react-router-dom";
import CaseLettre from "../components/CaseLettre.jsx";

function Regles() {
  return (
    <main className="page page-large">
      <header className="page-header">
        <h1>Règles du jeu</h1>
        <p className="sous-titre">
          Trouve un mot mystère de 5 lettres en 6 essais. Chaque proposition doit être un mot français reconnu par le Wiktionnaire.
        </p>
      </header>

      {/* Disposition en deux colonnes équilibrées */}
      <div className="grille-regles">
        {/* Colonne 1 : Les 3 couleurs expliquées avec leurs cases */}
        <section className="bloc-panneau">
          <h2>Signification des couleurs</h2>
          <div className="liste-exemples">
            <div className="exemple-couleur">
              <CaseLettre lettre="A" couleur="vert" />
              <div>
                <strong>Vert (Bien placé)</strong>
                <p>La lettre est dans le mot et exactement à cette place.</p>
              </div>
            </div>

            <div className="exemple-couleur">
              <CaseLettre lettre="R" couleur="jaune" />
              <div>
                <strong>Jaune (Mal placé)</strong>
                <p>La lettre est dans le mot, mais à une autre place.</p>
              </div>
            </div>

            <div className="exemple-couleur">
              <CaseLettre lettre="B" couleur="gris" />
              <div>
                <strong>Gris (Absent)</strong>
                <p>La lettre n'est pas dans le mot (ou pas autant de fois).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Colonne 2 : Le barème officiel sous forme de tableau compact */}
        <section className="bloc-panneau">
          <h2>Barème officiel des points</h2>
          <table className="table-bareme">
            <thead>
              <tr>
                <th>Essai</th>
                <th>Points rapportés</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1er essai</td><td><strong>600 pts</strong></td></tr>
              <tr><td>2ème essai</td><td><strong>500 pts</strong></td></tr>
              <tr><td>3ème essai</td><td><strong>400 pts</strong></td></tr>
              <tr><td>4ème essai</td><td><strong>300 pts</strong></td></tr>
              <tr><td>5ème essai</td><td><strong>200 pts</strong></td></tr>
              <tr><td>6ème essai</td><td><strong>100 pts</strong></td></tr>
              <tr><td>Perdu (non trouvé)</td><td><strong>0 pt</strong></td></tr>
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

export default Regles;
