import { SqlRecruteurRepository, type IRecruteurRepository } from '../../infrastructure/repositories/recruteur.repository';
import { SqlCandidatRepository, type ICandidatRepository } from '../../infrastructure/repositories/candidat.repository';
import type { Request, Response } from 'express';
import { IEntretien, type IEntretienRepository, SqlEntretienRepository } from '../../infrastructure/repositories/entretien.repository';
import notificationService from './notification.service';

class EntretienService {
    constructor(
        private readonly entretienRepository: IEntretienRepository,
        private readonly candidatRepository: ICandidatRepository,
        private readonly recruteurRepository: IRecruteurRepository
    ) { /** */}

    async create(req: Request, res: Response) {
        if (req.body.disponibiliteRecruteur != req.body.horaire) {
            res.status(400).send({
                message: "Pas les mêmes horaires!"
            });
            return;
        }

        const recruteur = await this.recruteurRepository.retrieveById(req.body.recruteurId);
        const candidat = await this.candidatRepository.retrieveById(req.body.candidatId);

        if (!candidat) {
            res.status(404).send({
                message: `Cannot create Entretien with candidat id=${req.body.candidatId}.`
            });
            return;
        }

        if (!recruteur) {
            res.status(404).send({
                message: `Cannot create Entretien with recruteur id=${req.body.recruteurId}.`
            });
            return;
        }

        if (recruteur.langage && candidat?.langage && recruteur.langage != candidat.langage) {
            res.status(400).send({
                message: "Pas la même techno"
            });
            return;
        }

        if (recruteur?.xp && candidat?.xp && recruteur.xp < candidat.xp) {
            res.status(400).send({
                message: "Recruteur trop jeune"
            });
            return;
        }

        const entretien: IEntretien = req.body;

        const savedEntretien = await this.entretienRepository.save(entretien);

        await notificationService.envoyerEmailDeConfirmationAuCandidat(candidat?.email || '');
        await notificationService.envoyerEmailDeConfirmationAuRecruteur(recruteur?.email || '');

        res.status(201).send(savedEntretien);
    }

    async retrieveAll(): Promise<IEntretien[]> {
        return await this.entretienRepository.retrieveAll();
    }
}

export default new EntretienService(
    new SqlEntretienRepository(),
    new SqlCandidatRepository(),
    new SqlRecruteurRepository()
);
