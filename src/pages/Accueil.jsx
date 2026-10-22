// Rôle du fichier : écran d'accueil du jeu.
// Affiche le titre, les règles simples, le champ pseudo mémorisé dans le localStorage et les accès aux différents écrans.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Récupère le pseudo stocké dans le navigateur lors d'une partie précédente
function lirePseudoSauve() {
  const pseudoSauve = localStorage.getItem("pseudo");
  if (pseudoSauve === null) {
    return "";
  }
  return pseudoSauve;
}

function Accueil() {
  const [pseudo, setPseudo] = useState(lirePseudoSauve);
  const navigate = useNavigate();

  function changerPseudo(event) {
    setPseudo(event.target.value);
  }

  function lancerPartie(event) {
    event.preventDefault();
    // On sauvegarde le pseudo pour s'en souvenir lors des prochaines visites
    localStorage.setItem("pseudo", pseudo);
    navigate("/partie");
  }

  return (
    <main className="page">
      <h1>Le Mot Mystère</h1>
      <p>
        Trouve un mot français de cinq lettres en six essais. Après chaque
        proposition, les lettres passent au vert (bonne place), au jaune
        (présente ailleurs) ou au gris (absente).
      </p>

      <form onSubmit={lancerPartie}>
        <label htmlFor="pseudo">Pseudo</label>
        <input
          id="pseudo"
          type="text"
          value={pseudo}
          onChange={changerPseudo}
        />
        <button type="submit">Nouvelle partie</button>
      </form>

      <nav className="nav-accueil" aria-label="Menu principal">
        <Link to="/scores">Tableau des scores</Link>
        <Link to="/stats">Statistiques</Link>
        <Link to="/regles">Règles du jeu</Link>
      </nav>
    </main>
  );
}

export default Accueil;
