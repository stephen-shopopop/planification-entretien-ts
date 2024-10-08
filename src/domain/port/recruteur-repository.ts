import type { Recruteur } from "../entity/recruteur";

export interface IRecruteurRepository {
  save: (recruteur: Recruteur) =>  Promise<Recruteur>;
  retrieveAll: (searchParams: {email?: string}) => Promise<Recruteur[]>;
  retrieveById: (recruteurId: number) => Promise<Recruteur | null>;
  update: (recruteur: Recruteur) => Promise<number>;
  delete: (recruteurId: number) => Promise<number>;
  deleteAll(): Promise<number>;
}
