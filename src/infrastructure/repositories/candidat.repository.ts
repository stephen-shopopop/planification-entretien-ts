import { Op } from "sequelize";
import SQLCandidat from '../models/candidat.model';
import { Candidat } from "../../domain/entity/candidat";
import { ICandidatRepository } from "../../domain/port/candidat-repository";


interface SearchCondition {
  [key: string]: any;
}

export class SqlCandidatRepository implements ICandidatRepository{
  async save(candidat: Candidat): Promise<Candidat> {
    try {
      return await SQLCandidat.create({
        title: candidat.langage,
        description: candidat.email,
        published: candidat.xp
      });
    } catch (err) {
      throw new Error("Failed to create Candidat!");
    }
  }

  async retrieveAll(searchParams: {email?: string}): Promise<Candidat[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = { [Op.iLike]: `%${searchParams.email}%` };

      return await SQLCandidat.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Candidats!");
    }
  }

  async retrieveById(candidatId: number): Promise<Candidat | null> {
    try {
      let condition: SearchCondition = {};
      condition.id = { [Op.eq]: candidatId};
      const candidat = await SQLCandidat.findOne({ where: condition});
      return candidat;
    } catch (error) {
      throw new Error("Failed to retrieve Candidats!");
    }
  }

  async update(candidat: Candidat): Promise<number> {
    const { id, langage, email, xp } = candidat;

    try {
      const affectedRows = await SQLCandidat.update(
        { langage: langage, email: email, xp: xp },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Candidat!");
    }
  }

  async delete(candidatId: number): Promise<number> {
    try {
      const affectedRows = await SQLCandidat.destroy({ where: { id: candidatId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Candidat!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return SQLCandidat.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error("Failed to delete Candidats!");
    }
  }
}

export default new SqlCandidatRepository();
