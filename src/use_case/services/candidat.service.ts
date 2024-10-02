import { SqlCandidatRepository, type Candidat, type ICandidatRepository } from '../../infrastructure/repositories/candidat.repository';
import { AppError } from '../../shared/apiError';

class CandidatService {
    #candidate: ICandidatRepository

    constructor(readonly candidateRepository: ICandidatRepository){
        this.#candidate = candidateRepository
    }

    async save({ langage, xp, email }: Candidat) {
        const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!langage || !xp || xp < 0 || !email || !regexp.test(email)) {
            throw new AppError('Content can not be empty!', 400)
        }

        return await this.#candidate.save({
            langage,
            xp, 
            email
        });
    }

    async retrieveAll(searchParams: { email?: string }): Promise<Candidat[]> {
        return await this.#candidate.retrieveAll(searchParams);
    }

    async retrieveById(candidatId: number): Promise<Candidat | null> {
        return await this.#candidate.retrieveById(candidatId);
    }

    async update(candidat: Candidat): Promise<number> {
        return await this.#candidate.update(candidat);
    }

    async delete(candidatId: number): Promise<number> {
        return await this.#candidate.delete(candidatId);
    }

    async deleteAll(): Promise<number> {
        return await this.#candidate.deleteAll();
    }
}

export default new CandidatService(new SqlCandidatRepository());
