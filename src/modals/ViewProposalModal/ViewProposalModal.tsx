import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import useModalStore from '@/stores/ModalStore';
import { type ChallengeApplicationDTO, type ChallengeDTO } from '@/api/incubator';
import './ViewProposalModal.css';

interface ViewProposalModalProps {
    application: ChallengeApplicationDTO;
    challenge?: ChallengeDTO;
}

const ViewProposalModal: React.FC<ViewProposalModalProps> = ({ application, challenge }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();

    return (
        <div className="view-proposal-modal">
            <div>
                <h2 className="text-xl font-bold mb-1">{t('my_proposal')}</h2>
                <p className="text-gray-600 mb-4">{t('for_challenge')}: <span className="font-semibold">{challenge?.title || application.challenge}</span></p>
            </div>

            <div className="view-proposal-meta">
                <span>{t('submitted_on')}: {new Date(application.created).toLocaleDateString()}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">{t('applied')}</span>
            </div>

            <div className="view-proposal-section">
                <span className="view-proposal-label">{t('proposal_solution')}</span>
                <div className="view-proposal-value">
                    {application.text_solution}
                </div>
            </div>

            {challenge && (
                <div className="view-proposal-section">
                    <span className="view-proposal-label">{t('challenge_details')}</span>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div>
                            <span className="text-gray-500 block">{t('budget')}</span>
                            <span className="font-medium">${challenge.budget ? parseFloat(challenge.budget.toString()).toLocaleString() : 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">{t('deadline')}</span>
                            <span className="font-medium">{challenge.deadline || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-4">
                <Button variant="primary" onClick={closeModal}>
                    {t('close')}
                </Button>
            </div>
        </div>
    );
};

export default ViewProposalModal;
