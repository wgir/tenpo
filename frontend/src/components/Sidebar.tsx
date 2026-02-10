import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    UserCircle,
    LayoutDashboard
} from 'lucide-react';
import { cn } from './ui/Button';

interface SidebarItemProps {
    to: string;
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => cn(
            "flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-colors",
            isActive
                ? "bg-primary-50 text-primary-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

interface SidebarProps {
    onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
    return (
        <div className="h-full flex flex-col p-6">
            <div className="flex items-center space-x-2 mb-10">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Tenpo
                </span>
            </div>

            <nav className="flex-1 space-y-2">
                <SidebarItem
                    to="/"
                    icon={LayoutDashboard}
                    label="Overview"
                    onClick={onItemClick}
                />
                <SidebarItem
                    to="/transactions"
                    icon={BarChart3}
                    label="Transacciones"
                    onClick={onItemClick}
                />
                <SidebarItem
                    to="/tenpistas"
                    icon={UserCircle}
                    label="Tenpistas"
                    onClick={onItemClick}
                />
            </nav>
        </div>
    );
};
