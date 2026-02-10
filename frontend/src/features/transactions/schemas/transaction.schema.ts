import { z } from 'zod';

export const transactionSchema = z.object({
    amount: z.number().or(z.nan()).refine((val) => !Number.isNaN(val), 'El monto es requerido').refine((val) => val >= 0, 'El monto no puede ser negativo'),
    merchant_or_business: z.string().min(1, 'El comercio es requerido'),
    tenpista_id: z.number().or(z.nan()).refine((val) => !Number.isNaN(val) && val > 0, 'Seleccione un tenpista válido'),
    date: z.string().refine((date) => {
        return new Date(date) <= new Date();
    }, 'La fecha no puede ser futura'),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
