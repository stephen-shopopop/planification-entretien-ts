import { AppError } from "../../shared/apiError";

export interface Candidat {
  id?: number;
  langage?: string;
  email?: string;
  xp?: number;
}

export class CandidatBuilder{
  #regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  #banEmail = ['neosoft.fr']

  #candidat: Candidat = {};

  constructor(
    langage?: string,
    email?: string,
    xp?: number
  ){
    if (!langage || !xp || xp < 0 || !email || !this.#regexp.test(email)) {
      throw new AppError('Content can not be empty!', 400)
    }

    const [,domain] = email.split('@')

    if( this.#banEmail.includes(domain)) {
      throw new AppError('Content can not be empty!', 400)
    }
    
    this.#candidat.langage = langage
    this.#candidat.email = email
    this.#candidat.xp = xp
  }

  toJSON(){
    return this.#candidat
  }
}
