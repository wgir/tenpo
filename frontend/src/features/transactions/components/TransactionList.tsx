import React from 'react';
import { CreditCard, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import type { Transaction } from '../types/transaction.types';
import { formatDate, formatCurrency } from '../../../utils/date';
import { Select } from '../../../components/ui/Select';
import { useTenpistas } from '../../tenpistas/hooks/useTenpistas';
import { Button } from '../../../components/ui/Button';
import { getErrorMessage } from '../../../utils/errorUtils';

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
    isLoading?: boolean;
    filterTenpistaId?: number;
    onFilterChange?: (tenpistaId: number | undefined) => void;
    error?: Error | null;
    onDismissError?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
    transactions,
    onEdit,
    onDelete,
    isLoading,
    filterTenpistaId,
    onFilterChange,
    error,
    onDismissError
}) => {
    const { tenpistas, isLoading: isLoadingTenpistas } = useTenpistas();

    const handleDelete = (id: number) => {
        if (window.confirm('¿Está seguro de eliminar el registro?')) {
            onDelete(id);
        }
    };

    const tenpistaOptions = [
        { value: '', label: 'Todos los tenpistas' },
        ...tenpistas.map(t => ({
            value: t.id,
            label: t.name
        }))
    ];

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onFilterChange?.(value ? Number(value) : undefined);
    };

    const displayTransactions = filterTenpistaId
        ? transactions.filter(t => t.tenpista_id === filterTenpistaId)
        : transactions;
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 w-full animate-pulse bg-slate-100 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-red-800">Error al realizar la operación</p>
                            <p className="text-sm text-red-700 mt-1">{getErrorMessage(error)}</p>
                        </div>
                        {onDismissError && (
                            <button
                                onClick={onDismissError}
                                className="ml-3 text-red-400 hover:text-red-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Simple Filters */}
            <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Select
                        label="Filtrar por Tenpista"
                        options={tenpistaOptions}
                        value={filterTenpistaId ?? ''}
                        onChange={handleFilterChange}
                        disabled={isLoadingTenpistas}
                    />
                </div>
            </div>


            {displayTransactions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <CreditCard className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">Sin transacciones</h3>
                    <p className="text-slate-500">
                        {filterTenpistaId
                            ? 'Este tenpista aún no tiene transacciones registradas.'
                            : 'Aún no se han registrado transacciones en el sistema.'}
                    </p>
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-500 text-sm">
                            <th className="pb-4 font-medium">Tenpista</th>
                            <th className="pb-4 font-medium">Negocio</th>
                            <th className="pb-4 font-medium">Fecha</th>
                            <th className="pb-4 font-medium">Monto</th>
                            <th className="pb-4 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {displayTransactions.map((transaction) => (
                            <tr key={transaction.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                            {(transaction.tenpista_name || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-slate-900">{transaction.tenpista_name || 'Sin nombre'}</span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                        {transaction.merchant_or_business}
                                    </span>
                                </td>
                                <td className="py-4 text-slate-600">{formatDate(transaction.date)}</td>
                                <td className="py-4 text-right">{formatCurrency(transaction.amount)}</td>
                                <td className="py-4 text-right">
                                    <div className="flex items-center justify-end space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(transaction)}
                                            className="h-8 w-8 text-slate-400 hover:text-primary-600"
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(transaction.id)}
                                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
