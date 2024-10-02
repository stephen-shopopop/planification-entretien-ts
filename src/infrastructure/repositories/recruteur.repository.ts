import { Op } from "sequelize";
import SQLRecruteur from '../models/recruteur.model';

export interface IRecruteur {
  id?: number;
  langage?: string;
  email?: string;
  xp?: number;
}

export interface IRecruteurRepository {
  save: (recruteur: IRecruteur) =>  Promise<IRecruteur>;
  retrieveAll: (searchParams: {email?: string}) => Promise<IRecruteur[]>;
  retrieveById: (recruteurId: number) => Promise<IRecruteur | null>;
  update: (recruteur: IRecruteur) => Promise<number>;
  delete: (recruteurId: number) => Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

export class SqlRecruteurRepository implements IRecruteurRepository {
  async save(recruteur: IRecruteur): Promise<IRecruteur> {
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

  async retrieveAll(searchParams: {email?: string}): Promise<IRecruteur[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = { [Op.iLike]: `%${searchParams.email}%` };

      return await SQLRecruteur.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Recruteurs!");
    }
  }

  async retrieveById(recruteurId: number): Promise<IRecruteur | null> {
    try {
      return await SQLRecruteur.findByPk(recruteurId);
    } catch (error) {
      throw new Error("Failed to retrieve Recruteurs!");
    }
  }

  async update(recruteur: IRecruteur): Promise<number> {
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
