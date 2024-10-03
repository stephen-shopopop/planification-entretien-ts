import { CandidatBuilder, type Candidat } from "../domain/entity/candidat";
import type { ICandidatRepository } from "../domain/port/candidat-repository";
import { AppError } from "../shared/apiError";

export class CreerCandidat {

  #sqlCandidatRepository: ICandidatRepository

  constructor(readonly candidateRepository: ICandidatRepository){
      this.#sqlCandidatRepository = candidateRepository
  }

  async execute ({ langage, xp, email }: Candidat){
    const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!langage || !xp || xp < 0 || !email || !regexp.test(email)) {
        throw new AppError('Content can not be empty!', 400)
    }

    const candidat = new CandidatBuilder(langage, email, xp)

    return await this.#sqlCandidatRepository.save(candidat.toJSON());
  }
}
