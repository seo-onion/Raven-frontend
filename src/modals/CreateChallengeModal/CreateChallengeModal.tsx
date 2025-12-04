import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
            <h2 className="text-xl font-bold mb-4">{t('create_new_challenge')}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('title')}</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('subtitle')}</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('budget')}</label>
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('deadline')}</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('required_technologies')}</label>
                    <input
                        type="text"
                        name="required_technologies"
                        value={formData.required_technologies}
                        onChange={handleChange}
                        required
                        placeholder="Python, AI, Blockchain..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end gap-4 mt-4">
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
