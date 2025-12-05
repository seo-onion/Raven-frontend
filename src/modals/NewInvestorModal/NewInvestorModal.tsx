import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useModalStore from '@/stores/ModalStore';
import { useStartupData, useInvestmentRounds } from '@/hooks/useStartupData';
import { updateRound } from '@/api/rounds';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/common/Button/Button';
import type { RoundNestedUpdateDTO } from '@/types/campaigns';
import './NewInvestorModal.css';

interface NewInvestorModalProps {
    roundId: number;
}

const NewInvestorModal: React.FC<NewInvestorModalProps> = ({ roundId }) => {
    const { t } = useTranslation('common');
    const queryClient = useQueryClient();
    const { closeModal } = useModalStore();
    const { data: startupData } = useStartupData();
    const { data: rounds } = useInvestmentRounds();

    const incubators = startupData?.incubators || [];
    const currentRound = rounds?.find(r => r.id === roundId);

    const [incubatorId, setIncubatorId] = useState<number | ''>('');
    const [amount, setAmount] = useState<string>('');
    const [status, setStatus] = useState('CONTACTED');
    const [isPending, setIsPending] = useState(false);

    const statusOptions = [
        { value: 'CONTACTED', label: t('stage_contacted') },
        { value: 'PITCH_SENT', label: t('stage_pitch_sent') },
        { value: 'MEETING_SCHEDULED', label: t('stage_meeting_scheduled') },
        { value: 'DUE_DILIGENCE', label: t('stage_due_diligence') },
        { value: 'TERM_SHEET', label: t('stage_term_sheet') },
        { value: 'COMMITTED', label: t('stage_committed') },
    ];

    const incubatorOptions = useMemo(() => {
        return incubators.map(inc => ({
            value: inc.id.toString(),
            label: inc.name
        }));
    }, [incubators]);

    const handleSubmit = async () => {
        if (!incubatorId || !amount || Number(amount) <= 0) {
            toast.error(t('fill_all_fields'));
            return;
        }

        if (!currentRound) {
            toast.error(t('error_round_not_found'));
            return;
        }

        const targetAmount = Number(currentRound.target_amount);
        const newAmount = Number(amount);

        if (newAmount > targetAmount) {
            toast.error(t('ticket_cannot_exceed_target'));
            return;
        }

        // Calculate current total committed amount
        const currentTotal = currentRound.investors?.reduce((acc, inv) => acc + Number(inv.amount), 0) || 0;

        if (currentTotal + newAmount > targetAmount) {
            toast.error(t('total_tickets_cannot_exceed_target'));
            return;
        }

        setIsPending(true);

        // Construct the new investor object
        const newInvestor = {
            incubator_id: Number(incubatorId),
            amount: amount,
            status: status as any
        };

        // Prepare the payload with existing investors + new investor
        // We need to map existing investors to the DTO structure
        const existingInvestors = currentRound.investors?.map(inv => ({
            id: inv.id,
            incubator_id: inv.incubator_id || inv.incubator_details?.id,
            amount: inv.amount, // Already string in DTO
            status: inv.status
        })) || [];

        const payload: RoundNestedUpdateDTO = {
            investors: [...existingInvestors, newInvestor]
        };

        try {
            await updateRound(roundId, payload);
            await queryClient.invalidateQueries({ queryKey: ['investment-rounds'] });
            toast.success(t('investor_added_successfully'));
            closeModal();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(t('error_adding_investor'));
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="new-investor-modal">
            <h2 className="text-black">{t('add_new_investor')}</h2>
            <div className="wizard-form-group">
                <Select
                    label={t('investor_name')} // Using investor_name label for incubator selection
                    value={incubatorId.toString()}
                    onChange={(e) => setIncubatorId(Number(e.target.value))}
                    options={[
                        { value: '', label: t('select_investor') },
                        ...incubatorOptions
                    ]}
                    required
                />
            </div>
            <div className="wizard-form-group">
                <Input
                    name="amount"
                    label={t('amount')}
                    type="number"
                    value={amount}
                    setValue={setAmount}
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
