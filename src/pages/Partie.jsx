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
      let lignes = donnees.lignes;
      if (!lignes) {
        lignes = [];
      }
      let proposition = donnees.proposition;
      if (!proposition) {
        proposition = "";
      }
      return { lignes: lignes, proposition: proposition };
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

  // La fonction dans useState n'est lancée qu'au premier affichage, donc le mot ne change pas.
  const [motMystere, setMotMystere] = useState(() => {
    if (modeDuJour) {
      return choisirMotDuJour(motsSolutions);
    }
    return tirerMotAleatoire(motsSolutions);
  });

  // En mode du jour, on reprend la partie sauvegardée
  let lignesDepart = [];
  let propositionDepart = "";
  if (modeDuJour) {
    const sauvegarde = chargerPartieDuJour(dateDuJour);
    lignesDepart = sauvegarde.lignes;
    propositionDepart = sauvegarde.proposition;
  }
  const [lignes, setLignes] = useState(lignesDepart);
  const [proposition, setProposition] = useState(propositionDepart);

  // Vrai pendant l'appel à l'API : bloque les saisies
  const [enChargement, setEnChargement] = useState(false);
  const [message, setMessage] = useState("");
  // Tremblement de la ligne si le mot est refusé (le compteur relance l'animation)
  const [ligneRefusee, setLigneRefusee] = useState(false);
  const [compteurRefus, setCompteurRefus] = useState(0);

  // Heure de début de la partie (pour calculer le temps de résolution).
  // useRef garde une valeur sans réafficher la page quand elle change.
  const tempsDebutPartie = useRef(null);

  // Compte à rebours avant le prochain mot du jour.
  const [tempsRestant, setTempsRestant] = useState(tempsRestantAvantMinuit());

  useEffect(() => {
    const interval = setInterval(() => {
      setTempsRestant(tempsRestantAvantMinuit());
    }, 1000);
    // Arrête le minuteur quand on quitte la page.
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

  // Ces valeurs sont recalculées à chaque affichage à partir des lignes.
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
          let pseudo = localStorage.getItem("pseudo");
          if (!pseudo) {
            pseudo = "Anonyme";
          }
          let tempsSecondes = 0;
          if (tempsDebutPartie.current) {
            tempsSecondes = Math.floor((Date.now() - tempsDebutPartie.current) / 1000);
          }
          let modePartie = "libre";
          if (modeDuJour) {
            modePartie = "dujour";
          }
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

    // Pas de tableau de dépendances : l'écouteur est remis à chaque affichage
    // pour toujours utiliser la dernière version de traiterTouche.
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

  // Copie le résultat dans le presse-papiers (await car le navigateur peut refuser).
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

    // Mot du jour : pas de bouton Rejouer, une seule partie par jour
    let finDuJour = (
      <button type="button" onClick={rejouer}>
        Rejouer
      </button>
    );
    if (modeDuJour) {
      finDuJour = <p>Partie du jour déjà terminée. Revenez demain pour un nouveau mot.</p>;
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
        {finDuJour}
        <button type="button" onClick={partagerResultat}>
          Partager le résultat
        </button>
        <Link to="/scores">Voir les scores</Link>
        <Link to="/">Accueil</Link>
      </section>
    );
  }

  let compteARebours = null;
  if (modeDuJour) {
    compteARebours = (
      <p className="compte-a-rebours">
        Prochain mot dans {tempsRestant.heures}h {tempsRestant.minutes}m {tempsRestant.secondes}s
      </p>
    );
  }

  // Pendant l'appel à l'API on affiche "Vérification...", sinon le message s'il y en a un
  let zoneMessage = null;
  if (enChargement) {
    zoneMessage = <p className="message-chargement">Vérification dans le dictionnaire...</p>;
  } else if (message) {
    zoneMessage = <p className="message-avertissement">{message}</p>;
  }

  return (
    <main className="page">
      <h1>Le Mot Mystère</h1>
      <Link to="/" className="bouton-retour">Retour à l'accueil</Link>

      {compteARebours}

      <Grille
        lignesValidees={lignes}
        proposition={proposition}
        ligneRefusee={ligneRefusee}
        compteurRefus={compteurRefus}
      />

      {zoneMessage}

      <Clavier surTouche={traiterTouche} statutsLettres={statutsLettres} />

      {ecranFin}
    </main>
  );
}

function retirerDerniereLettre(valeurActuelle) {
  return valeurActuelle.slice(0, -1);
}

// Ajoute une lettre à la fin si la proposition n'est pas pleine.
function ajouterLettre(lettre) {
  // On renvoie une fonction car setProposition la lance avec la valeur actuelle.
  return function ajouterSiPlace(valeurActuelle) {
    if (valeurActuelle.length < LONGUEUR_MOT) {
      return valeurActuelle + lettre;
    }
    return valeurActuelle;
  };
}

export default Partie;
