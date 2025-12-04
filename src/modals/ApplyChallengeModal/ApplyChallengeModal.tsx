import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import useModalStore from '@/stores/ModalStore';
import { useApplyToChallenge } from '@/hooks/useStartupData';
import toast from 'react-hot-toast';
import './ApplyChallengeModal.css';

interface ApplyChallengeModalProps {
    challengeId: number;
    challengeTitle: string;
    handleClose?: () => void;
}

const ApplyChallengeModal: React.FC<ApplyChallengeModalProps> = ({ challengeId, challengeTitle, handleClose }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { mutate: apply, isPending } = useApplyToChallenge();

    const [textSolution, setTextSolution] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!textSolution.trim()) {
            toast.error(t('required'));
            return;
        }

        apply({
            challenge: challengeId,
            text_solution: textSolution
        }, {
            onSuccess: () => {
                toast.success(t('application_submitted_success'));
                if (handleClose) handleClose();
                closeModal();
            },
            onError: () => {
                toast.error(t('error_submitting_application'));
            }
        });
    };

    return (
        <div className="apply-challenge-modal">
            <div>
                <h2 className="text-xl font-bold mb-2">{t('apply_to_challenge')}</h2>
                <p className="text-gray-600 mb-4">{t('applying_to')}: <span className="font-semibold">{challengeTitle}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('proposal_solution')}</label>
                    <textarea
                        value={textSolution}
                        onChange={(e) => setTextSolution(e.target.value)}
                        required
                        placeholder={t('describe_your_solution')}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end gap-4 mt-2">
                    <Button variant="secondary" onClick={closeModal} type="button">
                        {t('cancel')}
                    </Button>
                    <Button variant="primary" type="submit" disabled={isPending}>
                        {isPending ? t('submitting') : t('submit_application')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ApplyChallengeModal;
