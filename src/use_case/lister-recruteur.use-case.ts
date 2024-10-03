import type { IRecruteurRepository } from "../domain/port/recruteur-repository";

export class ListeRecruteurs{

  #sqlRecruteurRepository: IRecruteurRepository

  constructor(readonly candidateRepository: IRecruteurRepository){
      this.#sqlRecruteurRepository = candidateRepository
  }

  async execute (searchParams: { email?: string }){
    return await this.#sqlRecruteurRepository.retrieveAll(searchParams);
  }
}
