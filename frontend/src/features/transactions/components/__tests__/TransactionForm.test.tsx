import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionForm } from '../TransactionForm';
import { useTenpistas } from '../../../tenpistas/hooks/useTenpistas';

// Mock the hooks
vi.mock('../../../tenpistas/hooks/useTenpistas', () => ({
    useTenpistas: vi.fn(),
}));

describe('TransactionForm Component', () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const mockTenpistas = [
        { id: 1, name: 'Tenpista 1', rut: '11.111.111-1' },
        { id: 2, name: 'Tenpista 2', rut: '22.222.222-2' }
    ];

    beforeEach(() => {
        vi.resetAllMocks();
        (useTenpistas as any).mockReturnValue({
            tenpistas: mockTenpistas,
            createTenpista: vi.fn(),
        });
    });

    it('renders the form and loads data', () => {
        render(<TransactionForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/Tenpista/i)).toBeDefined();
        expect(screen.getByLabelText(/Monto/i)).toBeDefined();
        expect(screen.getByLabelText(/Comercio \/ Glosa/i)).toBeDefined();
    });

    it('shows validation errors for empty fields', async () => {
        render(<TransactionForm onSubmit={mockOnSubmit} />);

        fireEvent.click(screen.getByRole('button', { name: /Guardar Transacción/i }));

        expect(await screen.findByText(/Seleccione un tenpista válido/i)).toBeDefined();
        expect(await screen.findByText(/El comercio es requerido/i)).toBeDefined();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with correct values', async () => {
        render(<TransactionForm onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/Tenpista/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Monto/i), { target: { value: '5000' } });
        fireEvent.change(screen.getByLabelText(/Comercio \/ Glosa/i), { target: { value: 'Test Store' } });

        // Set a valid past date
        fireEvent.change(screen.getByLabelText(/Fecha y Hora/i), { target: { value: '2020-01-01T12:00' } });

        const submitButton = screen.getByRole('button', { name: /Guardar Transacción/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        }, { timeout: 2000 });

        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            tenpista_id: 1,
            amount: 5000,
            merchant_or_business: 'Test Store'
        }));
    });

    it('opens tenpista modal when plus button is clicked', () => {
        render(<TransactionForm onSubmit={mockOnSubmit} />);

        const plusButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg.lucide-plus'));
        fireEvent.click(plusButtons[0]);

        expect(screen.getByText('Crear Nuevo Tenpista')).toBeDefined();
    });

    it('displays backend error message when submission fails', async () => {
        const mockError = {
            response: {
                data: {
                    detail: 'Error del backend específico'
                }
            }
        };
        const mockOnSubmitError = vi.fn().mockRejectedValue(mockError);

        render(<TransactionForm onSubmit={mockOnSubmitError} />);

        fireEvent.change(screen.getByLabelText(/Tenpista/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Monto/i), { target: { value: '5000' } });
        fireEvent.change(screen.getByLabelText(/Comercio \/ Glosa/i), { target: { value: 'Test Store' } });

        const submitButton = screen.getByRole('button', { name: /Guardar Transacción/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmitError).toHaveBeenCalled();
        }, { timeout: 2000 });

        expect(await screen.findByText('Error del backend específico')).toBeDefined();
    });
});
