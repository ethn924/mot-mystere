// Rôle du fichier : composant d'affichage pour une case individuelle de la grille.
// Reçoit une lettre et une couleur (vert, jaune ou gris) et applique la classe CSS correspondante.

function CaseLettre({ lettre, couleur }) {
  let classe = "case-lettre";
  if (couleur === "vert") {
    classe = classe + " case-verte";
  } else if (couleur === "jaune") {
    classe = classe + " case-jaune";
  } else if (couleur === "gris") {
    classe = classe + " case-grise";
  }

  let texte = "";
  if (lettre) {
    texte = lettre;
  }

  return (
    <span className={classe} role="gridcell">
      {texte}
    </span>
  );
}

export default CaseLettre;
