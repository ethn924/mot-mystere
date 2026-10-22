import Ligne from "./Ligne.jsx";
import { NOMBRE_ESSAIS } from "../logique/jeu.js";

// Grille crée une ligne par essai possible, puis les affiche.
function Grille({ proposition }) {
  const lignes = [];
  let motLigne;

  for (let i = 0; i < NOMBRE_ESSAIS; i++) {
    // Seule la première ligne montre la proposition en cours ;
    // les autres restent vides tant que leurs essais n'ont pas eu lieu.
    motLigne = "";
    if (i === 0) {
      motLigne = proposition;
    }
    // La key aide React à reconnaître chaque ligne ; elle ne compte pas les essais.
    lignes.push(<Ligne mot={motLigne} key={i} />);
  }

  return (
    <div className="grille" role="grid" aria-label="Grille de jeu">
      {lignes}
    </div>
  );
}

export default Grille;
