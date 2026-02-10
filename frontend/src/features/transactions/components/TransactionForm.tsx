import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { transactionSchema, type TransactionFormValues } from '../schemas/transaction.schema';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useTenpistas } from '../../tenpistas/hooks/useTenpistas';
import { TenpistaForm } from '../../tenpistas/components/TenpistaForm';

interface TransactionFormProps {
    onSubmit: (values: TransactionFormValues) => Promise<void>;
    initialValues?: Partial<TransactionFormValues>;
    isLoading?: boolean;
}

const toLocalISOString = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialValues, isLoading }) => {
    const { tenpistas, createTenpista } = useTenpistas();
    const [isTenpistaModalOpen, setIsTenpistaModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            ...initialValues,
            date: initialValues?.date
                ? toLocalISOString(new Date(initialValues.date))
                : toLocalISOString(new Date()),
        },
    });

    useEffect(() => {
        if (initialValues) {
            reset({
                ...initialValues,
                date: initialValues.date
                    ? toLocalISOString(new Date(initialValues.date))
                    : toLocalISOString(new Date()),
            });
        }
    }, [initialValues, reset]);

    const tenpistaOptions = tenpistas.map(t => ({ value: t.id, label: t.name }));

    const handleFormSubmit = async (values: TransactionFormValues) => {
        try {
            clearErrors('root');
            await onSubmit(values);
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Ocurrió un error al guardar la transacción';
            setError('root', { message });
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div className="space-y-4">
                    <div className="flex items-end space-x-2">
                        <div className="flex-1">
                            <Select
                                label="Tenpista"
                                options={tenpistaOptions}
                                placeholder="Seleccione un tenpista"
                                error={errors.tenpista_id?.message}
                                {...register('tenpista_id', { valueAsNumber: true })}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setIsTenpistaModalOpen(true)}
                            className="mb-1"
                        >
                            <Plus size={20} />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="number"
                        label="Monto (CLP)"
                        placeholder="0"
                        error={errors.amount?.message}
                        {...register('amount', { valueAsNumber: true })}
                    />
                    <Input
                        type="datetime-local"
                        label="Fecha y Hora"
                        error={errors.date?.message}
                        {...register('date')}
                    />
                </div>

                <Input
                    label="Comercio / Glosa"
                    placeholder="Ej: Starbuck Plaza Italia"
                    error={errors.merchant_or_business?.message}
                    {...register('merchant_or_business')}
                />
                <div className="pt-6">
                    <Button type="submit" isLoading={isLoading} className="w-full h-12 text-lg">
                        Guardar Transacción
                    </Button>
                </div>
                {errors.root && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                        {errors.root.message}
                    </div>
                )}
            </form>

            <Modal
                isOpen={isTenpistaModalOpen}
                onClose={() => setIsTenpistaModalOpen(false)}
                title="Crear Nuevo Tenpista"
            >
                <TenpistaForm
                    onSubmit={async (values) => {
                        const newTenpista = await createTenpista(values);
                        setValue('tenpista_id', newTenpista.id);
                        setIsTenpistaModalOpen(false);
                    }}
                />
            </Modal>
        </div>
    );
};
