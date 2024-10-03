export interface Candidat {
  id?: number;
  langage?: string;
  email?: string;
  xp?: number;
}

export class CandidatBuilder{
  #candidat: Candidat = {};

  constructor(
    langage: string,
    email: string,
    xp: number
  ){
    this.#candidat.langage = langage
    this.#candidat.email = email
    this.#candidat.xp = xp
  }

  toJSON(){
    return this.#candidat
  }
}
