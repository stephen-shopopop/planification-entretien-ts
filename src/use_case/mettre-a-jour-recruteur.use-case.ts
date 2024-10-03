import type { Recruteur } from "../domain/entity/recruteur";
import type { IRecruteurRepository } from "../domain/port/recruteur-repository";

export class MettreAJourRecruteur{

  #sqlRecruteurRepository: IRecruteurRepository

  constructor(readonly candidateRepository: IRecruteurRepository){
      this.#sqlRecruteurRepository = candidateRepository
  }

  async execute (recruteur: Recruteur){
    return await this.#sqlRecruteurRepository.update(recruteur);
  }
}
