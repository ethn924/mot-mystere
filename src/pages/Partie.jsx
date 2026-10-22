// Partie : écran principal du jeu.
// Gère l'état d'une partie : le mot mystère, la proposition en cours, les lignes validées,
// l'appel au Wiktionnaire, les points et l'enregistrement de la partie finie.

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
  // proposition : ce que le joueur tape lettre par lettre
  const [proposition, setProposition] = useState("");
  // motMystere : le mot à trouver, tiré au hasard au démarrage
  const [motMystere, setMotMystere] = useState(tirerPremierMot);
  // lignes : historique des propositions validées avec leurs couleurs
  const [lignes, setLignes] = useState([]);
  // enChargement : bloque les saisies pendant l'appel API
  const [enChargement, setEnChargement] = useState(false);
  // message : affiche un avis au joueur (mot refuse, dictionnaire indisponible...)
  const [message, setMessage] = useState("");
  // ligneRefusee : declenche l'animation de tremblement si le mot n'est pas dans le dictionnaire
  const [ligneRefusee, setLigneRefusee] = useState(false);
  // compteurRefus : change la key de la ligne active pour relancer le tremblement a chaque refus
  const [compteurRefus, setCompteurRefus] = useState(0);

  // Vérifie si la partie est terminée (victoire ou défaite)
  const finie = partieEstFinie(lignes);
  let gagne = false;
  if (lignes.length > 0) {
    const derniereLigne = lignes[lignes.length - 1];
    gagne = estGagne(derniereLigne.couleurs);
  }
  const points = calculerPoints(lignes.length, gagne);
  const statutsLettres = calculerStatutsLettres(lignes);

  // gere toutes les saisies : clavier physique et clavier virtuel
  async function traiterTouche(touche) {
    // on ignore tout si la partie est finie ou si on attend la réponse de l'API
    if (finie || enChargement) {
      return;
    }

    // validation de la ligne complète (touche Entrée)
    if (touche === "Enter" || touche === "ENTREE") {
      if (proposition.length === LONGUEUR_MOT) {
        setEnChargement(true);
        setMessage("Vérification dans le dictionnaire...");
        setLigneRefusee(false);

        const resultat = await verifierMotWiktionnaire(proposition);
        setEnChargement(false);

        // mot refusé : il ne compte pas comme un essai, la ligne tremble
        if (!resultat.valide) {
          setMessage("Ce mot n'est pas dans le dictionnaire.");
          setLigneRefusee(true);
          setCompteurRefus((c) => c + 1);
          return;
        }

        // si l'API est en panne, on accepte le mot pour ne pas bloquer le joueur
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

        // si c'était le dernier coup, on enregistre le score
        if (partieEstFinie(nouvellesLignes)) {
          const partieGagnee = estGagne(couleurs);
          const pointsObtenus = calculerPoints(nouvellesLignes.length, partieGagnee);
          const pseudo = localStorage.getItem("pseudo") || "Anonyme";
          enregistrerPartie(pseudo, motMystere, nouvellesLignes.length, pointsObtenus);
        }
      }
      return;
    }

    // suppression de la dernière lettre (touche Retour arrière ou Effacer)
    if (touche === "Backspace" || touche === "EFFACER") {
      setMessage("");
      setLigneRefusee(false);
      setProposition(retirerDerniereLettre);
      return;
    }

    // ajout d'une lettre à la proposition, si on n'a pas déjà 5 lettres
    const lettre = normaliserMot(touche);
    if (lettre.length !== 1) {
      return;
    }

    setMessage("");
    setLigneRefusee(false);
    setProposition(ajouterLettre(lettre));
  }

  // écoute les touches du clavier physique
  useEffect(() => {
    function surTouche(event) {
      // on ignore les raccourcis navigateur (Ctrl, Cmd, Alt)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      traiterTouche(event.key);
    }

    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  });

  // remet tout à zéro pour recommencer une nouvelle partie
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
      <h1>Le Mot Mystere</h1>

      <Grille
        lignesValidees={lignes}
        proposition={proposition}
        ligneRefusee={ligneRefusee}
        compteurRefus={compteurRefus}
      />

      {enChargement ? (
        <p className="message-chargement">Verification dans le dictionnaire...</p>
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

// supprime le dernier caractère d'une chaîne
function retirerDerniereLettre(valeurActuelle) {
  return valeurActuelle.slice(0, -1);
}

// ajoute une lettre à la fin si la proposition n'est pas pleine
function ajouterLettre(lettre) {
  return function ajouterSiPlace(valeurActuelle) {
    if (valeurActuelle.length < LONGUEUR_MOT) {
      return valeurActuelle + lettre;
    }
    return valeurActuelle;
  };
}

export default Partie;
