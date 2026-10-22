// Rôle du fichier : composant d'affichage pour le clavier virtuel à l'écran.
// Permet de jouer à la souris ou au tactile. Les touches prennent la couleur de ce qu'on sait déjà de chaque lettre.

const DISPOSITION_TOUCHES = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["ENTREE", "W", "X", "C", "V", "B", "N", "EFFACER"],
];

function Clavier({ surTouche, statutsLettres }) {
  const rangeesAffichees = [];

  for (let r = 0; r < DISPOSITION_TOUCHES.length; r++) {
    const rangee = DISPOSITION_TOUCHES[r];
    const touchesRangee = [];

    for (let t = 0; t < rangee.length; t++) {
      const valeur = rangee[t];
      let classeTouche = "touche";

      if (valeur === "ENTREE" || valeur === "EFFACER") {
        classeTouche = classeTouche + " touche-speciale";
      } else {
        const statut = statutsLettres[valeur];
        if (statut === "vert") {
          classeTouche = classeTouche + " touche-verte";
        } else if (statut === "jaune") {
          classeTouche = classeTouche + " touche-jaune";
        } else if (statut === "gris") {
          classeTouche = classeTouche + " touche-grise";
        }
      }

      let libelle = valeur;
      if (valeur === "EFFACER") {
        libelle = "⌫";
      }

      touchesRangee.push(
        <button
          type="button"
          key={valeur}
          className={classeTouche}
          onClick={() => surTouche(valeur)}
        >
          {libelle}
        </button>
      );
    }

    rangeesAffichees.push(
      <div className="rangee-clavier" key={r}>
        {touchesRangee}
      </div>
    );
  }

  return <section className="clavier" aria-label="Clavier à l'écran">{rangeesAffichees}</section>;
}

export default Clavier;
