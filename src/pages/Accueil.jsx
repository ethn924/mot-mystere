// Rôle du fichier : écran d'accueil du jeu.
// Affiche le titre, les règles simples, le champ pseudo mémorisé dans le localStorage et le bouton pour lancer la partie.

import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <button type="submit">Jouer</button>
      </form>
    </main>
  );
}

export default Accueil;
