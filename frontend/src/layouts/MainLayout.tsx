import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { cn } from '../components/ui/Button';

export const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/':
                return "Resumen General";
            case '/transactions':
                return "Dashboard de Transacciones";
            case '/tenpistas':
                return "Gestión de Tenpistas";
            default:
                return "Tenpo";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 bg-white border-r border-slate-200 w-64 z-50 transform transition-transform lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center space-x-4">
                        <button
                            className="lg:hidden text-slate-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold text-slate-900">
                            {getTitle()}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="text-slate-400 hover:text-slate-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User avatar" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
