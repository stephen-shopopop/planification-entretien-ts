import type { Request, Response } from 'express';
import type SQLEntretien from '../models/entretien.model';
import entretienRepository, { SqlEntretienRepository } from '../repositories/entretien.repository';
import { AppError } from '../../shared/apiError';
import { ListeEntretien } from '../../use_case/lister-entretien.use-case';
import { CréerEntretien } from '../../use_case/creer-entretien.use-case';
import { SqlCandidatRepository } from '../repositories/candidat.repository';
import { SqlRecruteurRepository } from '../repositories/recruteur.repository';

/** Register */
const creerEntretien = new CréerEntretien(
  new SqlEntretienRepository(),
  new SqlCandidatRepository(),
  new SqlRecruteurRepository()
)
const listeEntretien = new ListeEntretien(new SqlEntretienRepository())

export default class EntretienController {
  async create(req: Request, res: Response) {
    try {
      const {
        recruteurId,
        candidatId,
        disponibiliteRecruteur,
        horaire
      } = req.body

      const savedEntretien = await creerEntretien.execute({ recruteurId, candidatId, horaire, disponibiliteRecruteur });

      res.status(201).send(savedEntretien);
    } catch (err) {
      res.status(err instanceof AppError ? err.HttpStatus : 500).send({
        message: err instanceof AppError ? err.message : "Some error occurred while creating entretiens."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const entretiens = await listeEntretien.execute();

      res.status(200).send(entretiens);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving entretiens."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const entretien = await entretienRepository.retrieveById(id);

      if (entretien) res.status(200).send(entretien);
      else
        res.status(404).send({
          message: `Cannot find Entretien with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Entretien with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let entretien: SQLEntretien = req.body;
    entretien.id = parseInt(req.params.id);

    try {
      const num = await entretienRepository.update(entretien);

      if (num == 1) {
        res.status(204).send({
          message: "Entretien was updated successfully."
        });
      } else {
        res.status(404).send({
          message: `Cannot update Entretien with id=${entretien.id}. Maybe Entretien was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Entretien with id=${entretien.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await entretienRepository.delete(id);

      if (num == 1) {
        res.status(204).send({
          message: "Entretien was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Entretien with id=${id}. Maybe Entretien was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Entretien with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await entretienRepository.deleteAll();

      res.status(204).send({ message: `${num} Entretiens were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all entretiens."
      });
    }
  }
}
