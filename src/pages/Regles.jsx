// Rôle du fichier : écran affichant les règles du jeu avec des exemples illustrés pour chaque couleur.

import { Link } from "react-router-dom";
import CaseLettre from "../components/CaseLettre.jsx";

function Regles() {
  return (
    <main className="page">
      <h1>Règles du jeu</h1>

      <p>
        Le but est de deviner un mot mystère de 5 lettres en 6 essais maximum.
        Chaque proposition doit être un mot français valide existant dans le
        Wiktionnaire.
      </p>

      <h2>Signification des couleurs</h2>

      <div className="exemple-couleur">
        <CaseLettre lettre="A" couleur="vert" />
        <p>
          <strong>Vert :</strong> la lettre est dans le mot et à la bonne place.
        </p>
      </div>

      <div className="exemple-couleur">
        <CaseLettre lettre="R" couleur="jaune" />
        <p>
          <strong>Jaune :</strong> la lettre est dans le mot, mais à une autre place.
        </p>
      </div>

      <div className="exemple-couleur">
        <CaseLettre lettre="B" couleur="gris" />
        <p>
          <strong>Gris :</strong> la lettre n'est pas dans le mot (ou pas autant de fois que proposé).
        </p>
      </div>

      <h2>Barème des points</h2>
      <ul>
        <li>1 essai : 600 points</li>
        <li>2 essais : 500 points</li>
        <li>3 essais : 400 points</li>
        <li>4 essais : 300 points</li>
        <li>5 essais : 200 points</li>
        <li>6 essais : 100 points</li>
        <li>Perdu : 0 point</li>
      </ul>

      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    </main>
  );
}

export default Regles;
