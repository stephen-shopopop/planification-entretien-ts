import type { Entretien } from "../entity/entretien";

export interface IEntretienRepository {
  save: (entretien: Entretien) => Promise<Entretien>;
  retrieveAll: () => Promise<Entretien[]>;
  retrieveById: (entretienId: number) => Promise<Entretien | null>;
  update: (entretien: Entretien) => Promise<number>;
  delete: (entretienId: number) => Promise<number>;
  deleteAll: () => Promise<number>;
}
