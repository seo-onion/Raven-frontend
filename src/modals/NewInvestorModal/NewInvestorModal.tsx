import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useModalStore from '@/stores/ModalStore';
import { useAddInvestorToRound } from '@/hooks/useStartupData';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/common/Button/Button';
import './NewInvestorModal.css';

interface NewInvestorModalProps {
    roundId: number;
}

const NewInvestorModal: React.FC<NewInvestorModalProps> = ({ roundId }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { mutate: addInvestor, isPending } = useAddInvestorToRound();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState(0);
    const [status, setStatus] = useState('CONTACTED');

    const statusOptions = [
        { value: 'CONTACTED', label: t('stage_contacted') },
        { value: 'PITCH_SENT', label: t('stage_pitch_sent') },
        { value: 'MEETING_SCHEDULED', label: t('stage_meeting_scheduled') },
        { value: 'DUE_DILIGENCE', label: t('stage_due_diligence') },
        { value: 'TERM_SHEET', label: t('stage_term_sheet') },
        { value: 'COMMITTED', label: t('stage_committed') },
    ];

    const handleSubmit = () => {
        if (!name || !email || amount <= 0) {
            toast.error(t('fill_all_fields'));
            return;
        }

        addInvestor({ roundId, investor: { name, email, amount, status } }, {
            onSuccess: () => {
                toast.success(t('investor_added_successfully'));
                closeModal();
            },
            onError: () => {
                toast.error(t('error_adding_investor'));
            }
        });
    };

    return (
        <div className="new-investor-modal">
            <h2 className="text-black">{t('add_new_investor')}</h2>
            <div className="wizard-form-group">
                <Input
                    name="name"
                    label={t('investor_name')}
                    value={name}
                    setValue={setName}
                    placeholder="Angel Investor"
                    required
                />
            </div>
            <div className="wizard-form-group">
                <Input
                    name="email"
                    label={t('email')}
                    type="email"
                    value={email}
                    setValue={setEmail}
                    placeholder="investor@example.com"
                    required
                />
            </div>
            <div className="wizard-form-group">
                <Input
                    name="amount"
                    label={t('amount')}
                    type="number"
                    value={String(amount)}
                    setValue={(value) => setAmount(Number(value))}
                    placeholder="50000"
                    required
                />
            </div>
            <div className="wizard-form-group">
                <Select
                    label={t('status')}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={statusOptions}
                    required
                />
            </div>
            <div className="new-investor-modal-actions">
                <Button variant="secondary" onClick={closeModal} disabled={isPending}>
                    {t('cancel')}
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
                    {isPending ? t('adding') : t('add')}
                </Button>
            </div>
        </div>
    );
};

export default NewInvestorModal;
