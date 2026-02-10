import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TenpistaForm } from '../TenpistaForm';

describe('TenpistaForm Component', () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    it('renders the form with empty values', () => {
        render(<TenpistaForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/Nombre del Tenpista/i)).toBeDefined();
        expect(screen.getByLabelText(/RUT del Tenpista/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Guardar Tenpista/i })).toBeDefined();
    });

    it('renders with initial values for editing', () => {
        const initialValues = { id: 1, name: 'Existing Tenpista', rut: '12345678-9' };
        render(<TenpistaForm onSubmit={mockOnSubmit} initialValues={initialValues} />);

        expect(screen.getByDisplayValue('Existing Tenpista')).toBeDefined();
        expect(screen.getByDisplayValue('12345678-9')).toBeDefined();
        expect(screen.getByRole('button', { name: /Actualizar Tenpista/i })).toBeDefined();
    });

    it('shows validation errors for empty fields', async () => {
        render(<TenpistaForm onSubmit={mockOnSubmit} />);

        fireEvent.click(screen.getByRole('button', { name: /Guardar Tenpista/i }));

        expect(await screen.findByText(/El nombre debe tener al menos 3 caracteres/i)).toBeDefined();
        expect(await screen.findByText(/El RUT es inválido/i)).toBeDefined();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with form values when valid', async () => {
        render(<TenpistaForm onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/Nombre del Tenpista/i), { target: { value: 'New Tenpista' } });
        fireEvent.change(screen.getByLabelText(/RUT del Tenpista/i), { target: { value: '12345678-9' } });

        const submitButton = screen.getByRole('button', { name: /Guardar Tenpista/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        }, { timeout: 2000 });

        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            name: 'New Tenpista',
            rut: '12345678-9'
        }));
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

        render(<TenpistaForm onSubmit={mockOnSubmitError} />);

        fireEvent.change(screen.getByLabelText(/Nombre del Tenpista/i), { target: { value: 'New Tenpista' } });
        fireEvent.change(screen.getByLabelText(/RUT del Tenpista/i), { target: { value: '12345678-9' } });

        const submitButton = screen.getByRole('button', { name: /Guardar Tenpista/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmitError).toHaveBeenCalled();
        }, { timeout: 2000 });

        expect(await screen.findByText('Error del backend específico')).toBeDefined();
    });
});
