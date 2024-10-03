// export interface Entretien {
//   id?: number;
//   horaire?: string;
//   candidatId?: number;
//   recruteurId?: number;
// }

import { AppError } from "../../shared/apiError";
import type { Candidat } from "./candidat";
import type { Recruteur } from "./recruteur";

export class Entretien {
  id?: number;
  horaire?: string;
  candidatId?: number;
  recruteurId?: number;
}


export class EntretienBuilder {

  #Entretien: Entretien = {}

  constructor(
    candidatId: number,
    recruteurId: number, 
    horaire?: string
  ){
    this.#Entretien.horaire = horaire
    this.#Entretien.candidatId = candidatId
    this.#Entretien.recruteurId = recruteurId
  }

  plannifier(candidat: Candidat, recruteur: Recruteur){
    if (recruteur.langage && candidat?.langage && recruteur.langage != candidat.langage) {
      throw new AppError("Pas la même techno", 400)
    }

    if (recruteur?.xp && candidat?.xp && recruteur.xp < candidat.xp) {
      throw new AppError( "Recruteur trop jeune", 400)
    }
  }

  snapshot(){
    return this.#Entretien
  }
}