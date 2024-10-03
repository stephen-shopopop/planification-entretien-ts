import { CandidatBuilder, type Candidat } from "../domain/entity/candidat";
import type { ICandidatRepository } from "../domain/port/candidat-repository";

export class CreerCandidat {

  #sqlCandidatRepository: ICandidatRepository

  constructor(readonly candidateRepository: ICandidatRepository){
      this.#sqlCandidatRepository = candidateRepository
  }

  async execute ({ langage, xp, email }: Candidat){
    const candidat = new CandidatBuilder(langage, email, xp)

    return await this.#sqlCandidatRepository.save(candidat.toJSON());
  }
}
