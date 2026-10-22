import Grille from "../components/Grille.jsx";
import { useState } from "react";

function Partie() {
  const [proposition, setProposition] = useState("");

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
