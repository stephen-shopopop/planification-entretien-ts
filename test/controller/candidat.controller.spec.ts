import candidatRepository from '../../src/infrastructure/repositories/candidat.repository.mongo';
import { start } from '../../src/server';
import express, { Application } from "express";
import Server, { CandidatModel } from '../../src';
import { Candidat } from '../../src/domain/candidat.domain';

const app: Application = express();
const server: Server = new Server(app);
const srv = start(app, server, 8081);

const request = require('supertest');

async function createCandidat(params: any) {
    const {id} = await candidatRepository.save(new Candidat('', params.langage, params.email, params.xp));
    return id;
}

describe("Candidat", () => {

    beforeAll(async  () => {
       await candidatRepository.deleteAll();
    });

    beforeEach(async  () => {
       await candidatRepository.deleteAll();
    });

    afterAll(async () => {
        await candidatRepository.deleteAll();
        srv.close();
    });

    it("Un candidat est crée quand toutes ses informations sont complètes", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", email: "candidat@mail.com", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(201);

        const candidat = await candidatRepository.retrieveById(response.body.id);
        expect(candidat).not.toBeNull();
    });

    it("Un candidat n'est pas crée quand sa techno principale est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({email: "candidat@mail.com", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);
    });

    it("Un candidat n'est pas crée quand son email est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);
    });

    it("Un candidat n'est pas crée quand son email est incorrect", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", email: "invalid-email", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({email: 'invalid-email'});
        expect(candidats.length).toBe(0);
    });

    it("Un candidat n'est pas crée quand son nombre d'années d'expérience est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", email: "candidat-annee-xp-vide@mail.com"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({email: 'candidat-annee-xp-vide@mail.com'});
        expect(candidats.length).toBe(0);
    });

    it("Un candidat n'est pas crée quand son nombre d'années d'expérience est négatif", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", email: "candidat-annee-xp-negatif@mail.com", xp: -1})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({email: 'candidat-annee-xp-negatif'});
        expect(candidats.length).toBe(0);
    });

    it("Trouve un candidat existant", async () => {
        // given
        const id = await createCandidat({langage: "java", email: "candidat-existant@mail.com", xp: 5});

        // when
        const response = await request(app)
            .get('/api/candidat/' + id);

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body.langage).toEqual("java");
        expect(response.body.email).toEqual("candidat-existant@mail.com");
        expect(response.body.xp).toEqual(5);

        const candidats = await candidatRepository.retrieveAll({email:'candidat-existant@mail.com'});
        expect(candidats.length).toBe(1);
    });

    it("Ne trouve pas un candidat inexistant", async () => {
        // when
        const response = await request(app)
            .get('/api/candidat/66fc61c66a450d010406cd42');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Supprime un candidat existant", async () => {
        // given
        const id = await createCandidat({langage: "java", email: "candidat@mail.com", xp: 5});

        // when
        const response = await request(app)
            .delete('/api/candidat/' + id);

        // then
        expect(response.statusCode).toBe(204);

        const candidat = await candidatRepository.retrieveById(id || '');
        expect(candidat).toBe(null);
    });

    it("Ne supprime pas un candidat inexistant", async () => {
        // when
        const response = await request(app)
            .delete('/api/candidat/66fc61c66a450d010406cd42');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Met à jour un candidat existant", async () => {
        // given
        const id = await createCandidat({langage: "java", email: "candidat@mail.com", xp: 5});

        // when
        const response = await request(app)
            .put('/api/candidat/' + id)
            .send({langage: "c#"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(204);

        const candidat = await candidatRepository.retrieveById(id || 0);
        expect(candidat?.langage).toBe('c#');
    });

    it("Ne met pas à jour un candidat inexistant", async () => {
        // when
        const response = await request(app)
            .put('/api/candidat/66fc61c66a450d010406cd42')
            .send({langage: "c#"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Retourne tous les candidats", async () => {
        // given
        await createCandidat({langage: "java", email: "candidat@mail.com", xp: 5});

        // when
        const response = await request(app)
            .get('/api/candidat');

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body[0].langage).toEqual("java");
        expect(response.body[0].email).toEqual("candidat@mail.com");
        expect(response.body[0].xp).toEqual(5);
    });

    it("Supprime tous les candidats", async () => {
        // given
        await createCandidat({langage: "java", email: "candidat-a-supprimer@mail.com", xp: 5});

        // when
        const response = await request(app)
            .delete('/api/candidat');

        // then
        expect(response.statusCode).toBe(204);
        const candidats = await candidatRepository.retrieveAll({email: 'candidat-a-supprimer@email.com'});
        expect(candidats.length).toBe(0);
    });
});
