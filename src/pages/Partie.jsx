// Rôle du fichier : écran principal de jeu.
// Gère l'état d'une partie (clavier physique + virtuel, vérification API, animations, points et enregistrement).

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Grille from "../components/Grille.jsx";
import Clavier from "../components/Clavier.jsx";
import {
  LONGUEUR_MOT,
  tirerMotAleatoire,
  comparer,
  estGagne,
  calculerPoints,
  partieEstFinie,
  normaliserMot,
  calculerStatutsLettres,
} from "../logique/jeu.js";
import { verifierMotWiktionnaire } from "../logique/wiktionnaire.js";
import { enregistrerPartie } from "../logique/scores.js";
import motsSolutions from "../data/mots-solutions.json";

function Partie() {
  const [proposition, setProposition] = useState("");
  const [motMystere, setMotMystere] = useState(tirerPremierMot);
  const [lignes, setLignes] = useState([]);
  const [enChargement, setEnChargement] = useState(false);
  const [message, setMessage] = useState("");
  const [ligneRefusee, setLigneRefusee] = useState(false);
  const [compteurRefus, setCompteurRefus] = useState(0);

  const finie = partieEstFinie(lignes);
  let gagne = false;
  if (lignes.length > 0) {
    const derniereLigne = lignes[lignes.length - 1];
    gagne = estGagne(derniereLigne.couleurs);
  }
  const points = calculerPoints(lignes.length, gagne);
  const statutsLettres = calculerStatutsLettres(lignes);

  // Traite une saisie venant soit du clavier physique soit du clavier virtuel
  async function traiterTouche(touche) {
    if (finie || enChargement) {
      return;
    }

    if (touche === "Enter" || touche === "ENTREE") {
      if (proposition.length === LONGUEUR_MOT) {
        setEnChargement(true);
        setMessage("Vérification dans le dictionnaire...");
        setLigneRefusee(false);

        const resultat = await verifierMotWiktionnaire(proposition);
        setEnChargement(false);

        if (!resultat.valide) {
          setMessage("Ce mot n'est pas dans le dictionnaire.");
          setLigneRefusee(true);
          setCompteurRefus((c) => c + 1);
          return;
        }

        if (resultat.erreurApi) {
          setMessage("Dictionnaire injoignable, mot accepté par défaut.");
        } else {
          setMessage("");
        }

        setLigneRefusee(false);
        const couleurs = comparer(motMystere, proposition);
        const nouvellesLignes = [...lignes, { mot: proposition, couleurs: couleurs }];
        setLignes(nouvellesLignes);
        setProposition("");

        // Si la partie vient de se terminer avec ce coup, on enregistre le score
        if (partieEstFinie(nouvellesLignes)) {
          const partieGagnee = estGagne(couleurs);
          const pointsObtenus = calculerPoints(nouvellesLignes.length, partieGagnee);
          const pseudo = localStorage.getItem("pseudo") || "Anonyme";
          enregistrerPartie(pseudo, motMystere, nouvellesLignes.length, pointsObtenus);
        }
      }
      return;
    }

    if (touche === "Backspace" || touche === "EFFACER") {
      setMessage("");
      setLigneRefusee(false);
      setProposition(retirerDerniereLettre);
      return;
    }

    const lettre = normaliserMot(touche);
    if (lettre.length !== 1) {
      return;
    }

    setMessage("");
    setLigneRefusee(false);
    setProposition(ajouterLettre(lettre));
  }

  // Écouteur clavier physique
  useEffect(() => {
    function surTouche(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      traiterTouche(event.key);
    }

    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  });

  function rejouer() {
    setProposition("");
    setLignes([]);
    setMessage("");
    setLigneRefusee(false);
    setEnChargement(false);
    setMotMystere(tirerMotAleatoire(motsSolutions));
  }

  let ecranFin = null;
  if (finie) {
    let texteResultat = "Bravo, tu as trouvé le mot !";
    if (!gagne) {
      texteResultat = "Perdu. Le mot était : " + motMystere;
    }

    const lienWiktionnaire =
      "https://fr.wiktionary.org/wiki/" + encodeURIComponent(motMystere);

    ecranFin = (
      <section className="ecran-fin">
        <p>{texteResultat}</p>
        <p>
          Définition :{" "}
          <a href={lienWiktionnaire} target="_blank" rel="noreferrer">
            {motMystere} sur le Wiktionnaire
          </a>
        </p>
        <p>Points : {points}</p>
        <button type="button" onClick={rejouer}>
          Rejouer
        </button>
        <Link to="/scores">Voir les scores</Link>
        <Link to="/">Accueil</Link>
      </section>
    );
  }

  return (
    <main className="page">
      <h1>Le Mot Mystère</h1>

      <Grille
        lignesValidees={lignes}
        proposition={proposition}
        ligneRefusee={ligneRefusee}
        compteurRefus={compteurRefus}
      />

      {enChargement ? (
        <p className="message-chargement">Vérification dans le dictionnaire...</p>
      ) : null}

      {message && !enChargement ? (
        <p className="message-avertissement">{message}</p>
      ) : null}

      <Clavier surTouche={traiterTouche} statutsLettres={statutsLettres} />

      {ecranFin}
    </main>
  );
}

function tirerPremierMot() {
  return tirerMotAleatoire(motsSolutions);
}

function retirerDerniereLettre(valeurActuelle) {
  return valeurActuelle.slice(0, -1);
}

function ajouterLettre(lettre) {
  return function ajouterSiPlace(valeurActuelle) {
    if (valeurActuelle.length < LONGUEUR_MOT) {
      return valeurActuelle + lettre;
    }
    return valeurActuelle;
  };
}

export default Partie;
