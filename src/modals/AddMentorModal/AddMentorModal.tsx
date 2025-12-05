import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import Input from '@/components/forms/Input/Input';
import useModalStore from '@/stores/ModalStore';
import { useCreateIncubatorMember } from '@/hooks/useIncubatorData';
import toast from 'react-hot-toast';
import './AddMentorModal.css';

interface AddMentorModalProps {
    handleClose?: () => void;
}

const AddMentorModal: React.FC<AddMentorModalProps> = ({ handleClose: _handleClose }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { mutate: createMember, isPending } = useCreateIncubatorMember();

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        role: 'MENTOR' as const
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMember(formData, {
            onSuccess: () => {
                toast.success(t('mentor_added_success'));
                closeModal();
            },
            onError: () => {
                toast.error(t('error_adding_mentor'));
            }
        });
    };

    return (
        <div className="add-mentor-modal">
            <h2 className="modal-title">{t('add_new_mentor')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="wizard-form-group">
                    <Input
                        name="full_name"
                        label={t('full_name')}
                        value={formData.full_name}
                        setValue={(val) => setFormData(prev => ({ ...prev, full_name: val }))}
                        required
                    />
                </div>
                <div className="wizard-form-group">
                    <Input
                        name="email"
                        label={t('email')}
                        type="email"
                        value={formData.email}
                        setValue={(val) => setFormData(prev => ({ ...prev, email: val }))}
                        required
                    />
                </div>
                <div className="wizard-form-group">
                    <Input
                        name="phone"
                        label={t('phone')}
                        type="tel"
                        value={formData.phone}
                        setValue={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                    />
                </div>

                <div className="add-mentor-modal-actions">
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

export default AddMentorModal;
