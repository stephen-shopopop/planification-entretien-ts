import { SqlEntretienRepository } from "../infrastructure/repositories/entretien.repository";

export class ListeEntretien {

  #sqlEntretienRepository: SqlEntretienRepository

  constructor(){
    this.#sqlEntretienRepository = new SqlEntretienRepository()
  }

  async execute (){
    return await this.#sqlEntretienRepository.retrieveAll();
  }
}

export default new ListeEntretien()