import type { IEntretienRepository } from "../domain/entretien.interface";
import {  SqlEntretienRepository } from "../infrastructure/repositories/entretien.repository";

export class ListeEntretien {

  #sqlEntretienRepository: SqlEntretienRepository

  constructor(
    private readonly sqlEntretienRepository: IEntretienRepository
  ){
    this.#sqlEntretienRepository = new SqlEntretienRepository()
  }

  async execute (){
    return await this.#sqlEntretienRepository.retrieveAll();
  }
}

export default new ListeEntretien(new SqlEntretienRepository())