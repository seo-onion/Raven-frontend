import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useModalStore from '@/stores/ModalStore';
import { useCreateInvestmentRound } from '@/hooks/useStartupData';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/common/Button/Button';
import './NewRoundModal.css';

const NewRoundModal: React.FC = () => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { mutate: createRound, isPending } = useCreateInvestmentRound();

    const [name, setName] = useState('Seed');
    const [target, setTarget] = useState(0);
    const [valuation, setValuation] = useState(0);

    const roundOptions = [
        { value: 'Pre-Seed', label: 'Pre-Seed' },
        { value: 'Seed', label: 'Seed' },
        { value: 'Series A', label: 'Series A' },
        { value: 'Series B', label: 'Series B' },
        { value: 'Series C', label: 'Series C' },
        { value: 'Other', label: 'Other' },
    ];

    const handleSubmit = () => {
        if (!name || target <= 0 || valuation <= 0) {
            toast.error(t('fill_all_fields'));
            return;
        }

        createRound({ name, target, valuation }, {
            onSuccess: () => {
                toast.success(t('round_created_successfully'));
                closeModal();
            },
            onError: () => {
                toast.error(t('error_creating_round'));
            }
        });
    };

    return (
        <div className="new-round-modal">
            <h2 className="text-black">{t('create_new_round')}</h2>
            <div className="wizard-form-group">
                <Select
                    label={t('round_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    options={roundOptions}
                    required
                />
            </div>
            <div className="wizard-form-group">
                <Input
                    name="target"
                    label={t('goal')}
                    type="number"
                    value={String(target)}
                    setValue={(value) => setTarget(Number(value))}
                    placeholder="500000"
                    required
                />
            </div>
            <div className="wizard-form-group">
                <Input
                    name="valuation"
                    label={t('valuation')}
                    type="number"
                    value={String(valuation)}
                    setValue={(value) => setValuation(Number(value))}
                    placeholder="5000000"
                    required
                />
            </div>
            <div className="new-round-modal-actions">
                <Button variant="secondary" onClick={closeModal} disabled={isPending}>
                    {t('cancel')}
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
                    {isPending ? t('creating') : t('create')}
                </Button>
            </div>
        </div>
    );
};

export default NewRoundModal;
