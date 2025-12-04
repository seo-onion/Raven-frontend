import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import useModalStore from '@/stores/ModalStore';
import './ConfirmCommitModal.css';

interface ConfirmCommitModalProps {
    investmentId: number;
    startupName: string;
    amount: number;
    onConfirm: (id: number) => void;
    handleClose?: () => void;
}

const ConfirmCommitModal: React.FC<ConfirmCommitModalProps> = ({
    investmentId,
    startupName,
    amount,
    onConfirm,
    handleClose: _handleClose
}) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();

    const handleConfirm = () => {
        onConfirm(investmentId);
        closeModal();
    };

    return (
        <div className="confirm-commit-modal">
            <h2 className="text-xl font-bold mb-4">{t('confirm_commitment')}</h2>
            <p className="mb-6 text-gray-600">
                {t('confirm_commit_message', {
                    amount: amount.toLocaleString(),
                    startup: startupName
                })}
            </p>

            <div className="flex justify-end gap-4">
                <Button variant="secondary" onClick={closeModal}>
                    {t('cancel')}
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    {t('confirm')}
                </Button>
            </div>
        </div>
    );
};

export default ConfirmCommitModal;
