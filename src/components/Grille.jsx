// Rôle du fichier : composant d'affichage pour la grille complète de 6 lignes fixes.
// Construit l'état visuel de chaque ligne : validée, en cours de frappe, ou vide.

import Ligne from "./Ligne.jsx";
import { NOMBRE_ESSAIS } from "../logique/jeu.js";

function Grille({ lignesValidees, proposition, ligneRefusee }) {
  const lignesAffichees = [];

  for (let i = 0; i < NOMBRE_ESSAIS; i++) {
    // 1. Les lignes déjà validées avec leurs couleurs
    if (i < lignesValidees.length) {
      const ligne = lignesValidees[i];
      lignesAffichees.push(
        <Ligne mot={ligne.mot} couleurs={ligne.couleurs} key={i} />
      );
    // 2. La ligne en cours de frappe (qui peut être en erreur visuelle si mot refusé)
    } else if (i === lignesValidees.length) {
      lignesAffichees.push(
        <Ligne
          mot={proposition}
          couleurs={[]}
          estRefusee={ligneRefusee}
          key={i}
        />
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
