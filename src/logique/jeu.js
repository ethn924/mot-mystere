export const NOMBRE_ESSAIS = 6
export const LONGUEUR_MOT = 5

// eslint-disable-next-line no-unused-vars
function tirerMotAleatoire(listeMots) {
   let random = Math.random()
   random = random * listeMots.length
   random = Math.floor(random)

   return listeMots[random]
}