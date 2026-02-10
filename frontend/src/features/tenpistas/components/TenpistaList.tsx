import React from 'react';
import { Edit2, Trash2, UserCircle, AlertCircle, X } from 'lucide-react';
import type { Tenpista } from '../types/tenpista.types';
import { Button } from '../../../components/ui/Button';
import { getErrorMessage } from '../../../utils/errorUtils';

interface TenpistaListProps {
    tenpistas: Tenpista[];
    onEdit: (tenpista: Tenpista) => void;
    onDelete: (id: number) => void;
    isLoading?: boolean;
    error?: Error | null;
    onDismissError?: () => void;
}

export const TenpistaList: React.FC<TenpistaListProps> = ({ tenpistas, onEdit, onDelete, isLoading, error, onDismissError }) => {
    const handleDelete = (id: number) => {
        if (window.confirm('¿Está seguro de eliminar el registro?')) {
            onDelete(id);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 w-full animate-pulse bg-slate-100 rounded-lg" />
                ))}
            </div>
        );
    }


    if (tenpistas.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <UserCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">No hay tenpistas</h3>
                <p className="text-slate-500">Comienza agregando un nuevo tenpista al sistema.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
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

            {tenpistas.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <UserCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No hay tenpistas</h3>
                    <p className="text-slate-500">Comienza agregando un nuevo tenpista al sistema.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                <th className="pb-4 font-medium">Nombre</th>
                                <th className="pb-4 font-medium">RUT</th>
                                <th className="pb-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tenpistas.map((tenpista) => (
                                <tr key={tenpista.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                                {(tenpista.name || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-900">{tenpista.name || 'Sin nombre'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-slate-600">{tenpista.rut}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(tenpista)}
                                                className="h-8 w-8 text-slate-400 hover:text-primary-600"
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(tenpista.id)}
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
                </div>
            )}
        </div>
    );
};
