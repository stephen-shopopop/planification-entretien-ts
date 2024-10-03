import type { IRecruteurRepository } from "../domain/port/recruteur-repository";

export class SupprimerRecruteur{

  #sqlRecruteurRepository: IRecruteurRepository

  constructor(readonly candidateRepository: IRecruteurRepository){
      this.#sqlRecruteurRepository = candidateRepository
  }

  async execute (recruteurId: number){
    return await this.#sqlRecruteurRepository.delete(recruteurId);
  }
}
