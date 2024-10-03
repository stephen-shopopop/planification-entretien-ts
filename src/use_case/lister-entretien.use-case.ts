import { IEntretienRepository } from "../domain/port/entretien-repository";
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
