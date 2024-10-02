import type { Recruteur, IRecruteurRepository } from '../domain/recruteur.interface';
import {  SqlRecruteurRepository } from '../infrastructure/repositories/recruteur.repository';
import { AppError } from '../shared/apiError';

class RecruteurService {

    constructor(private readonly recruteurRepository: IRecruteurRepository){ /** */}

    async save({email, langage, xp}: Recruteur) {
        const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!langage || !xp || xp < 0 || !email || !regexp.test(email)) {
            throw new AppError('Content can not be empty!', 400)
        }

        return await this.recruteurRepository.save({
            email,
            langage,
            xp
        });
    }

    async retrieveAll(searchParams: { email?: string }): Promise<Recruteur[]> {
        return await this.recruteurRepository.retrieveAll(searchParams);
    }

    async retrieveById(recruteurId: number): Promise<Recruteur | null> {
        return await this.recruteurRepository.retrieveById(recruteurId);
    }

    async update(recruteur: Recruteur): Promise<number> {
        return await this.recruteurRepository.update(recruteur);
    }

    async delete(recruteurId: number): Promise<number> {
        return await this.recruteurRepository.delete(recruteurId);
    }

    async deleteAll(): Promise<number> {
        return await this.recruteurRepository.deleteAll();
    }
}

export default new RecruteurService(new SqlRecruteurRepository());
