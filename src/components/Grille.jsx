import Ligne from "./Ligne.jsx";
import { NOMBRE_ESSAIS } from "../logique/jeu.js";

function Grille({ proposition }) {
  const lignes = [];

  for (let i = 0; i < NOMBRE_ESSAIS; i++) {
    let motLigne = "";
    if (i === 0) {
      motLigne = proposition;
    }
    lignes.push(<Ligne mot={motLigne} key={i} />);
  }

  return (
    <div className="grille" role="grid" aria-label="Grille de jeu">
      {lignes}
    </div>
  );
}

export default Grille;
