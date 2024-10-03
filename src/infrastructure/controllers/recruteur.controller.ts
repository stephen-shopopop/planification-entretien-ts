import type { Request, Response } from "express";
import type SQLRecruteur from '../models/recruteur.model';
import { AppError } from "../../shared/apiError";
import { CreerRecruteur } from "../../use_case/creer-recruteur.use-case";
import { SqlRecruteurRepository } from "../repositories/recruteur.repository";
import { ListeRecruteurs } from "../../use_case/lister-recruteur.use-case";
import { MettreAJourRecruteur } from "../../use_case/mettre-a-jour-recruteur.use-case";
import { SupprimerRecruteur } from "../../use_case/supprimer-recruteur.use-case";
import { SupprimerTousLesRecruteurs } from "../../use_case/supprimer-tous-les-recruteurs.use-case";
import { TrouverRecruteur } from "../../use_case/trouver-recruteur.use-case";

/** Register */
const creerRecruteur =  new CreerRecruteur(new SqlRecruteurRepository())
const listerRecruteur = new ListeRecruteurs(new SqlRecruteurRepository())
const mettreAJourRecruteur = new MettreAJourRecruteur(new SqlRecruteurRepository())
const supprimerRecruteur = new SupprimerRecruteur(new SqlRecruteurRepository())
const supprimerTousLesRecruteurs = new SupprimerTousLesRecruteurs(new SqlRecruteurRepository())
const trouverRecruteur = new TrouverRecruteur(new SqlRecruteurRepository())

export default class RecruteurController {
  async create(req: Request, res: Response) {
    try {
      const {
        langage,
        xp,
        email,
      } = req.body

      const savedRecruteur = await creerRecruteur.execute({langage, xp, email});

      res.status(201).send(savedRecruteur);
    } catch (err) {
      res.status(err instanceof AppError ? err.HttpStatus : 500).send({
        message: err instanceof AppError ? err.message : "Some error occurred while creating entretiens."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const langage = typeof req.query.langage === "string" ? req.query.langage : "";

    try {
      const recruteurs = await listerRecruteur.execute({ email: langage });

      res.status(200).send(recruteurs);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving recruteurs."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const recruteur = await trouverRecruteur.execute(id);

      if (recruteur) res.status(200).send(recruteur);
      else
        res.status(404).send({
          message: `Cannot find Recruteur with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Recruteur with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let recruteur: SQLRecruteur = req.body;
    recruteur.id = parseInt(req.params.id);

    try {
      const num = await mettreAJourRecruteur.execute(recruteur);

      if (num == 1) {
        res.status(204).send({
          message: "Recruteur was updated successfully."
        });
      } else {
        res.status(404).send({
          message: `Cannot update Recruteur with id=${recruteur.id}. Maybe Recruteur was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Recruteur with id=${recruteur.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await supprimerRecruteur.execute(id);

      if (num == 1) {
        res.status(204).send({
          message: "Recruteur was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Recruteur with id=${id}. Maybe Recruteur was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Recruteur with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await supprimerTousLesRecruteurs.execute();

      res.status(204).send({ message: `${num} Recruteurs were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all recruteurs."
      });
    }
  }
}
