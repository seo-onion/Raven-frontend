import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import Input from '@/components/forms/Input/Input';
import useModalStore from '@/stores/ModalStore';
import { useCreateChallenge } from '@/hooks/useIncubatorData';
import toast from 'react-hot-toast';
import './CreateChallengeModal.css';

interface CreateChallengeModalProps {
    handleClose?: () => void;
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ handleClose: _handleClose }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { mutate: createChallenge, isPending } = useCreateChallenge();

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        budget: '',
        deadline: '',
        required_technologies: '',
        status: 'OPEN' as const
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createChallenge(formData, {
            onSuccess: () => {
                toast.success(t('challenge_created_success'));
                closeModal();
            },
            onError: () => {
                toast.error(t('error_creating_challenge'));
            }
        });
    };

    return (
        <div className="create-challenge-modal">
            <h2 className="modal-title">{t('create_new_challenge')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="wizard-form-group">
                    <Input
                        name="title"
                        label={t('title')}
                        value={formData.title}
                        setValue={(val) => setFormData(prev => ({ ...prev, title: val }))}
                        required
                    />
                </div>
                <div className="wizard-form-group">
                    <Input
                        name="subtitle"
                        label={t('subtitle')}
                        value={formData.subtitle}
                        setValue={(val) => setFormData(prev => ({ ...prev, subtitle: val }))}
                    />
                </div>
                <div className="wizard-form-group">
                    <Input
                        name="description"
                        label={t('description')}
                        value={formData.description}
                        setValue={(val) => setFormData(prev => ({ ...prev, description: val }))}
                        required
                        multiline
                        rows={3}
                    />
                </div>
                <div className="form-row">
                    <div className="wizard-form-group">
                        <Input
                            name="budget"
                            label={t('budget')}
                            type="number"
                            value={formData.budget}
                            setValue={(val) => setFormData(prev => ({ ...prev, budget: val }))}
                        />
                    </div>
                    <div className="wizard-form-group">
                        <Input
                            name="deadline"
                            label={t('deadline')}
                            type="date"
                            value={formData.deadline}
                            setValue={(val) => setFormData(prev => ({ ...prev, deadline: val }))}
                        />
                    </div>
                </div>
                <div className="wizard-form-group">
                    <Input
                        name="required_technologies"
                        label={t('required_technologies')}
                        value={formData.required_technologies}
                        setValue={(val) => setFormData(prev => ({ ...prev, required_technologies: val }))}
                        required
                        placeholder="Python, AI, Blockchain..."
                    />
                </div>

                <div className="create-challenge-modal-actions">
                    <Button variant="secondary" onClick={closeModal} type="button">
                        {t('cancel')}
                    </Button>
                    <Button variant="primary" type="submit" disabled={isPending}>
                        {isPending ? t('saving') : t('save')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateChallengeModal;
