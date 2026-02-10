import axiosInstance from '../../../api/axiosInstance';
import type { Transaction, CreateTransactionDTO, UpdateTransactionDTO } from '../types/transaction.types';

export const transactionsApi = {
    getAll: async (): Promise<Transaction[]> => {
        const { data } = await axiosInstance.get('/transactions');
        return data;
    },
    getById: async (id: number): Promise<Transaction> => {
        const { data } = await axiosInstance.get(`/transactions/${id}`);
        return data;
    },
    create: async (transaction: CreateTransactionDTO): Promise<Transaction> => {
        const { data } = await axiosInstance.post('/transactions', transaction);
        return data;
    },
    update: async (id: number, transaction: UpdateTransactionDTO): Promise<Transaction> => {
        const { data } = await axiosInstance.put(`/transactions/${id}`, transaction);
        return data;
    },
    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/transactions/${id}`);
    },
};
