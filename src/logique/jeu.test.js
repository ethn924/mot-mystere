// Tests des fonctions pures de jeu.js (lancer avec : npm test)
import { test, expect } from "vitest";
import { comparer, calculerPoints, normaliserMot, estGagne } from "./jeu.js";

test("le bon mot donne 5 verts", () => {
  expect(comparer("ARBRE", "ARBRE")).toEqual(["vert", "vert", "vert", "vert", "vert"]);
});

test("aucune lettre en commun donne 5 gris", () => {
  expect(comparer("ROUGE", "XXXXX")).toEqual(["gris", "gris", "gris", "gris", "gris"]);
});

test("lettres en double : ARBRE / ERRER", () => {
  expect(comparer("ARBRE", "ERRER")).toEqual(["jaune", "vert", "jaune", "gris", "gris"]);
});

test("lettres en double : ROUGE / OOXXX, le O bien placé passe en premier", () => {
  expect(comparer("ROUGE", "OOXXX")).toEqual(["gris", "vert", "gris", "gris", "gris"]);
});

test("les accents sont ignorés dans comparer", () => {
  expect(comparer("école", "ECOLE")).toEqual(["vert", "vert", "vert", "vert", "vert"]);
});

test("normaliserMot enlève les accents et met en majuscules", () => {
  expect(normaliserMot("école")).toEqual("ECOLE");
});

test("estGagne : vrai seulement si tout est vert", () => {
  expect(estGagne(["vert", "vert", "vert", "vert", "vert"])).toEqual(true);
  expect(estGagne(["vert", "jaune", "vert", "vert", "vert"])).toEqual(false);
});

test("calculerPoints : 1 essai = 600, 6 essais = 100, perdu = 0", () => {
  expect(calculerPoints(1, true)).toEqual(600);
  expect(calculerPoints(6, true)).toEqual(100);
  expect(calculerPoints(6, false)).toEqual(0);
});
