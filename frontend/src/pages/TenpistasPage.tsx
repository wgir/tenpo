import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus } from 'lucide-react';
import { TenpistaList } from '../features/tenpistas/components/TenpistaList';
import { TenpistaForm } from '../features/tenpistas/components/TenpistaForm';
import { useTenpistas } from '../features/tenpistas/hooks/useTenpistas';

export const TenpistasPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [displayError, setDisplayError] = useState<Error | null>(null);

    const { tenpistas, isLoading, error: queryError, createTenpista, updateTenpista, deleteTenpista } = useTenpistas();

    // Combine query error and mutation error into single display error
    React.useEffect(() => {
        if (queryError) {
            setDisplayError(queryError);
        }
    }, [queryError]);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setDisplayError(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            setDisplayError(null);
            await deleteTenpista(id);
        } catch (error) {
            setDisplayError(error as Error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Tenpistas</h2>
                    <p className="text-slate-500">Gestiona los tenpistas de Tenpo.</p>
                </div>
                <Button onClick={handleOpenCreate} className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>Nuevo Tenpista</span>
                </Button>
            </div>

            <TenpistaList
                tenpistas={tenpistas}
                isLoading={isLoading}
                error={displayError}
                onEdit={(tenpista) => { setEditingItem(tenpista); setDisplayError(null); setIsModalOpen(true); }}
                onDelete={handleDelete}
                onDismissError={() => setDisplayError(null)}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${editingItem ? 'Editar' : 'Nuevo'} Tenpista`}
                size="md"
            >
                <TenpistaForm
                    initialValues={editingItem}
                    onSubmit={async (values) => {
                        if (editingItem) {
                            await updateTenpista({ id: editingItem.id, data: values });
                        } else {
                            await createTenpista(values);
                        }
                        setIsModalOpen(false);
                    }}
                />
            </Modal>
        </div>
    );
};
