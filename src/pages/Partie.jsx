// Rôle du fichier : écran principal de jeu.
// Gère l'état d'une partie (propositions, mot mystère, lignes validées, vérification API et fin de partie).

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Grille from "../components/Grille.jsx";
import {
  LONGUEUR_MOT,
  tirerMotAleatoire,
  comparer,
  estGagne,
  calculerPoints,
  partieEstFinie,
  normaliserMot,
} from "../logique/jeu.js";
import { verifierMotWiktionnaire } from "../logique/wiktionnaire.js";
import motsSolutions from "../data/mots-solutions.json";

function Partie() {
  // Lettres en cours de saisie par le joueur sur la ligne active
  const [proposition, setProposition] = useState("");
  // Mot mystère tiré au sort au chargement de la partie (garde ses accents)
  const [motMystere, setMotMystere] = useState(tirerPremierMot);
  // Historique des lignes jouées : tableau d'objets { mot, couleurs }
  const [lignes, setLignes] = useState([]);
  // Indique si une requête vers le Wiktionnaire est en cours
  const [enChargement, setEnChargement] = useState(false);
  // Message d'erreur ou d'information pour le joueur
  const [message, setMessage] = useState("");
  // Active l'animation visuelle de refus sur la ligne en cours
  const [ligneRefusee, setLigneRefusee] = useState(false);

  // Calcul de l'état de la partie à partir de la liste des lignes
  const finie = partieEstFinie(lignes);
  let gagne = false;
  if (lignes.length > 0) {
    const derniereLigne = lignes[lignes.length - 1];
    gagne = estGagne(derniereLigne.couleurs);
  }
  const points = calculerPoints(lignes.length, gagne);

  // Gestion du clavier physique avec keydown
  useEffect(() => {
    async function surTouche(event) {
      // Si la partie est terminée ou qu'on attend l'API, on bloque les touches
      if (finie || enChargement) {
        return;
      }

      const touche = event.key;

      // Entrée valide la ligne si elle a 5 lettres
      if (touche === "Enter") {
        if (proposition.length === LONGUEUR_MOT) {
          setEnChargement(true);
          setMessage("Vérification dans le dictionnaire...");
          setLigneRefusee(false);

          const resultat = await verifierMotWiktionnaire(proposition);

          setEnChargement(false);

          // Cas 1 : mot refusé (inconnu dans le Wiktionnaire)
          if (!resultat.valide) {
            setMessage("Ce mot n'est pas dans le dictionnaire.");
            setLigneRefusee(true);
            return;
          }

          // Cas 2 : l'API était indisponible mais on laisse jouer
          if (resultat.erreurApi) {
            setMessage("Dictionnaire injoignable, mot accepté par défaut.");
          } else {
            setMessage("");
          }

          setLigneRefusee(false);
          const couleurs = comparer(motMystere, proposition);
          setLignes(ajouterLigne(proposition, couleurs));
          setProposition("");
        }
        return;
      }

      // Dès qu'on retape ou efface, on retire l'avertissement
      if (touche === "Backspace") {
        setMessage("");
        setLigneRefusee(false);
        setProposition(retirerDerniereLettre);
        return;
      }

      // On ignore les raccourcis navigateur (Ctrl, Alt, Cmd)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      // On vérifie que c'est bien une lettre de l'alphabet
      const lettre = normaliserMot(touche);
      if (lettre.length !== 1) {
        return;
      }

      setMessage("");
      setLigneRefusee(false);
      setProposition(ajouterLettre(lettre));
    }

    window.addEventListener("keydown", surTouche);
    // Nettoyage de l'écouteur d'événement à chaque mise à jour ou démontage
    return () => window.removeEventListener("keydown", surTouche);
  }, [proposition, motMystere, finie, enChargement]);

  // Relance une nouvelle partie avec un nouveau mot
  function rejouer() {
    setProposition("");
    setLignes([]);
    setMessage("");
    setLigneRefusee(false);
    setEnChargement(false);
    setMotMystere(tirerMotAleatoire(motsSolutions));
  }

  // Écran affiché uniquement quand la partie est gagnée ou perdue
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
          <a
            href={lienWiktionnaire}
            target="_blank"
            rel="noreferrer"
          >
            {motMystere} sur le Wiktionnaire
          </a>
        </p>
        <p>Points : {points}</p>
        <button type="button" onClick={rejouer}>
          Rejouer
        </button>
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
      />

      {enChargement ? (
        <p className="message-chargement">Vérification dans le dictionnaire...</p>
      ) : null}

      {message && !enChargement ? (
        <p className="message-avertissement">{message}</p>
      ) : null}

      {ecranFin}
    </main>
  );
}

function tirerPremierMot() {
  return tirerMotAleatoire(motsSolutions);
}

// Ajoute la nouvelle ligne jouée à l'historique sans modifier l'ancien tableau
function ajouterLigne(mot, couleurs) {
  return function copierAvecNouvelleLigne(lignesActuelles) {
    const nouvellesLignes = [];
    for (let i = 0; i < lignesActuelles.length; i++) {
      nouvellesLignes.push(lignesActuelles[i]);
    }
    nouvellesLignes.push({
      mot: mot,
      couleurs: couleurs,
    });
    return nouvellesLignes;
  };
}

// Retire le dernier caractère de la proposition en cours
function retirerDerniereLettre(valeurActuelle) {
  return valeurActuelle.slice(0, -1);
}

// Ajoute une lettre si la ligne n'est pas déjà pleine (5 lettres max)
function ajouterLettre(lettre) {
  return function ajouterSiPlace(valeurActuelle) {
    if (valeurActuelle.length < LONGUEUR_MOT) {
      return valeurActuelle + lettre;
    }
    return valeurActuelle;
  };
}

export default Partie;
