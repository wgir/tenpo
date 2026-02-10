import React from 'react';
import { useTenpistas } from '../features/tenpistas/hooks/useTenpistas';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { UserCircle, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, to }: { title: string, value: number | string, icon: any, color: string, to: string }) => (
    <Link to={to} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <ArrowRight size={20} className="text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-slate-500 font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
    </Link>
);

export const OverviewPage: React.FC = () => {
    const { tenpistas, isLoading: isLoadingTenpistas } = useTenpistas();
    const { transactions, isLoading: isLoadingTransactions } = useTransactions();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Resumen General</h2>
                <p className="text-slate-500">Vista rápida del estado de tu plataforma Tenpo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Total Tenpistas"
                    value={isLoadingTenpistas ? '...' : (tenpistas?.length || 0)}
                    icon={UserCircle}
                    color="bg-purple-500"
                    to="/tenpistas"
                />
                <StatCard
                    title="Total Transacciones"
                    value={isLoadingTransactions ? '...' : (transactions?.length || 0)}
                    icon={BarChart3}
                    color="bg-emerald-500"
                    to="/transactions"
                />
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Actividad Reciente</h3>
                <p className="text-slate-500 text-sm">Aquí podrías mostrar las últimas transacciones o acciones realizadas en el sistema.</p>
                {/* Future: Add a mini table or list here */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-center h-32 text-slate-400 italic">
                        No hay actividad reciente para mostrar.
                    </div>
                </div>
            </div>
        </div>
    );
};
