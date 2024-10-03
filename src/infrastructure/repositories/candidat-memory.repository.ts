import type { Candidat } from "../../domain/entity/candidat";
import type { ICandidatRepository } from "../../domain/port/candidat-repository";
import { dbMemory } from "../db/memory-db";


export class MemoryCandidatRepository implements ICandidatRepository{
  async save(candidat: Candidat): Promise<Candidat> {
    return await dbMemory.create(candidat);
  }

  async retrieveAll(): Promise<Candidat[]> {
    return await dbMemory.retrieveAll()
  }

  async retrieveById(candidatId: number): Promise<Candidat | null> {
    return await dbMemory.retrieveById(candidatId)
  }

  async update(candidat: Candidat): Promise<number> {
    return await dbMemory.update(candidat)
  }

  async delete(candidatId: number): Promise<number> {
    return await dbMemory.deleteById(candidatId)
  }

  async deleteAll(): Promise<number> {
    return await dbMemory.deleteAll()
  }
}

export default new MemoryCandidatRepository();
