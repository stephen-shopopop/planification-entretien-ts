import { Request, Response } from 'express';
import entretienRepository from '../repositories/entretien.repository';
import { Creation, CreerEntretien } from '../../use_case/entretien.creer';
import { Entretien } from '../../domain/entretien.domain';
import recruteurRepository from '../repositories/recruteur.repository';
import candidatRepository from '../repositories/candidat.repository';
import { ListerEntretien } from '../../use_case/entretien.lister';
import { TrouverEntretien } from '../../use_case/entretien.trouver';
import { MettreAJourEntretien } from '../../use_case/entretien.mettreajour';
import { SupprimerEntretien } from '../../use_case/entretien.supprimer';
import { SupprimerTousLesEntretiens } from '../../use_case/entretien.toutsupprimer';
import notificationService from '../notification.service';

export default class EntretienController {
  creerEntretien = new CreerEntretien(entretienRepository,
      recruteurRepository, candidatRepository, notificationService);
  listerEntretien = new ListerEntretien(entretienRepository);
  trouverEntretien: TrouverEntretien = new TrouverEntretien(entretienRepository);
  majEntretien: MettreAJourEntretien = new MettreAJourEntretien(entretienRepository);
  supprimerEntretien: SupprimerEntretien = new SupprimerEntretien(entretienRepository);
  supprimerTousLesEntretiens: SupprimerTousLesEntretiens = new SupprimerTousLesEntretiens(entretienRepository);

  async create(req: Request, res: Response) {
    try {
      const entretien: Entretien = req.body;
      const resultat = await this.creerEntretien.execute(entretien, req.body.disponibiliteRecruteur, req.body.horaire);
      switch (resultat.code) {
        case Creation.CANDIDAT_PAS_TROUVE:
          console.log(`CANDIDAT_PAS_TROUVE Cannot create Entretien with candidat id=${entretien.candidatId}. Candidat not found.`);
          res.status(404).send(resultat.message);
          break;
        case Creation.RECRUTEUR_PAS_TROUVE:
          console.log(`RECRUTEUR_PAS_TROUVE Cannot create Entretien with recruteur id=${entretien.recruteurId}. Recruteur not found.`);
          res.status(404).send(resultat.message);
          break;
        case Creation.PAS_COMPATIBLE:
        case Creation.HORAIRE:
          res.status(400).send(resultat.message);
          break;
        default:
          res.status(201).send(resultat.entretien);
      }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating entretiens."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const entretiens = await this.listerEntretien.execute();

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
      const entretien = await this.trouverEntretien.execute(id);

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
    let entretien: Entretien = req.body;
    entretien.id = parseInt(req.params.id);

    try {
      const num = await this.majEntretien.execute(entretien);

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
      const num = await this.supprimerEntretien.execute(id);

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
      const num = await this.supprimerTousLesEntretiens.execute();

      res.status(204).send({ message: `${num} Entretiens were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all entretiens."
      });
    }
  }
}
