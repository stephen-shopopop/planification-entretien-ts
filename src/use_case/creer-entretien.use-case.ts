import type { SqlCandidatRepository } from "../infrastructure/repositories/candidat.repository";
import type { SqlRecruteurRepository } from "../infrastructure/repositories/recruteur.repository";
import { AppError } from "../shared/apiError";
import type { SqlEntretienRepository } from "../infrastructure/repositories/entretien.repository";
import type { IEntretienRepository } from "../domain/port/entretien-repository";
import type { ICandidatRepository } from "../domain/port/candidat-repository";
import type { IRecruteurRepository } from "../domain/port/recruteur-repository";
import type { Candidat } from "../domain/entity/candidat";
import type { Recruteur } from "../domain/entity/recruteur";
import type { INotificationRepository } from "../domain/port/notification-repository";
import type { NotificationService } from "../infrastructure/repositories/notifications.repository";

export class CréerEntretien {
  #sqlEntretienRepository: SqlEntretienRepository
  #sqlCandidatRepository: SqlCandidatRepository
  #sqlRecruteurRepository: SqlRecruteurRepository
  #notificationRepository: NotificationService

  constructor(
    private readonly sqlEntretienRepository: IEntretienRepository,
    private readonly sqlCandidatRepository: ICandidatRepository,
    private readonly sqlRecruteurRepository: IRecruteurRepository,
    private readonly notificationRepository: INotificationRepository
  ){
    this.#sqlEntretienRepository = sqlEntretienRepository
    this.#sqlCandidatRepository = sqlCandidatRepository
    this.#sqlRecruteurRepository = sqlRecruteurRepository
    this.#notificationRepository = notificationRepository
  }

  #assertRecruteurDisponility(disponibiliteRecruteur?: string, horaire?: string){
    if (disponibiliteRecruteur !== horaire) {
      throw new AppError( "Pas les mêmes horaires!", 400)
    }
  }

  #assertCandidat(candidatId: number, candidat: Candidat | null) {
    if (!candidat) {
      throw new AppError(`Cannot create Entretien with candidat id=${candidatId}.`, 404)
    }

    return candidat
  }

  #assertRecruteur(recruteurId: number, recruteur: Recruteur | null) {
    if (!recruteur) {
      throw new AppError(`Cannot create Entretien with candidat id=${recruteurId}.`, 404)
    }

    return recruteur
  }

  #assertAndCoerceUsersLangage(recruteur: Recruteur, candidat: Candidat){
    if (recruteur.langage && candidat?.langage && recruteur.langage != candidat.langage) {
      throw new AppError("Pas la même techno", 400)
    }
  }

  #assertAndCoerceUsersAge(recruteur: Recruteur, candidat: Candidat){
    if (recruteur?.xp && candidat?.xp && recruteur.xp < candidat.xp) {
      throw new AppError( "Recruteur trop jeune", 400)
    }
  }

  async execute ({
    recruteurId,
    candidatId,
    horaire,
    disponibiliteRecruteur
  }: {
    horaire?: string;
    candidatId: number;
    recruteurId: number;
    disponibiliteRecruteur?: string 
  }){
    this.#assertRecruteurDisponility(disponibiliteRecruteur, horaire)    

    const recruteur = await this.#sqlRecruteurRepository.retrieveById(recruteurId)
    const candidat = await this.#sqlCandidatRepository.retrieveById(candidatId)

    const candidatProfil = this.#assertCandidat(candidatId, candidat)
    const recruteurProfil = this.#assertRecruteur(recruteurId, recruteur)

    this.#assertAndCoerceUsersLangage(recruteurProfil, candidatProfil)
    this.#assertAndCoerceUsersAge(recruteurProfil, candidatProfil)

    const savedEntretien = await this.#sqlEntretienRepository.save({
        candidatId,
        recruteurId,
        horaire
    });

    await this.#notificationRepository.envoyerEmailDeConfirmationAuCandidat(candidat?.email || '');
    await this.#notificationRepository.envoyerEmailDeConfirmationAuRecruteur(recruteur?.email || '');

    return savedEntretien
  }
}
