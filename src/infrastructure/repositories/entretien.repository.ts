import { Entretien } from '../../domain/entity/entretien';
import { IEntretienRepository } from '../../domain/port/entretien-repository';
import SQLEntretien from '../models/entretien.model';

interface SearchCondition {
  [key: string]: any;
}

export class SqlEntretienRepository implements IEntretienRepository {
  async save(entretien: Entretien): Promise<Entretien> {
    try {
      return await SQLEntretien.create({
        candidatId: entretien.candidatId,
        recruteurId: entretien.recruteurId,
        horaire: entretien.horaire
      });
    } catch (err) {
      throw new Error("Failed to create Entretien!");
    }
  }

  async retrieveAll(): Promise<Entretien[]> {
    try {
      return await SQLEntretien.findAll();
    } catch (error) {
      throw new Error("Failed to retrieve Entretiens!");
    }
  }

  async retrieveById(entretienId: number): Promise<Entretien | null> {
    try {
      return await SQLEntretien.findByPk(entretienId);
    } catch (error) {
      throw new Error("Failed to retrieve Entretiens!");
    }
  }

  async update(entretien: Entretien): Promise<number> {
    const { id,  horaire } = entretien;

    try {
      const affectedRows = await SQLEntretien.update(
        { horaire: horaire },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Entretien!");
    }
  }

  async delete(entretienId: number): Promise<number> {
    try {
      const affectedRows = await SQLEntretien.destroy({ where: { id: entretienId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Entretien!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return SQLEntretien.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error("Failed to delete Entretiens!");
    }
  }
}

export default new SqlEntretienRepository();
