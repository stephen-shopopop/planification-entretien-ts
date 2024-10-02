import type Candidat from '../../infrastructure/models/candidat.model';
import { CandidatRepository, type ICandidatRepository } from '../../infrastructure/repositories/candidat.repository';
import type { Request, Response } from 'express';

class CandidatService {
    #candidate: ICandidatRepository

    constructor(readonly candidateRepository: ICandidatRepository){
        this.#candidate = candidateRepository
    }

    async save(req: Request, res: Response) {
        let isEmailValid: boolean;

        const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        isEmailValid = regexp.test(req.body.email);

        if (!req.body.langage || !req.body.xp || req.body.xp < 0 || !req.body.email || !isEmailValid) {
            res.status(400).send({
                message: 'Content can not be empty!'
            });
            return;
        }

        const candidat: Candidat = req.body;

        const savedCandidat = await this.#candidate.save(candidat);

        res.status(201).send(savedCandidat);
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

export default new CandidatService(new CandidatRepository());
