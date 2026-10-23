// Clavier : clavier virtuel AZERTY à l'écran.
// Les touches se colorent selon ce qu'on sait déjà des lettres (vert > jaune > gris).

const DISPOSITION_TOUCHES = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["ENTREE", "W", "X", "C", "V", "B", "N", "EFFACER"],
];

// surTouche : fonction appelée au clic (vient de Partie).
// statutsLettres : la couleur déjà connue de chaque lettre, ex { A: "vert" }.
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
      } else if (statutsLettres[valeur] === "vert") {
        classeTouche = classeTouche + " touche-verte";
      } else if (statutsLettres[valeur] === "jaune") {
        classeTouche = classeTouche + " touche-jaune";
      } else if (statutsLettres[valeur] === "gris") {
        classeTouche = classeTouche + " touche-grise";
      }

      let libelle = valeur;
      if (valeur === "EFFACER") {
        libelle = "\u232B"; // symbole de la touche effacer
      }

      touchesRangee.push(
        <button
          type="button"
          // React a besoin d'une key unique pour chaque élément d'une liste.
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
