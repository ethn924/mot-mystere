import Grille from "../components/Grille.jsx";
import { useState, useEffect } from "react";
import { LONGUEUR_MOT } from "../logique/jeu.js";

// Partie affiche la grille : c'est le point de départ de l'écran de jeu.
function Partie() {
  // proposition contient les lettres tapées par le joueur, dans l'ordre.
  const [proposition, setProposition] = useState("");

  useEffect(() => {
    // surTouche est appelée à chaque pression d'une touche.
    function surTouche(event) {
      const touche = event.key;

      // Retour arrière efface la dernière lettre ; slice(0, -1) garde le reste.
      if (touche === "Backspace") {
        setProposition((valeurActuelle) => valeurActuelle.slice(0, -1));
        return;
      }

      // Les raccourcis du navigateur (Ctrl, Cmd) ne font pas partie du jeu.
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      // Seules les lettres sont acceptées : ni espace, ni Entrée, ni flèches.
      if (touche.length !== 1 || touche === " ") {
        return;
      }

      // setProposition reçoit une fonction ; elle reçoit la proposition
      // du moment, pas une valeur périmée.
      setProposition((valeurActuelle) => {
        if (valeurActuelle.length < LONGUEUR_MOT) {
          return valeurActuelle + touche;
        }
        return valeurActuelle;
      });
    }

    window.addEventListener("keydown", surTouche);

    // Nettoyage : l'écouteur est retiré quand on quitte l'écran de jeu.
    return () => {
      window.removeEventListener("keydown", surTouche);
    };
  }, []);

  return (
    <main>
      <h1>Partie</h1>
      <input
        type="text"
        // Le champ montre la proposition en cours ; la saisie se fait au clavier.
        value={proposition}
        readOnly
      />
      <Grille proposition={proposition} />
    </main>
  );
}

export default Partie;
