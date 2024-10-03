import type { Candidat } from "../domain/entity/candidat";
import type { ICandidatRepository } from "../domain/port/candidat-repository";

export class MettreAJourCandidat {

  #sqlCandidatRepository: ICandidatRepository

  constructor(readonly candidateRepository: ICandidatRepository){
      this.#sqlCandidatRepository = candidateRepository
  }

  async execute (candidat: Candidat){
    return await this.#sqlCandidatRepository.update(candidat);
  }
}
