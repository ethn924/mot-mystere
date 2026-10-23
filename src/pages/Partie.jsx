// Partie : écran principal du jeu. Gère la partie en cours, la grille et l'écran de fin.

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
  dateDeParis,
} from "../logique/jeu.js";
import { verifierMotWiktionnaire } from "../logique/wiktionnaire.js";
import { enregistrerPartie } from "../logique/scores.js";
import motsSolutions from "../data/mots-solutions.json";

// Lit la sauvegarde de la partie du jour depuis le navigateur.
// Retourne { lignes, proposition } ou des valeurs vides si rien n'est enregistré.
function chargerPartieDuJour(dateDuJour) {
  const sauvegarde = localStorage.getItem("partieDuJour");
  if (!sauvegarde) {
    return { lignes: [], proposition: "" };
  }
  try {
    const donnees = JSON.parse(sauvegarde);
    if (donnees && donnees.date === dateDuJour) {
      return {
        lignes: donnees.lignes || [],
        proposition: donnees.proposition || "",
      };
    }
  } catch {
    // Sauvegarde illisible, on recommence une nouvelle partie.
  }
  return { lignes: [], proposition: "" };
}

function Partie() {
  // Date du jour pour savoir si une sauvegarde du mot du jour est encore valable.
  const dateDuJour = dateDeParis();

  // Mode de jeu : true = mot du jour, false = partie libre.
  // Choisi sur l'accueil, on ne le modifie pas ici.
  const [modeDuJour] = useState(() => {
    const sauvegarde = localStorage.getItem("modeDuJour");
    return sauvegarde === "true";
  });

  // Le mot mystère à trouver.
  const [motMystere, setMotMystere] = useState(() => {
    if (modeDuJour) {
      return choisirMotDuJour(motsSolutions);
    }
    return tirerMotAleatoire(motsSolutions);
  });

  // Les lignes déjà jouées (avec leurs couleurs).
  const sauvegardeLignes = chargerPartieDuJour(dateDuJour);
  const [lignes, setLignes] = useState(modeDuJour ? sauvegardeLignes.lignes : []);

  // La proposition en cours de frappe.
  const [proposition, setProposition] = useState(
    modeDuJour ? sauvegardeLignes.proposition : ""
  );

  // Bloque les saisies pendant l'appel à l'API.
  const [enChargement, setEnChargement] = useState(false);
  // Message affiché au joueur.
  const [message, setMessage] = useState("");
  // Déclenche l'animation de tremblement si le mot est refusé.
  const [ligneRefusee, setLigneRefusee] = useState(false);
  // Force le relancement de l'animation de tremblement à chaque refus.
  const [compteurRefus, setCompteurRefus] = useState(0);

  // Heure de début de la partie (pour calculer le temps de résolution).
  const tempsDebutPartie = useRef(null);

  // Compte à rebours avant le prochain mot du jour.
  const [tempsRestant, setTempsRestant] = useState(tempsRestantAvantMinuit());

  // Met à jour le compte à rebours chaque seconde.
  useEffect(() => {
    const interval = setInterval(() => {
      setTempsRestant(tempsRestantAvantMinuit());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mémorise l'heure de début de la partie une seule fois.
  useEffect(() => {
    if (tempsDebutPartie.current === null) {
      tempsDebutPartie.current = Date.now();
    }
  }, []);

  // Sauvegarde la partie du jour à chaque changement.
  useEffect(() => {
    if (!modeDuJour) {
      return;
    }
    const donnees = {
      date: dateDuJour,
      lignes: lignes,
      proposition: proposition,
    };
    localStorage.setItem("partieDuJour", JSON.stringify(donnees));
  }, [modeDuJour, dateDuJour, lignes, proposition]);

  // Détermine si la partie est finie.
  const finie = partieEstFinie(lignes);
  let gagne = false;
  if (lignes.length > 0) {
    const derniereLigne = lignes[lignes.length - 1];
    gagne = estGagne(derniereLigne.couleurs);
  }
  const points = calculerPoints(lignes.length, gagne);
  const statutsLettres = calculerStatutsLettres(lignes);

  // Gère toutes les saisies (clavier physique et clavier virtuel).
  async function traiterTouche(touche) {
    // On ignore tout si la partie est finie ou si on attend l'API.
    if (finie || enChargement) {
      return;
    }

    // Validation de la ligne complète (touche Entrée).
    if (touche === "Enter" || touche === "ENTREE") {
      if (proposition.length === LONGUEUR_MOT) {
        setEnChargement(true);
        setMessage("Vérification dans le dictionnaire...");
        setLigneRefusee(false);

        const resultat = await verifierMotWiktionnaire(proposition);
        setEnChargement(false);

        // Mot refusé : il ne compte pas comme un essai, la ligne tremble.
        if (!resultat.valide) {
          setMessage("Ce mot n'est pas dans le dictionnaire.");
          setLigneRefusee(true);
          setCompteurRefus(function (c) {
            return c + 1;
          });
          return;
        }

        // Si l'API est en panne, on accepte le mot pour ne pas bloquer le joueur.
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

        // Si c'était le dernier coup, on enregistre le score.
        if (partieEstFinie(nouvellesLignes)) {
          const partieGagnee = estGagne(couleurs);
          const pointsObtenus = calculerPoints(
            nouvellesLignes.length,
            partieGagnee
          );
          const pseudo = localStorage.getItem("pseudo") || "Anonyme";
          const tempsSecondes = tempsDebutPartie.current
            ? Math.floor((Date.now() - tempsDebutPartie.current) / 1000)
            : 0;
          const modePartie = modeDuJour ? "dujour" : "libre";
          enregistrerPartie(
            pseudo,
            motMystere,
            nouvellesLignes.length,
            pointsObtenus,
            modePartie,
            tempsSecondes
          );
        }
      }
      return;
    }

    // Suppression de la dernière lettre (touche Retour arrière ou Effacer).
    if (touche === "Backspace" || touche === "EFFACER") {
      setMessage("");
      setLigneRefusee(false);
      setProposition(retirerDerniereLettre);
      return;
    }

    // Ajout d'une lettre à la proposition, si on n'a pas déjà 5 lettres.
    const lettre = normaliserMot(touche);
    if (lettre.length !== 1) {
      return;
    }

    setMessage("");
    setLigneRefusee(false);
    setProposition(ajouterLettre(lettre));
  }

  // Écoute les touches du clavier physique.
  useEffect(() => {
    function surTouche(event) {
      // On ignore les raccourcis navigateur (Ctrl, Cmd, Alt).
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      traiterTouche(event.key);
    }

    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  });

  // Remet tout à zéro pour recommencer une nouvelle partie.
  function rejouer() {
    setProposition("");
    setLignes([]);
    setMessage("");
    setLigneRefusee(false);
    setEnChargement(false);
    setMotMystere(tirerMotAleatoire(motsSolutions));
  }

  // Génère le texte de partage avec les couleurs (emoji) sans révéler les lettres.
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

  // Copie le texte de partage dans le presse-papiers.
  async function partagerResultat() {
    const texte = genererTextePartage();
    try {
      await navigator.clipboard.writeText(texte);
      setMessage("Partage copié dans le presse-papiers !");
    } catch {
      setMessage("Impossible de copier le partage.");
    }
  }

  // Construit l'écran de fin quand la partie est terminée.
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

      {/* Compte à rebours avant le prochain mot du jour (mode du jour uniquement) */}
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

// Supprime le dernier caractère d'une chaîne.
function retirerDerniereLettre(valeurActuelle) {
  return valeurActuelle.slice(0, -1);
}

// Ajoute une lettre à la fin si la proposition n'est pas pleine.
function ajouterLettre(lettre) {
  return function ajouterSiPlace(valeurActuelle) {
    if (valeurActuelle.length < LONGUEUR_MOT) {
      return valeurActuelle + lettre;
    }
    return valeurActuelle;
  };
}

export default Partie;
