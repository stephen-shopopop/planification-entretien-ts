import type{ ICandidatRepository } from "../domain/port/candidat-repository";
import type { IEntretienRepository } from "../domain/port/entretien-repository";
import type { IRecruteurRepository } from "../domain/port/recruteur-repository";

export class TrouverUnEntretien {
  #sqlEntretienRepository: IEntretienRepository
  #sqlCandidatRepository: ICandidatRepository
  #sqlRecruteurRepository: IRecruteurRepository


  constructor(
    readonly entretienRepository: IEntretienRepository,
    readonly sqlCandidatRepository: ICandidatRepository,
    readonly sqlRecruteurRepository: IRecruteurRepository,
  ){
      this.#sqlEntretienRepository = entretienRepository
      this.#sqlCandidatRepository = sqlCandidatRepository
      this.#sqlRecruteurRepository = sqlRecruteurRepository
  }

  async execute (entretienId: number){
    const entretien = await this.#sqlEntretienRepository.retrieveById(entretienId);

    if(!entretien){
      return null
    }

    const candidatEmail = entretien?.candidatId
     ? (await this.#sqlCandidatRepository.retrieveById(entretien.candidatId))?.email
     : undefined
    
    const recruteurEmail =entretien?.recruteurId
     ? (await this.#sqlRecruteurRepository.retrieveById(entretien.recruteurId))?.email
     : undefined

    return {
      id :entretien.id,
      horaire: entretien.horaire,
      candidatId: entretien.candidatId,
      recruteurId: entretien.recruteurId,
      candidatEmail,
      recruteurEmail
    }
  }
}
