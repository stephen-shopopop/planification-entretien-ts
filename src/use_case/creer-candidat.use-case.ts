import type { Candidat, ICandidatRepository } from "../domain/candidat.interface";
import { SqlCandidatRepository } from "../infrastructure/repositories/candidat.repository";
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

    return await this.#sqlCandidatRepository.save({
      langage,
      xp, 
      email
    });
  }
}

export default new CreerCandidat(new SqlCandidatRepository())