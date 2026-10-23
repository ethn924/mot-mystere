// Auteur : Ethan (ethn924) - Le Mot Mystère
// wiktionnaire.js : contacte l'API du Wiktionnaire pour vérifier si un mot existe en français.
// Toutes les requêtes réseau sont dans ce fichier.

import { normaliserMot } from "./jeu.js";

// En-tête obligatoire demandé par le Wiktionnaire.
const EN_TETE_API = {
  "Api-User-Agent": "LeMotMystere/1.0 (projet-etudiant@cours.fr)",
};

// Vérifie si une page du Wiktionnaire a bien une section "Français".
async function verifierSectionFrancaise(titrePage) {
  const url =
    "https://fr.wiktionary.org/w/api.php?action=parse&page=" +
    encodeURIComponent(titrePage) +
    "&prop=sections&format=json&origin=*";

  const reponse = await fetch(url, { headers: EN_TETE_API });
  const donnees = await reponse.json();

  if (!donnees.parse || !donnees.parse.sections) {
    return false;
  }

  // On cherche une section de niveau 2 nommée "Français".
  for (let i = 0; i < donnees.parse.sections.length; i++) {
    const section = donnees.parse.sections[i];
    if (
      section.level === "2" &&
      (section.line.includes("Français") || section.anchor === "Français")
    ) {
      return true;
    }
  }

  return false;
}

// Vérifie si une proposition est un mot français sur le Wiktionnaire.
export async function verifierMotWiktionnaire(proposition) {
  const motNormalise = normaliserMot(proposition);
  const motMinuscule = proposition.toLowerCase();

  try {
    // 1. On teste directement le mot tapé (ex: "arbre").
    const existeDirect = await verifierSectionFrancaise(motMinuscule);
    if (existeDirect) {
      return { valide: true, erreurApi: false };
    }

    // 2. Sinon, le mot a peut-être des accents (ex: "ECOLE" -> "école").
    // On cherche les titres approchants avec list=search.
    const urlRecherche =
      "https://fr.wiktionary.org/w/api.php?action=query&list=search&srsearch=" +
      encodeURIComponent(motMinuscule) +
      "&format=json&origin=*";

    const reponseRecherche = await fetch(urlRecherche, { headers: EN_TETE_API });
    const donneesRecherche = await reponseRecherche.json();

    let listeResultats = [];
    if (donneesRecherche.query && donneesRecherche.query.search) {
      listeResultats = donneesRecherche.query.search;
    }

    // On regarde si un résultat correspond à notre mot sans accents.
    for (let i = 0; i < listeResultats.length; i++) {
      const titreTrouve = listeResultats[i].title;
      if (normaliserMot(titreTrouve) === motNormalise) {
        const estFrancais = await verifierSectionFrancaise(titreTrouve);
        if (estFrancais) {
          return { valide: true, erreurApi: false };
        }
      }
    }

    // Le mot n'a pas été trouvé en français.
    return { valide: false, erreurApi: false };
  } catch {
    // Si l'API ne répond pas, on accepte le mot pour ne pas bloquer le joueur.
    return { valide: true, erreurApi: true };
  }
}
