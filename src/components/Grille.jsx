import Ligne from "./Ligne.jsx";
import { NOMBRE_ESSAIS } from "../logique/jeu.js";

function Grille() {
  const lignes = [];

  for (let i = 0; i < NOMBRE_ESSAIS; i++) {
    lignes.push(<Ligne mot="" key={i} />);
  }

  return (
    <div className="grille" role="grid" aria-label="Grille de jeu">
      {lignes}
    </div>
  );
}

export default Grille;
