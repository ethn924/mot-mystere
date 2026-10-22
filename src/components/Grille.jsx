import Ligne from "./Ligne.jsx";
import { NOMBRE_ESSAIS } from "../logique/jeu.js";

// La grille complète : affiche toujours 6 lignes fixes
function Grille({ lignesValidees, proposition }) {
  const lignesAffichees = [];

  for (let i = 0; i < NOMBRE_ESSAIS; i++) {
    // 1. Les lignes déjà validées avec leurs couleurs
    if (i < lignesValidees.length) {
      const ligne = lignesValidees[i];
      lignesAffichees.push(
        <Ligne mot={ligne.mot} couleurs={ligne.couleurs} key={i} />
      );
    // 2. La ligne en cours de frappe
    } else if (i === lignesValidees.length) {
      lignesAffichees.push(
        <Ligne mot={proposition} couleurs={[]} key={i} />
      );
    // 3. Les lignes restantes encore vides
    } else {
      lignesAffichees.push(<Ligne mot="" couleurs={[]} key={i} />);
    }
  }

  return (
    <div className="grille" role="grid" aria-label="Grille de jeu">
      {lignesAffichees}
    </div>
  );
}

export default Grille;
