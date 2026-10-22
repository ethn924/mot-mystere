// Rôle du fichier : composant d'affichage pour une case individuelle de la grille.
// Reçoit une lettre, une couleur (vert, jaune ou gris) et un délai d'animation éventuel.

function CaseLettre({ lettre, couleur, index }) {
  let classe = "case-lettre";
  let style = {};

  // Si une lettre est tapée mais pas encore validée, on applique une petite animation d'apparition pop
  if (lettre && !couleur) {
    classe = classe + " case-remplie";
  }

  // Dès que la ligne est validée, on applique la couleur et l'animation de retournement avec décalage
  if (couleur === "vert") {
    classe = classe + " case-verte case-animee";
    style = { animationDelay: index * 0.15 + "s" };
  } else if (couleur === "jaune") {
    classe = classe + " case-jaune case-animee";
    style = { animationDelay: index * 0.15 + "s" };
  } else if (couleur === "gris") {
    classe = classe + " case-grise case-animee";
    style = { animationDelay: index * 0.15 + "s" };
  }

  let texte = "";
  if (lettre) {
    texte = lettre;
  }

  return (
    <span className={classe} style={style} role="gridcell">
      {texte}
    </span>
  );
}

export default CaseLettre;
