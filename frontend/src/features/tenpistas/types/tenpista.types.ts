export interface Tenpista {
    id: number;
    name: string;
    rut: string;
}

export type CreateTenpistaDTO = Omit<Tenpista, 'id'>;
export type UpdateTenpistaDTO = Partial<CreateTenpistaDTO>;
