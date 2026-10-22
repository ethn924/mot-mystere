import { LONGUEUR_MOT } from '../logique/jeu.js'
import CaseLettre from './CaseLettre.jsx'

// Ligne crée cinq cases et transmet une lettre à chacune.
function Ligne({ mot }) {
  let listeLettre = []

  // LONGUEUR_MOT garantit cinq cases, même si le mot reçu est vide.
  for (let i = 0; i < LONGUEUR_MOT; i++) {
    // i est la position ; mot[i] est la lettre transmise à CaseLettre.
    listeLettre.push(<CaseLettre lettre={mot[i]} key={i} />)
  }
  return (
    <div className="ligne" role="row">
      {listeLettre}
    </div>
  )
}
export default Ligne
