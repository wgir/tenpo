import axiosInstance from '../../../api/axiosInstance';
import type { Tenpista, CreateTenpistaDTO, UpdateTenpistaDTO } from '../types/tenpista.types';

export const tenpistasApi = {
    getAll: async (): Promise<Tenpista[]> => {
        const { data } = await axiosInstance.get('/tenpistas');
        return data;
    },
    getById: async (id: number): Promise<Tenpista> => {
        const { data } = await axiosInstance.get(`/tenpistas/${id}`);
        return data;
    },
    create: async (tenpista: CreateTenpistaDTO): Promise<Tenpista> => {
        const { data } = await axiosInstance.post('/tenpistas', tenpista);
        return data;
    },
    update: async (id: number, tenpista: UpdateTenpistaDTO): Promise<Tenpista> => {
        const { data } = await axiosInstance.put(`/tenpistas/${id}`, tenpista);
        return data;
    },
    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/tenpistas/${id}`);
    },
};
