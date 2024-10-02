export interface Candidat {
  id?: number;
  langage?: string;
  email?: string;
  xp?: number;
}

export interface ICandidatRepository {
  save: (candidat: Candidat) => Promise<Candidat>
  retrieveById: (candidatId: number) => Promise<Candidat | null>
  retrieveAll: (searchParams: {email?: string}) => Promise<Candidat[]>
  update: (candidat: Candidat) => Promise<number>
  delete: (candidatId: number) => Promise<number>
  deleteAll: () => Promise<number>
}
