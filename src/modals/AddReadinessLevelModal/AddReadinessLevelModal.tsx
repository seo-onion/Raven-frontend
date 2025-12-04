import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useModalStore from '@/stores/ModalStore';
import { useCreateReadinessLevel, useCreateEvidence } from '@/hooks/useStartupData';
import Input from '@/components/forms/Input/Input';
import Button from '@/components/common/Button/Button';
import './AddReadinessLevelModal.css';

interface AddReadinessLevelModalProps {
    type: 'TRL' | 'CRL';
    defaultLevel?: number;
    onSuccess?: () => void;
}

const AddReadinessLevelModal: React.FC<AddReadinessLevelModalProps> = ({
    type,
    defaultLevel = 1,
    onSuccess,
}) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { mutate: createLevel, isPending: isCreatingLevel } = useCreateReadinessLevel();
    const { mutate: createEvidence, isPending: isCreatingEvidence } = useCreateEvidence();

    const level = defaultLevel;
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [evidenceUrl, setEvidenceUrl] = useState('');
    const [evidenceDescription, setEvidenceDescription] = useState('');

    const isPending = isCreatingLevel || isCreatingEvidence;

    const handleSubmit = () => {
        if (!title.trim() || !evidenceUrl.trim()) {
            toast.error(t('fill_all_fields'));
            return;
        }

        createLevel(
            {
                type,
                level,
                title: title.trim(),
                subtitle: subtitle.trim() || undefined
            },
            {
                onSuccess: () => {
                    // Create evidence (now mandatory)
                    createEvidence(
                        {
                            evidenceData: {
                                file_url: evidenceUrl.trim(),
                                type,
                                level,
                                description: evidenceDescription.trim(),
                                status: 'PENDING',
                            } as any,
                        },
                        {
                            onSuccess: () => {
                                toast.success(t('level_and_evidence_created_successfully'));
                                onSuccess?.();
                                closeModal();
                            },
                            onError: () => {
                                toast.error(t('readiness_level_created_but_evidence_failed'));
                                onSuccess?.();
                                closeModal();
                            },
                        }
                    );
                },
                onError: () => {
                    toast.error(t('error_creating_readiness_level'));
                }
            }
        );
    };

    return (
        <div className="add-readiness-level-modal">
            <h2 className="text-black">{t('add_readiness_level')} {type} - {t('level')} {level}</h2>

            <div className="wizard-form-group">
                <Input
                    name="title"
                    label={t('title')}
                    value={title}
                    setValue={setTitle}
                    placeholder={t('enter_title')}
                    required
                    classNames="basic-input-field"
                />
            </div>

            <div className="wizard-form-group">
                <label className="text-black wizard-label">
                    {t('subtitle')} {t('optional')}
                </label>
                <textarea
                    className="basic-input-field multiline-textarea"
                    rows={3}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder={t('enter_subtitle')}
                />
            </div>

            <div className="wizard-form-group">
                <Input
                    name="evidence-link"
                    label={t('upload_evidence_link')}
                    value={evidenceUrl}
                    setValue={setEvidenceUrl}
                    placeholder={t('enter_evidence_link')}
                    required
                    classNames="basic-input-field"
                />
            </div>

            <div className="wizard-form-group">
                <label className="text-black wizard-label">
                    {t('readiness_level_evidence_description')} {t('optional')}
                </label>
                <textarea
                    className="basic-input-field multiline-textarea"
                    rows={3}
                    value={evidenceDescription}
                    onChange={(e) => setEvidenceDescription(e.target.value)}
                    placeholder={t('enter_evidence_description')}
                />
            </div>

            <div className="add-readiness-level-modal-actions">
                <Button variant="secondary" onClick={closeModal} disabled={isPending}>
                    {t('cancel')}
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isPending || !title.trim() || !evidenceUrl.trim()}>
                    {isPending ? t('creating') : t('create')}
                </Button>
            </div>
        </div>
    );
};

export default AddReadinessLevelModal;
