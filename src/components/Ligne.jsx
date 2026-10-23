// Ligne : regroupe 5 cases CaseLettre pour former une ligne complète.
// Elle reçoit le mot en cours, les couleurs si la ligne est validée, et un booléen pour le tremblement.

import { LONGUEUR_MOT } from "../logique/jeu.js";
import CaseLettre from "./CaseLettre.jsx";

function Ligne({ mot, couleurs, estRefusee }) {
  const listeLettre = [];
  let couleursLigne = couleurs;
  if (!couleursLigne) {
    couleursLigne = [];
  }
  let motLigne = mot;
  if (!motLigne) {
    motLigne = "";
  }

  for (let i = 0; i < LONGUEUR_MOT; i++) {
    listeLettre.push(
      <CaseLettre
        lettre={motLigne[i]}
        couleur={couleursLigne[i]}
        index={i}
        key={i}
      />
    );
  }

  // Mot refusé par le dictionnaire : la ligne tremble
  let classeLigne = "ligne";
  if (estRefusee) {
    classeLigne = "ligne ligne-refusee";
  }

  return (
    <div className={classeLigne} role="row">
      {listeLettre}
    </div>
  );
}

export default Ligne;
