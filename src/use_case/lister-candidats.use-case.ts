import { ICandidatRepository } from "../domain/port/candidat-repository";
import { SqlCandidatRepository } from "../infrastructure/repositories/candidat.repository";

export class ListerCandidats {

  #sqlCandidatRepository: ICandidatRepository

  constructor(readonly candidateRepository: ICandidatRepository){
      this.#sqlCandidatRepository = candidateRepository
  }

  async execute (searchParams: { email?: string }){
    return await this.#sqlCandidatRepository.retrieveAll(searchParams);
  }
}
