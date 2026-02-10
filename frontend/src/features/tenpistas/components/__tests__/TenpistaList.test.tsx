import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TenpistaList } from '../TenpistaList';
import type { Tenpista } from '../../types/tenpista.types';

const mockTenpistas: Tenpista[] = [
    { id: 1, name: 'Tenpista 1', rut: '11111111-1' },
    { id: 2, name: 'Tenpista 2', rut: '22222222-2' },
];

describe('TenpistaList Component', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it('renders loading state', () => {
        render(
            <TenpistaList
                tenpistas={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                isLoading={true}
            />
        );
        const skeletonElements = screen.getAllByRole('generic').filter(el => el.className.includes('animate-pulse'));
        expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('renders empty state', () => {
        render(
            <TenpistaList
                tenpistas={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                isLoading={false}
            />
        );
        expect(screen.getByText('No hay tenpistas')).toBeDefined();
        expect(screen.getByText('Comienza agregando un nuevo tenpista al sistema.')).toBeDefined();
    });

    it('renders a list of tenpistas', () => {
        render(
            <TenpistaList
                tenpistas={mockTenpistas}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        expect(screen.getByText('Tenpista 1')).toBeDefined();
        expect(screen.getByText('Tenpista 2')).toBeDefined();
        expect(screen.getByText('11111111-1')).toBeDefined();
    });

    it('calls onEdit when edit button is clicked', () => {
        render(
            <TenpistaList
                tenpistas={mockTenpistas}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        const editButtons = screen.getAllByRole('button').filter(btn => btn.parentElement?.className.includes('justify-end'));
        fireEvent.click(editButtons[0]);
        expect(mockOnEdit).toHaveBeenCalledWith(mockTenpistas[0]);
    });

    it('calls onDelete when delete button is clicked and confirmed', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

        render(
            <TenpistaList
                tenpistas={mockTenpistas}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const deleteButtons = screen.getAllByRole('button').filter(btn => btn.className.includes('hover:text-red-600'));
        fireEvent.click(deleteButtons[0]);

        expect(confirmSpy).toHaveBeenCalled();
        expect(mockOnDelete).toHaveBeenCalledWith(mockTenpistas[0].id);

        confirmSpy.mockRestore();
    });
});
