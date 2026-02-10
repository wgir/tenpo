import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenpistasApi } from '../api/tenpistas.api';
import type { UpdateTenpistaDTO } from '../types/tenpista.types';

export const useTenpistas = () => {
    const queryClient = useQueryClient();

    const tenpistasQuery = useQuery({
        queryKey: ['tenpistas'],
        queryFn: tenpistasApi.getAll,
        select: (data) => [...data].sort((a, b) => a.name.localeCompare(b.name)),
    });

    const createTenpistaMutation = useMutation({
        mutationFn: tenpistasApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenpistas'] });
        },
    });

    const updateTenpistaMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTenpistaDTO }) =>
            tenpistasApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenpistas'] });
        },
    });

    const deleteTenpistaMutation = useMutation({
        mutationFn: tenpistasApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenpistas'] });
        },
    });

    return {
        tenpistas: tenpistasQuery.data ?? [],
        isLoading: tenpistasQuery.isLoading,
        isError: tenpistasQuery.isError,
        error: tenpistasQuery.error,
        createTenpista: createTenpistaMutation.mutateAsync,
        isCreating: createTenpistaMutation.isPending,
        updateTenpista: updateTenpistaMutation.mutateAsync,
        isUpdating: updateTenpistaMutation.isPending,
        deleteTenpista: deleteTenpistaMutation.mutateAsync,
        isDeleting: deleteTenpistaMutation.isPending,
    };
};
