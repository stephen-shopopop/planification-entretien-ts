import { Op } from "sequelize";
import SQLRecruteur from '../models/recruteur.model';
import type { Recruteur, IRecruteurRepository } from "../../domain/recruteur.interface";

interface SearchCondition {
  [key: string]: any;
}

export class SqlRecruteurRepository implements IRecruteurRepository {
  async save(recruteur: Recruteur): Promise<Recruteur> {
    try {
      return await SQLRecruteur.create({
        title: recruteur.langage,
        description: recruteur.email,
        published: recruteur.xp
      });
    } catch (err) {
      throw new Error("Failed to create Recruteur!");
    }
  }

  async retrieveAll(searchParams: {email?: string}): Promise<Recruteur[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = { [Op.iLike]: `%${searchParams.email}%` };

      return await SQLRecruteur.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Recruteurs!");
    }
  }

  async retrieveById(recruteurId: number): Promise<Recruteur | null> {
    try {
      return await SQLRecruteur.findByPk(recruteurId);
    } catch (error) {
      throw new Error("Failed to retrieve Recruteurs!");
    }
  }

  async update(recruteur: Recruteur): Promise<number> {
    const { id, langage, email, xp } = recruteur;

    try {
      const affectedRows = await SQLRecruteur.update(
        { langage: langage, email: email, xp: xp },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Recruteur!");
    }
  }

  async delete(recruteurId: number): Promise<number> {
    try {
      const affectedRows = await SQLRecruteur.destroy({ where: { id: recruteurId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Recruteur!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return SQLRecruteur.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error("Failed to delete Recruteurs!");
    }
  }
}

export default new SqlRecruteurRepository();
