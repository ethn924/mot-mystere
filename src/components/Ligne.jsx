import { LONGUEUR_MOT } from "../logique/jeu.js";
import CaseLettre from "./CaseLettre.jsx";

function Ligne({ mot }) {
  let listeLettre = [];

  for (let i = 0; i < LONGUEUR_MOT; i++) {
    listeLettre.push(<CaseLettre lettre={mot[i]} key={i} />);
  }
  return (
    <div className="ligne" role="row">
      {listeLettre}
    </div>
  );
}
export default Ligne
