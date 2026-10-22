import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Accueil from "./pages/Accueil.jsx";
import Partie from "./pages/Partie.jsx";

// Définition des routes de l'application avec React Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/partie" element={<Partie />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
