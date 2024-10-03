import type { IRecruteurRepository } from "../domain/port/recruteur-repository";

export class TrouverRecruteur{

  #sqlRecruteurRepository: IRecruteurRepository

  constructor(readonly candidateRepository: IRecruteurRepository){
      this.#sqlRecruteurRepository = candidateRepository
  }

  async execute (recruteurId: number){
    return await this.#sqlRecruteurRepository.retrieveById(recruteurId);
  }
}
