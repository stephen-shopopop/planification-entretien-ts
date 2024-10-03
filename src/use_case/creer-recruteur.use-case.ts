import { RecruteurBuilder, type Recruteur } from "../domain/entity/recruteur";
import type { IRecruteurRepository } from "../domain/port/recruteur-repository";
import { AppError } from "../shared/apiError";

export class CreerRecruteur {

  #sqlRecruteurRepository: IRecruteurRepository

  constructor(readonly candidateRepository: IRecruteurRepository){
      this.#sqlRecruteurRepository = candidateRepository
  }

  async execute ({email, langage, xp}: Recruteur){
    const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!langage || !xp || xp < 0 || !email || !regexp.test(email)) {
        throw new AppError('Content can not be empty!', 400)
    }

    const recruteur = new RecruteurBuilder(langage, email, xp)

    return await this.#sqlRecruteurRepository.save(recruteur.toJSON());
  }
}