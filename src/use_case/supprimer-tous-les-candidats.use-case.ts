import type { ICandidatRepository } from "../domain/port/candidat-repository";

export class SupprimerTousLesCandidats {

  #sqlCandidatRepository: ICandidatRepository

  constructor(readonly candidateRepository: ICandidatRepository){
      this.#sqlCandidatRepository = candidateRepository
  }

  async execute (){
    return await this.#sqlCandidatRepository.deleteAll();
  }
}
