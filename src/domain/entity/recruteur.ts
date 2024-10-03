export interface Recruteur {
  id?: number;
  langage?: string;
  email?: string;
  xp?: number;
}


export class RecruteurBuilder {
  #recruteur: Recruteur = {}

  constructor(
    langage: string,
    email: string,
    xp: number
  ) {
    this.#recruteur.langage = langage
    this.#recruteur.email = email
    this.#recruteur.xp = xp
  }

  toJSON(){
    return this.#recruteur
  }
}