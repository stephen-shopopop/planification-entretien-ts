import type { Request, Response } from 'express';
import type SQLEntretien from '../models/entretien.model';
import entretienService from '../../use_case/services/entretien.service';
import entretienRepository from '../repositories/entretien.repository';
import { AppError } from '../../shared/apiError';

export default class EntretienController {
  async create(req: Request, res: Response) {
    try {
      const {
        recruteurId,
        candidatId,
        disponibiliteRecruteur,
        horaire
      } = req.body

      // Assert
      if (disponibiliteRecruteur !== horaire) {
        throw new AppError( "Pas les mêmes horaires!", 400)
      }

      const savedEntretien = await entretienService.create(recruteurId, candidatId, horaire);

      res.status(201).send(savedEntretien);
    } catch (err) {
      res.status(err instanceof AppError ? err.HttpStatus : 500).send({
        message: err instanceof AppError ? err.message : "Some error occurred while creating entretiens."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const entretiens = await entretienService.retrieveAll();

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
