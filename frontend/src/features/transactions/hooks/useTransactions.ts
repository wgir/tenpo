import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type { UpdateTransactionDTO } from '../types/transaction.types';

export const useTransactions = () => {
    const queryClient = useQueryClient();

    const transactionsQuery = useQuery({
        queryKey: ['transactions'],
        queryFn: transactionsApi.getAll,
        select: (data) => [...data].sort((a, b) => {
            const nameCompare = a.tenpista_name.localeCompare(b.tenpista_name);
            if (nameCompare !== 0) return nameCompare;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }),
    });

    const createTransactionMutation = useMutation({
        mutationFn: transactionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    const updateTransactionMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTransactionDTO }) =>
            transactionsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    const deleteTransactionMutation = useMutation({
        mutationFn: transactionsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    return {
        transactions: transactionsQuery.data ?? [],
        isLoading: transactionsQuery.isLoading,
        isError: transactionsQuery.isError,
        error: transactionsQuery.error,
        createTransaction: createTransactionMutation.mutateAsync,
        isCreating: createTransactionMutation.isPending,
        updateTransaction: updateTransactionMutation.mutateAsync,
        isUpdating: updateTransactionMutation.isPending,
        deleteTransaction: deleteTransactionMutation.mutateAsync,
        isDeleting: deleteTransactionMutation.isPending,
    };
};
