// Auteur : Ethan (ethn924) - Le Mot Mystère
// Vérifie qu'un mot existe en français avec UN seul appel à l'API du Wiktionnaire.

import { normaliserMot } from "./jeu.js";

// Renvoie { valide, erreurApi }. async car on doit attendre la réponse d'Internet.
export async function verifierMotWiktionnaire(proposition) {
  // Pages dont le titre est le mot ET rangées dans la catégorie "français".
  // La recherche ignore les accents : "ecole" trouve "école".
  const recherche = "intitle:" + proposition.toLowerCase() + " incategory:français";

  // origin=* : sans ça le navigateur bloque la réponse (CORS).
  // encodeURIComponent : encode les espaces et le "ç" pour l'adresse.
  const url =
    "https://fr.wiktionary.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=" +
    encodeURIComponent(recherche);

  // En gros on demande au Wiktionnaire s'il a une page en français pour ce mot.
  // await = on attend qu'il réponde, .json() = on transforme sa réponse en objet,
  // et après on regarde si un des titres trouvés c'est bien notre mot.
  // Si l'API plante (catch), on accepte le mot, sinon le joueur est bloqué.
  try {
    // Api-User-Agent : le Wiktionnaire demande qu'on dise qui l'appelle.
    const reponse = await fetch(url, {
      headers: { "Api-User-Agent": "LeMotMystere/1.0 (projet-etudiant@cours.fr)" },
    });
    const donnees = await reponse.json();
    const resultats = donnees.query.search;

    for (let i = 0; i < resultats.length; i++) {
      if (normaliserMot(resultats[i].title) === normaliserMot(proposition)) {
        return { valide: true, erreurApi: false };
      }
    }
    return { valide: false, erreurApi: false };
  } catch {
    return { valide: true, erreurApi: true };
  }
}
