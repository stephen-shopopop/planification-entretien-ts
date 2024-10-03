import type { Candidat } from "../../domain/entity/candidat"

class MemoryDB {
  #db : Map<(number), Candidat> = new Map()

  #generateId() {
    let i = 0

    return () => i++
  }

  create(candidat: Candidat) {
    const id = this.#generateId()()

    this.#db.set(id, {...candidat, id})

    return Promise.resolve(candidat)
  }

  retrieveAll(){
    return Promise.resolve(Array.from(this.#db.values()))
  }

  retrieveById(id: number){
    const candidat = this.#db.get(id)
    
    if(candidat === undefined) {
      throw new Error("Failed to retrieve Candidats!");
    }

    return Promise.resolve(candidat)
  }

  deleteById(id: number){
    this.#db.delete(id)

    return Promise.resolve(id)
  }

  deleteAll(){
    const size = this.#db.size

    this.#db.clear()

    return Promise.resolve(size)
  }

  update(candidat: Candidat){
    if(candidat.id){
      const candidatInDB = this.#db.get(candidat?.id)

      if(candidatInDB === undefined){
        throw new Error("Failed to update Candidat!");
      }

      this.#db.set(candidat.id, candidat)

      return candidat.id
    }

    throw new Error("Failed to update Candidat!");
  }
}


export const dbMemory = new MemoryDB()