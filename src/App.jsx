// Rôle du fichier : point d'entrée de la navigation React Router.
// Associe chaque écran à sa propre adresse (URL).

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Accueil from "./pages/Accueil.jsx";
import Partie from "./pages/Partie.jsx";
import Scores from "./pages/Scores.jsx";
import Stats from "./pages/Stats.jsx";
import Regles from "./pages/Regles.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/partie" element={<Partie />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/regles" element={<Regles />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
