import type { IRecruteurRepository } from "../domain/port/recruteur-repository";

export class SupprimerTousLesRecruteurs{

  #sqlRecruteurRepository: IRecruteurRepository

  constructor(readonly candidateRepository: IRecruteurRepository){
      this.#sqlRecruteurRepository = candidateRepository
  }

  async execute (){
    return await this.#sqlRecruteurRepository.deleteAll();
  }
}
