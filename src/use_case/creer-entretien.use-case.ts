import { SqlCandidatRepository } from "../infrastructure/repositories/candidat.repository";
import { SqlRecruteurRepository } from "../infrastructure/repositories/recruteur.repository";
import { AppError } from "../shared/apiError";
import notificationService from "./notification.service";
import { SqlEntretienRepository } from "../infrastructure/repositories/entretien.repository";
import { IEntretienRepository } from "../domain/port/entretien-repository";
import { ICandidatRepository } from "../domain/port/candidat-repository";
import { IRecruteurRepository } from "../domain/port/recruteur-repository";
import { Candidat } from "../domain/entity/candidat";
import { Recruteur } from "../domain/entity/recruteur";

export class CréerEntretien {
  #sqlEntretienRepository: SqlEntretienRepository
  #sqlCandidatRepository: SqlCandidatRepository
  #sqlRecruteurRepository: SqlRecruteurRepository

  constructor(
    private readonly sqlEntretienRepository: IEntretienRepository,
    private readonly sqlCandidatRepository: ICandidatRepository,
    private readonly sqlRecruteurRepository: IRecruteurRepository
  ){
    this.#sqlEntretienRepository = sqlEntretienRepository
    this.#sqlCandidatRepository = sqlCandidatRepository
    this.#sqlRecruteurRepository = sqlRecruteurRepository
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

  async execute (recruteurId: number, candidatId: number, horaire?: string){
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

    await notificationService.envoyerEmailDeConfirmationAuCandidat(candidat?.email || '');
    await notificationService.envoyerEmailDeConfirmationAuRecruteur(recruteur?.email || '');

    return savedEntretien
  }
}
