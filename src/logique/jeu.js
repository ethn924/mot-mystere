export const NOMBRE_ESSAIS = 6
export const LONGUEUR_MOT = 5

function tirerMotAleatoire(listeMots) {
   let random = Math.random()
   random = random * listeMots.length
   random = Math.floor(random)

   return listeMots[random]
}