import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency } from '../date';

describe('Date Utilities', () => {
    describe('formatDate', () => {
        it('should format ISO date strings correctly', () => {
            const date = '2024-02-04T15:00:00.000Z';
            // Output depends on locale, but we can check if it contains expected parts
            // For Spanish locale it might be '4 de feb. de 2024'
            const formatted = formatDate(date);
            expect(formatted).toContain('2024');
        });

        it('should return N/A for invalid dates', () => {
            expect(formatDate('')).toBe('N/A');
            expect(formatDate(null as any)).toBe('N/A');
        });
    });

    describe('formatCurrency', () => {
        it('should format numbers to CLP currency', () => {
            expect(formatCurrency(1000)).toContain('1.000');
            expect(formatCurrency(1000)).toContain('$');
        });

        it('should handle zero value', () => {
            expect(formatCurrency(0)).toContain('0');
        });
    });
});
