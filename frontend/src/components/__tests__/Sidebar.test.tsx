import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '../Sidebar';
import { BrowserRouter } from 'react-router-dom';

describe('Sidebar', () => {
    it('renders all navigation links', () => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        expect(screen.getByText(/Overview/i)).toBeInTheDocument();
        expect(screen.getByText(/Transacciones/i)).toBeInTheDocument();
        expect(screen.getByText(/Tenpistas/i)).toBeInTheDocument();
        // Clientes should NOT be present
        expect(screen.queryByText(/Clientes/i)).not.toBeInTheDocument();
    });

    it('has correct links to paths', () => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        expect(screen.getByRole('link', { name: /Overview/i })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: /Transacciones/i })).toHaveAttribute('href', '/transactions');
        expect(screen.getByRole('link', { name: /Tenpistas/i })).toHaveAttribute('href', '/tenpistas');
    });
});
