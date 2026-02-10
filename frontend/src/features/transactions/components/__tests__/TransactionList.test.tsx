import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionList } from '../TransactionList';
import type { Transaction } from '../../types/transaction.types';

describe('TransactionList Component', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnDismissError = vi.fn();

    const mockTransactions: Transaction[] = [
        {
            id: 1,
            tenpista_id: 1,
            amount: 1000,
            date: '2023-01-01T10:00:00.000Z',
            merchant_or_business: 'Store A',
            tenpista_name: 'Tenpista A',
        },
        {
            id: 2,
            tenpista_id: 2,
            amount: 2000,
            date: '2023-01-02T11:00:00.000Z',
            merchant_or_business: 'Store B',
            tenpista_name: 'Tenpista B',
        },
    ];

    it('renders loading state', () => {
        render(
            <TransactionList
                transactions={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                isLoading={true}
            />
        );
        const skeletons = screen.getAllByRole('generic').filter(el => el.className.includes('animate-pulse'));
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders empty state', () => {
        render(
            <TransactionList
                transactions={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        expect(screen.getByText(/Sin transacciones/i)).toBeDefined();
        expect(screen.getByText(/Aún no se han registrado transacciones/i)).toBeDefined();
    });

    it('renders a list of transactions', () => {
        render(
            <TransactionList
                transactions={mockTransactions}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        expect(screen.getByText('Tenpista A')).toBeDefined();
        expect(screen.getByText('Store A')).toBeDefined();
        expect(screen.getByText('Tenpista B')).toBeDefined();
        expect(screen.getByText('Store B')).toBeDefined();
    });

    it('calls onEdit when edit button is clicked', () => {
        render(
            <TransactionList
                transactions={mockTransactions}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        // Find edit button (assuming first one)
        const editButtons = screen.getAllByRole('button');
        const editButton = editButtons.find(btn => btn.querySelector('svg.lucide-edit-2'));
        // Or find based on class if needed, or aria-label if we added one (we should add aria-label)
        // For now, let's rely on the svg presence or mock details
        // Wait, the previous test code used:
        // const editButtons = screen.getAllByRole('button');
        // const editButton = editButtons.find(btn => btn.querySelector('svg'));

        // Let's assume the first button in the actions cell is edit.
        // Actually, let's just create a test id or aria-label in a future refactor.
        // For now, looking for the svg class in the rendered output:
        // 'text-slate-400 hover:text-primary-600' class is on the edit button

        const editBtn = editButtons.find(btn => btn.className.includes('hover:text-primary-600'));
        if (editBtn) fireEvent.click(editBtn);
        expect(mockOnEdit).toHaveBeenCalledWith(mockTransactions[0]);
    });
});
