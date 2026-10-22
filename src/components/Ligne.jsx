// Rôle du fichier : composant d'affichage pour une ligne complète de 5 cases.
// Reçoit une proposition, les couleurs associées et un booléen indiquant si le mot est refusé.

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

  // On crée les 5 cases de la ligne, lettre par lettre, avec leur indice pour l'animation
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
