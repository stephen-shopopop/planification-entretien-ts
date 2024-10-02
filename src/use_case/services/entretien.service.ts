import { SqlRecruteurRepository, type IRecruteurRepository } from '../../infrastructure/repositories/recruteur.repository';
import { SqlCandidatRepository, type ICandidatRepository } from '../../infrastructure/repositories/candidat.repository';
import { type IEntretien, type IEntretienRepository, SqlEntretienRepository } from '../../infrastructure/repositories/entretien.repository';
import notificationService from './notification.service';
import { AppError } from '../../shared/apiError';

class EntretienService {
    constructor(
        private readonly entretienRepository: IEntretienRepository,
        private readonly candidatRepository: ICandidatRepository,
        private readonly recruteurRepository: IRecruteurRepository
    ) { /** */}

    async create(recruteurId: number, candidatId: number, horaire?: string) {
        const recruteur = await this.recruteurRepository.retrieveById(recruteurId);
        const candidat = await this.candidatRepository.retrieveById(candidatId);

        if (!candidat) {
            throw new AppError(`Cannot create Entretien with candidat id=${candidatId}.`, 404)
        }

        if (!recruteur) {
            throw new AppError(`Cannot create Entretien with recruteur id=${recruteurId}.`, 404)
        }

        if (recruteur.langage && candidat?.langage && recruteur.langage != candidat.langage) {
            throw new AppError("Pas la même techno", 400)
        }

        if (recruteur?.xp && candidat?.xp && recruteur.xp < candidat.xp) {
            throw new AppError( "Recruteur trop jeune", 400)
        }

        const savedEntretien = await this.entretienRepository.save({
            candidatId,
            recruteurId,
            horaire
        });

        await notificationService.envoyerEmailDeConfirmationAuCandidat(candidat?.email || '');
        await notificationService.envoyerEmailDeConfirmationAuRecruteur(recruteur?.email || '');

        return savedEntretien
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
