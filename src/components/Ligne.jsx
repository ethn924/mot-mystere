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

  // On fabrique les 5 cases une par une, avec l'indice pour le délai d'animation
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

  // Si le mot a été refusé par le dictionnaire, on ajoute la classe pour faire trembler la ligne
  let classeLigne = "ligne";
  if (estRefusee) {
    classeLigne = classeLigne + " ligne-refusee";
  }

  return (
    <div className={classeLigne} role="row">
      {listeLettre}
    </div>
  );
}

export default Ligne;
