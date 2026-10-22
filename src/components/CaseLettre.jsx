// CaseLettre : une seule case de la grille.
// Elle affiche une lettre, et change de classe CSS quand le mot est validé (vert / jaune / gris).
// L'index sert à décaler l'animation pour que les cases ne tournent pas toutes en même temps.

function CaseLettre({ lettre, couleur, index }) {
  let classe = "case-lettre";
  let style = {};

  // Lettre en cours de frappe, pas encore validée -> petit effet d'apparition
  if (lettre && !couleur) {
    classe = classe + " case-remplie";
  }

  // Ligne validée : on ajoute la couleur et l'animation de retournement
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
