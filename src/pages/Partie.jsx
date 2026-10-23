// Partie : écran principal du jeu.
// Gère l'état d'une partie : le mot mystère, la proposition en cours, les lignes validées,
// l'appel au Wiktionnaire, les points et l'enregistrement de la partie finie.

import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Grille from "../components/Grille.jsx";
import Clavier from "../components/Clavier.jsx";
import {
  LONGUEUR_MOT,
  tirerMotAleatoire,
  choisirMotDuJour,
  comparer,
  estGagne,
  calculerPoints,
  partieEstFinie,
  normaliserMot,
  calculerStatutsLettres,
  tempsRestantAvantMinuit,
} from "../logique/jeu.js";
import { verifierMotWiktionnaire } from "../logique/wiktionnaire.js";
import { enregistrerPartie } from "../logique/scores.js";
import motsSolutions from "../data/mots-solutions.json";

function Partie() {
  // proposition : ce que le joueur tape lettre par lettre
  // motMystere : le mot à trouver (aléatoire ou du jour selon le mode)
  // lignes : historique des propositions validées avec leurs couleurs
  // Tous ces états sont initialisés depuis le localStorage si c'est une reprise de partie du jour
  const dateDuJour = new Date().toLocaleDateString("fr-FR");

  const [modeDuJour] = useState(() => {
    const sauvegarde = localStorage.getItem("modeDuJour");
    return sauvegarde === "true";
  });

  const [motMystere, setMotMystere] = useState(() => {
    const sauvegardeMode = localStorage.getItem("modeDuJour");
    if (sauvegardeMode === "true") {
      return choisirMotDuJour(motsSolutions);
    }
    return tirerPremierMot();
  });

  const [lignes, setLignes] = useState(() => {
    const sauvegardeMode = localStorage.getItem("modeDuJour");
    if (sauvegardeMode !== "true") {
      return [];
    }
    const sauvegarde = localStorage.getItem("partieDuJour");
    if (!sauvegarde) {
      return [];
    }
    try {
      const donnees = JSON.parse(sauvegarde);
      if (donnees && donnees.date === dateDuJour && donnees.lignes) {
        return donnees.lignes;
      }
    } catch {
      // Si la sauvegarde est illisible, on commence une nouvelle partie
    }
    return [];
  });

  const [proposition, setProposition] = useState(() => {
    const sauvegardeMode = localStorage.getItem("modeDuJour");
    if (sauvegardeMode !== "true") {
      return "";
    }
    const sauvegarde = localStorage.getItem("partieDuJour");
    if (!sauvegarde) {
      return "";
    }
    try {
      const donnees = JSON.parse(sauvegarde);
      if (donnees && donnees.date === dateDuJour) {
        return donnees.proposition || "";
      }
    } catch {
      // Si la sauvegarde est illisible, on commence une nouvelle partie
    }
    return "";
  });

  // enChargement : bloque les saisies pendant l'appel API
  const [enChargement, setEnChargement] = useState(false);
  // message : affiche un avis au joueur (mot refusé, dictionnaire indisponible...)
  const [message, setMessage] = useState("");
  // ligneRefusee : déclenche l'animation de tremblement si le mot n'est pas dans le dictionnaire
  const [ligneRefusee, setLigneRefusee] = useState(false);
  // compteurRefus : change la key de la ligne active pour relancer le tremblement à chaque refus
  const [compteurRefus, setCompteurRefus] = useState(0);

  // tempsDebutPartie : heure de début de la partie (pour calculer le temps de résolution)
  // on l'initialise dans un effet car Date.now() ne peut pas être appelé pendant le rendu
  const tempsDebutPartie = useRef(null);

  // tempsRestant : compte à rebours avant le prochain mot du jour (minuit)
  const [tempsRestant, setTempsRestant] = useState(tempsRestantAvantMinuit());

  // Met à jour le compte à rebours chaque seconde
  useEffect(() => {
    const interval = setInterval(() => {
      setTempsRestant(tempsRestantAvantMinuit());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // On mémorise l'heure de début de la partie une seule fois
  useEffect(() => {
    if (tempsDebutPartie.current === null) {
      tempsDebutPartie.current = Date.now();
    }
  }, []);

  // On mémorise le choix du mode dans le navigateur pour la prochaine visite
  useEffect(() => {
    localStorage.setItem("modeDuJour", String(modeDuJour));
  }, [modeDuJour]);

  // Sauvegarde la partie du jour à chaque changement (lignes ou proposition)
  useEffect(() => {
    if (!modeDuJour) return;
    const donnees = {
      date: dateDuJour,
      lignes: lignes,
      proposition: proposition,
    };
    localStorage.setItem("partieDuJour", JSON.stringify(donnees));
  }, [modeDuJour, dateDuJour, lignes, proposition]);

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
          const tempsSecondes = tempsDebutPartie
            ? Math.floor((Date.now() - tempsDebutPartie) / 1000)
            : 0;
          const modePartie = modeDuJour ? "dujour" : "libre";
          enregistrerPartie(pseudo, motMystere, nouvellesLignes.length, pointsObtenus, modePartie, tempsSecondes);
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

  // Génère le texte de partage avec les couleurs (emoji) sans révéler les lettres
  // Format : Le Mot Mystère DD/MM · X/6 puis les lignes d'emoji
  function genererTextePartage() {
    const aujourdhui = new Date();
    const jour = aujourdhui.getDate().toString().padStart(2, "0");
    const mois = (aujourdhui.getMonth() + 1).toString().padStart(2, "0");
    const nombreEssais = lignes.length;

    let texte = "Le Mot Mystère " + jour + "/" + mois + " · " + nombreEssais + "/6\n";

    const emojiParCouleur = {
      vert: "🟩",
      jaune: "🟨",
      gris: "⬛",
    };

    for (let i = 0; i < lignes.length; i++) {
      const couleurs = lignes[i].couleurs;
      let ligneEmoji = "";
      for (let j = 0; j < couleurs.length; j++) {
        ligneEmoji = ligneEmoji + emojiParCouleur[couleurs[j]];
      }
      texte = texte + ligneEmoji + "\n";
    }

    return texte;
  }

  // Copie le texte de partage dans le presse-papiers
  async function partagerResultat() {
    const texte = genererTextePartage();
    try {
      await navigator.clipboard.writeText(texte);
      setMessage("Partage copié dans le presse-papiers !");
    } catch {
      setMessage("Impossible de copier le partage.");
    }
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
        {modeDuJour ? (
          <p>Partie du jour déjà terminée. Revenez demain pour un nouveau mot.</p>
        ) : (
          <button type="button" onClick={rejouer}>
            Rejouer
          </button>
        )}
        <button type="button" onClick={partagerResultat}>
          Partager le résultat
        </button>
        <Link to="/scores">Voir les scores</Link>
        <Link to="/">Accueil</Link>
      </section>
    );
  }

  return (
    <main className="page">
      <h1>Le Mot Mystère</h1>
      <Link to="/" className="bouton-retour">Retour à l'accueil</Link>

      {/* Compte à rebours avant le prochain mot du jour (affiché uniquement en mode du jour) */}
      {modeDuJour && (
        <p className="compte-a-rebours">
          Prochain mot dans {tempsRestant.heures}h {tempsRestant.minutes}m {tempsRestant.secondes}s
        </p>
      )}

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
