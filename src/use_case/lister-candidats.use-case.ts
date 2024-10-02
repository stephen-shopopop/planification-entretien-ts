import type { ICandidatRepository } from "../domain/candidat.interface";
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

export default new ListerCandidats(new SqlCandidatRepository())