import type { ICandidatRepository } from "../domain/port/candidat-repository";

export class SupprimerCandidat {

  #sqlCandidatRepository: ICandidatRepository

  constructor(readonly candidateRepository: ICandidatRepository){
      this.#sqlCandidatRepository = candidateRepository
  }

  async execute (candidatId: number){
    return await this.#sqlCandidatRepository.delete(candidatId);
  }
}
