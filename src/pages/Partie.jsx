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

      // Retour arrière efface la dernière lettre.
      if (touche === "Backspace") {
        setProposition((valeurActuelle) => valeurActuelle.slice(0, -1));
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (touche.length !== 1 || touche === " ") {
        return;
      }

      // setProposition reçoit une fonction pour lire la valeur à jour.
      setProposition((valeurActuelle) => {
        if (valeurActuelle.length < LONGUEUR_MOT) {
          return valeurActuelle + touche;
        }
        return valeurActuelle;
      });
    }

    window.addEventListener("keydown", surTouche);

    // Nettoyage : l'écouteur est retiré quand on quitte l'écran.
    return () => {
      window.removeEventListener("keydown", surTouche);
    };
  }, []);

  return (
    <main>
      <h1>Partie</h1>
      <input type="text" value={proposition} readOnly />
      <Grille proposition={proposition} />
    </main>
  );
}

export default Partie;
