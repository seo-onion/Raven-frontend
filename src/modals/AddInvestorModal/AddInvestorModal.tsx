import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import useModalStore from '@/stores/ModalStore';
import { useCreateIncubatorMember } from '@/hooks/useIncubatorData';
import toast from 'react-hot-toast';
import './AddInvestorModal.css';

interface AddInvestorModalProps {
    handleClose?: () => void;
}

const AddInvestorModal: React.FC<AddInvestorModalProps> = ({ handleClose: _handleClose }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { mutate: createMember, isPending } = useCreateIncubatorMember();

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        role: 'INVESTOR' as const
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMember(formData, {
            onSuccess: () => {
                toast.success(t('investor_added_success'));
                closeModal();
            },
            onError: () => {
                toast.error(t('error_adding_investor'));
            }
        });
    };

    return (
        <div className="add-investor-modal">
            <h2 className="text-xl font-bold mb-4">{t('add_new_investor')}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name')}</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
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

export default AddInvestorModal;
