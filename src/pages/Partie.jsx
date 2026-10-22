import Grille from "../components/Grille.jsx";
import { useState, useEffect } from "react";
import { LONGUEUR_MOT } from "../logique/jeu.js";

function Partie() {
  const [proposition, setProposition] = useState("");

  useEffect(() => {
    function surTouche(event) {
      const touche = event.key;

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (touche.length !== 1 || touche === " ") {
        return;
      }

      setProposition((valeurActuelle) => {
        if (valeurActuelle.length < LONGUEUR_MOT) {
          return valeurActuelle + touche;
        }
        return valeurActuelle;
      });
    }

    window.addEventListener("keydown", surTouche);

    return () => {
      window.removeEventListener("keydown", surTouche);
    };
  }, []);

  return (
    <main>
      <h1>Partie</h1>
      <input
        type="text"
        value={proposition}
        readOnly
      />
      <Grille proposition={proposition} />
    </main>
  );
}

export default Partie;
