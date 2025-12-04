import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useModalStore from '@/stores/ModalStore';
import { useAvailableIncubators, useAssociateIncubator, useAssociatedIncubators } from '@/hooks/useStartupData';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import toast from 'react-hot-toast';
import type { Incubator } from '@/types/startup';
import './AssociateIncubatorModal.css';

interface AssociateIncubatorModalProps {
    onSuccess?: () => void;
}

const AssociateIncubatorModal: React.FC<AssociateIncubatorModalProps> = ({ onSuccess }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { data: availableIncubators, isLoading: isLoadingIncubators } = useAvailableIncubators();
    const { data: associatedIncubators } = useAssociatedIncubators();
    const associateMutation = useAssociateIncubator();

    const [selectedIncubators, setSelectedIncubators] = useState<number[]>([]);

    const handleToggleIncubator = (incubatorId: number) => {
        setSelectedIncubators((prev) =>
            prev.includes(incubatorId)
                ? prev.filter((id) => id !== incubatorId)
                : [...prev, incubatorId]
        );
    };

    const handleAssociate = async () => {
        if (selectedIncubators.length === 0) {
            toast.error(t('please_select_at_least_one_incubator'));
            return;
        }

        // Combine existing associated incubators with newly selected ones
        const existingIds = associatedIncubators?.map(inc => inc.id) || [];
        const allIdsToAssociate = [...new Set([...existingIds, ...selectedIncubators])];

        try {
            await associateMutation.mutateAsync(allIdsToAssociate);
            toast.success(t('incubators_associated_successfully'));
            onSuccess?.();
            closeModal();
        } catch (error) {
            toast.error(t('error_associating_incubators'));
            console.error('Error associating incubators:', error);
        }
    };

    return (
        <div className="associate-incubator-modal-content">
            <h3 className="text-black">{t('associate_incubators')}</h3>
            <p className="text-black associate-incubator-description">
                {t('select_incubators_to_associate')}
            </p>

            {isLoadingIncubators ? (
                <div className="associate-incubator-loading">
                    <Spinner variant="primary" size="lg" />
                    <p className="text-black">{t('loading_incubators')}</p>
                </div>
            ) : (
                <div className="associate-incubator-list">
                    {availableIncubators && availableIncubators.length > 0 ? (
                        availableIncubators.map((incubator: Incubator) => (
                            <label key={incubator.id} className="associate-incubator-item">
                                <input
                                    type="checkbox"
                                    checked={selectedIncubators.includes(incubator.id)}
                                    onChange={() => handleToggleIncubator(incubator.id)}
                                    className="associate-incubator-checkbox"
                                />
                                <span className="text-black associate-incubator-label">
                                    {incubator.name}
                                </span>
                            </label>
                        ))
                    ) : (
                        <p className="text-black">{t('no_incubators_available')}</p>
                    )}
                </div>
            )}

            <div className="associate-incubator-actions">
                <Button
                    variant="secondary"
                    onClick={closeModal}
                    disabled={associateMutation.isPending}
                >
                    {t('cancel')}
                </Button>
                <Button
                    variant="primary"
                    onClick={handleAssociate}
                    disabled={associateMutation.isPending || selectedIncubators.length === 0}
                >
                    {associateMutation.isPending ? <Spinner variant="secondary" /> : t('associate')}
                </Button>
            </div>
        </div>
    );
};

export default AssociateIncubatorModal;
