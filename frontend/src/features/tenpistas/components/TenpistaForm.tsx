import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenpistaSchema, type TenpistaFormValues } from '../schemas/tenpista.schema';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface TenpistaFormProps {
    onSubmit: (values: TenpistaFormValues) => Promise<void>;
    initialValues?: Partial<TenpistaFormValues & { id: number }>;
    isLoading?: boolean;
}

export const TenpistaForm: React.FC<TenpistaFormProps> = ({ onSubmit, initialValues, isLoading }) => {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<TenpistaFormValues>({
        resolver: zodResolver(tenpistaSchema),
        defaultValues: initialValues,
    });

    const handleFormSubmit = async (values: TenpistaFormValues) => {
        try {
            clearErrors('root');
            await onSubmit(values);
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Ocurrió un error al guardar el tenpista';
            setError('root', { message });
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
                label="Nombre del Tenpista"
                placeholder="Ej: Maria Lopez"
                error={errors.name?.message}
                {...register('name')}
            />
            <Input
                label="RUT del Tenpista"
                placeholder="Ej: 12345678-9"
                error={errors.rut?.message}
                {...register('rut')}
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="submit" isLoading={isLoading} className="w-full">
                    {initialValues?.id ? 'Actualizar Tenpista' : 'Guardar Tenpista'}
                </Button>
            </div>
            {errors.root && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {errors.root.message}
                </div>
            )}
        </form>
    );
};
