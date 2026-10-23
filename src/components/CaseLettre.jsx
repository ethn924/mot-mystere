// CaseLettre : une seule case de la grille.
// Elle affiche une lettre, et change de classe CSS quand le mot est validé (vert / jaune / gris).

function CaseLettre({ lettre, couleur, index }) {
  let classe = "case-lettre";
  let style = {};
  let texte = "";
  if (lettre) {
    texte = lettre;
  }

  // Lettre tapée mais pas encore validée : petit effet d'apparition
  if (lettre && !couleur) {
    classe = classe + " case-remplie";
  }

  if (couleur === "vert") {
    classe = classe + " case-verte";
  } else if (couleur === "jaune") {
    classe = classe + " case-jaune";
  } else if (couleur === "gris") {
    classe = classe + " case-grise";
  }

  // Ligne validée : chaque case se retourne un peu après la précédente
  if (couleur) {
    classe = classe + " case-animee";
    style = { animationDelay: index * 0.15 + "s" };
  }

  return (
    <span className={classe} style={style} role="gridcell">
      {texte}
    </span>
  );
}

export default CaseLettre;
