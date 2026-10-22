// Rôle du fichier : écran d'accueil du jeu.
// Affiche la présentation personnalisée d'Ethan, le rappel visuel des règles, le champ pseudo et les accès aux autres pages.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Récupère le pseudo stocké dans le navigateur lors d'une partie précédente
function lirePseudoSauve() {
  const pseudoSauve = localStorage.getItem("pseudo");
  if (pseudoSauve === null) {
    return "";
  }
  return pseudoSauve;
}

function Accueil() {
  const [pseudo, setPseudo] = useState(lirePseudoSauve);
  const navigate = useNavigate();

  function changerPseudo(event) {
    setPseudo(event.target.value);
  }

  function lancerPartie(event) {
    event.preventDefault();
    // On sauvegarde le pseudo pour s'en souvenir lors des prochaines visites
    localStorage.setItem("pseudo", pseudo);
    navigate("/partie");
  }

  return (
    <main className="page page-accueil">
      <header className="accueil-entete">
        <h1>Le Mot Mystère</h1>
        <p className="sous-titre">
          Bienvenue sur mon jeu de lettres en React ! Mets ton vocabulaire à
          l'épreuve et trouve le mot secret en 6 essais maximum.
        </p>
      </header>

      {/* Cartes d'aperçu rapide des règles pour habiller la page */}
      <section className="cartes-apercu" aria-label="Aperçu des règles">
        <div className="carte-mini">
          <span className="pastille pastille-verte"></span>
          <div>
            <strong>Bien placé</strong>
            <small>La lettre est dans le mot, au bon endroit.</small>
          </div>
        </div>
        <div className="carte-mini">
          <span className="pastille pastille-jaune"></span>
          <div>
            <strong>Mal placé</strong>
            <small>La lettre est dans le mot, mais ailleurs.</small>
          </div>
        </div>
        <div className="carte-mini">
          <span className="pastille pastille-grise"></span>
          <div>
            <strong>Absent</strong>
            <small>La lettre n'est pas dans le mot secret.</small>
          </div>
        </div>
      </section>

      {/* Formulaire de lancement */}
      <section className="zone-lancement">
        <form onSubmit={lancerPartie}>
          <label htmlFor="pseudo">Choisis ton pseudo pour le classement</label>
          <div className="groupe-saisie">
            <input
              id="pseudo"
              type="text"
              placeholder="Ex: Ethan, Joueur1..."
              value={pseudo}
              onChange={changerPseudo}
              maxLength={20}
              required
            />
            <button type="submit">Lancer une partie</button>
          </div>
        </form>
      </section>

      {/* Liens de navigation secondaire */}
      <footer className="accueil-pied">
        <nav className="nav-accueil" aria-label="Menu principal">
          <Link to="/scores">
            <span>Tableau des scores</span>
          </Link>
          <Link to="/stats">
            <span>Mes statistiques</span>
          </Link>
          <Link to="/regles">
            <span>Règles complètes</span>
          </Link>
        </nav>
      </footer>
    </main>
  );
}

export default Accueil;
