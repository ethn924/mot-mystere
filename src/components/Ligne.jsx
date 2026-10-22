import { LONGUEUR_MOT } from "../logique/jeu.js";
import CaseLettre from "./CaseLettre.jsx";

// Une ligne de la grille : elle affiche exactement 5 cases
function Ligne({ mot, couleurs }) {
  const listeLettre = [];
  let couleursLigne = couleurs;
  if (!couleursLigne) {
    couleursLigne = [];
  }

  let motLigne = mot;
  if (!motLigne) {
    motLigne = "";
  }

  // On crée les 5 cases de la ligne, lettre par lettre
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    listeLettre.push(
      <CaseLettre lettre={motLigne[i]} couleur={couleursLigne[i]} key={i} />
    );
  }

  return (
    <div className="ligne" role="row">
      {listeLettre}
    </div>
  );
}

export default Ligne;
