import type { ICandidatRepository } from "../domain/port/candidat-repository";

export class ListerCandidats {

  #sqlCandidatRepository: ICandidatRepository

  constructor(readonly candidateRepository: ICandidatRepository){
      this.#sqlCandidatRepository = candidateRepository
  }

  async execute (searchParams: { email?: string }){
    return await this.#sqlCandidatRepository.retrieveAll(searchParams);
  }
}
