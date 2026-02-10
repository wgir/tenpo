export interface Transaction {
    id: number;
    amount: number;
    merchant_or_business: string;
    tenpista_id: number;
    date: string;
    tenpista_name: string;
}

export type CreateTransactionDTO = Omit<Transaction, 'id' | 'tenpista_name'>;
export type UpdateTransactionDTO = Partial<CreateTransactionDTO>;
