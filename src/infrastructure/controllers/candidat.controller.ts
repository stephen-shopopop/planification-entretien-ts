import type { Request, Response } from "express";
import type SQLCandidat from '../models/candidat.model';
import { AppError } from "../../shared/apiError";
import candidatService from "../../use_case/candidat.service";
import { CreerCandidat } from "../../use_case/creer-candidat.use-case";
import { ListerCandidats } from "../../use_case/lister-candidats.use-case";
import { SqlCandidatRepository } from "../repositories/candidat.repository";

/** Register */
const creerCandidat = new CreerCandidat(new SqlCandidatRepository())
const listerCandidats = new ListerCandidats(new SqlCandidatRepository())

export default class CandidatController {
  async create(req: Request, res: Response) {
    try {
      const {
        langage,
        xp,
        email,
      } = req.body

      const savedCandidat = await creerCandidat.execute({langage, xp, email})

      res.status(201).send(savedCandidat);
    } catch (err) {
      res.status(err instanceof AppError ? err.HttpStatus : 500).send({
        message: err instanceof AppError ? err.message : "Some error occurred while creating entretiens."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const langage = typeof req.query.langage === "string" ? req.query.langage : "";

    try {
      const candidats = await listerCandidats.execute({ email: langage })

      res.status(200).send(candidats);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving candidats."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const candidat = await candidatService.retrieveById(id);

      if (candidat) res.status(200).send(candidat);
      else
        res.status(404).send({
          message: `Cannot find Candidat with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Candidat with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let candidat: SQLCandidat = req.body;
    candidat.id = parseInt(req.params.id);

    try {
      const num = await candidatService.update(candidat);

      if (num == 1) {
        res.status(204).send({
          message: "Candidat was updated successfully."
        });
      } else {
        res.status(404).send({
          message: `Cannot update Candidat with id=${candidat.id}. Maybe Candidat was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Candidat with id=${candidat.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await candidatService.delete(id);

      if (num == 1) {
        res.status(204).send({
          message: "Candidat was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Candidat with id=${id}. Maybe Candidat was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Candidat with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await candidatService.deleteAll();

      res.status(204).send({ message: `${num} Candidats were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all candidats."
      });
    }
  }
}
