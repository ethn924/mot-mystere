// Grille : affiche les 6 lignes du jeu.
// Elle choisit pour chaque emplacement : une ligne déjà validée, la ligne en cours de frappe, ou une ligne vide.
// Le compteurRefus sert à relancer l'animation de tremblement à chaque nouveau mot refusé.

import Ligne from "./Ligne.jsx";
import { NOMBRE_ESSAIS } from "../logique/jeu.js";

function Grille({ lignesValidees, proposition, ligneRefusee, compteurRefus }) {
  const lignesAffichees = [];

  for (let i = 0; i < NOMBRE_ESSAIS; i++) {
    // 1. Les lignes déjà validées avec leurs couleurs
    if (i < lignesValidees.length) {
      const ligne = lignesValidees[i];
      lignesAffichees.push(
        <Ligne mot={ligne.mot} couleurs={ligne.couleurs} key={i} />
      );
    // 2. La ligne en cours de frappe. On change la key avec compteurRefus pour forcer le rafraîchissement et relancer le tremblement
    } else if (i === lignesValidees.length) {
      lignesAffichees.push(
        <Ligne
          mot={proposition}
          couleurs={[]}
          estRefusee={ligneRefusee}
          key={"active-" + compteurRefus}
        />
      );
    // 3. Les lignes restantes, encore vides
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
