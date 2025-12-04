import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useModalStore from '@/stores/ModalStore';
import { useCreateInvestmentRound, useStartupData } from '@/hooks/useStartupData';
import { updateRound } from '@/api/rounds';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/common/Button/Button';
import type { InvestorCommitment } from '@/types/rounds';
import type { RoundNestedUpdateDTO, InvestmentRoundDTO, RoundCreateDTO } from '@/types/campaigns';
import type { Incubator } from '@/types/startup';
import './NewRoundModal.css';

interface NewRoundModalProps {
    roundId?: number;
    initialData?: InvestmentRoundDTO;
}

const NewRoundModal: React.FC<NewRoundModalProps> = ({ roundId, initialData }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const { data: startupData } = useStartupData();
    const incubators = startupData?.incubators;
    const { mutate: createRoundMutate, isPending: isCreating } = useCreateInvestmentRound();
    const [isUpdating, setIsUpdating] = useState(false);

    // Round Data
    const [name, setName] = useState(initialData?.name || 'Seed');
    const [targetAmount, setTargetAmount] = useState<string>(initialData?.target_amount?.toString() || '');
    const [preMoneyValuation, setPreMoneyValuation] = useState<string>(initialData?.pre_money_valuation?.toString() || '');
    const [status, setStatus] = useState<'PLANNED' | 'OPEN' | 'CLOSED'>(initialData?.status || 'PLANNED');

    // New Fields
    const [launchDate, setLaunchDate] = useState<string>(initialData?.launch_date || '');
    const [targetCloseDate, setTargetCloseDate] = useState<string>(initialData?.target_close_date || '');
    const [actualCloseDate, setActualCloseDate] = useState<string>(initialData?.actual_close_date || '');
    const [isCurrent, setIsCurrent] = useState<boolean>(initialData?.is_current || false);

    // Investors Data
    const [investors, setInvestors] = useState<InvestorCommitment[]>(
        initialData?.investors?.map((inv) => ({
            incubator_id: inv.incubator_id || inv.incubator_details?.id || 0, // Fallback to 0 if missing, should be handled
            investor_name: inv.incubator_details?.name || 'Unknown Incubator',
            amount: Number(inv.amount), // Convert string to number for internal state/create payload
            status: inv.status as 'COMMITTED', // Type assertion if status matches
            id: inv.id
        })) || []
    );

    const [newInvestor, setNewInvestor] = useState<Partial<InvestorCommitment>>({
        incubator_id: undefined,
        investor_name: '',
        amount: 0,
        status: 'COMMITTED'
    });

    const roundOptions = [
        { value: 'Pre-Seed', label: 'Pre-Seed' },
        { value: 'Seed', label: 'Seed' },
        { value: 'Series A', label: 'Series A' },
        { value: 'Series B', label: 'Series B' },
        { value: 'Series C', label: 'Series C' },
        { value: 'Other', label: 'Other' },
    ];

    const statusOptions = [
        { value: 'PLANNED', label: t('planned') },
        { value: 'OPEN', label: t('open') },
        { value: 'CLOSED', label: t('closed') },
    ];

    // Generate investor options from associated incubators
    const investorOptions = React.useMemo(() => {
        if (!incubators) return [];
        const options: { value: number; label: string; name: string }[] = [];

        incubators.forEach((inc: Incubator) => {
            options.push({
                value: inc.id,
                label: inc.name,
                name: inc.name
            });
        });
        return options;
    }, [incubators]);

    const handleInvestorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Number(e.target.value);
        const selectedOption = investorOptions.find(opt => opt.value === selectedValue);

        if (selectedOption) {
            setNewInvestor({
                ...newInvestor,
                incubator_id: selectedOption.value,
                investor_name: selectedOption.name,
            });
        } else {
            setNewInvestor({
                ...newInvestor,
                incubator_id: undefined,
                investor_name: '',
            });
        }
    };

    const handleAddInvestor = () => {
        if (!newInvestor.incubator_id || !newInvestor.amount) {
            toast.error(t('fill_all_investor_fields'));
            return;
        }

        const target = Number(targetAmount);
        if (!target || target <= 0) {
            toast.error(t('set_target_amount_first'));
            return;
        }

        if (newInvestor.amount > target) {
            toast.error(t('ticket_cannot_exceed_target'));
            return;
        }

        const currentTotal = investors.reduce((acc, inv) => acc + inv.amount, 0);
        if (currentTotal + newInvestor.amount > target) {
            toast.error(t('total_tickets_cannot_exceed_target'));
            return;
        }

        setInvestors([...investors, { ...newInvestor, status: newInvestor.status || 'CONTACTED' } as InvestorCommitment]);
        setNewInvestor({
            incubator_id: undefined,
            investor_name: '',
            amount: 0,
            status: 'CONTACTED'
        });
    };

    const handleRemoveInvestor = (index: number) => {
        const updatedInvestors = [...investors];
        updatedInvestors.splice(index, 1);
        setInvestors(updatedInvestors);
    };

    const handleSubmit = async () => {
        if (!name || !targetAmount) {
            toast.error(t('fill_all_round_fields'));
            return;
        }

        if (roundId) {
            // Update logic
            setIsUpdating(true);
            const payload: RoundNestedUpdateDTO = {
                name,
                target_amount: targetAmount, // String
                pre_money_valuation: preMoneyValuation, // String
                status,
                is_current: isCurrent,
                launch_date: launchDate || undefined,
                target_close_date: targetCloseDate || undefined,
                actual_close_date: actualCloseDate || undefined,
                investors: investors.map(inv => ({
                    id: (inv as any).id,
                    incubator_id: inv.incubator_id,
                    amount: inv.amount.toString(), // Convert number to string for DTO
                    status: inv.status as any
                }))
            };

            try {
                await updateRound(roundId, payload);
                toast.success(t('round_updated_successfully'));
                closeModal();
            } catch (error) {
                console.error(error);
                toast.error(t('error_updating_round'));
            } finally {
                setIsUpdating(false);
            }

        } else {
            // Create logic
            const payload: RoundCreateDTO = {
                name,
                target_amount: targetAmount, // String
                pre_money_valuation: preMoneyValuation, // String
                status,
                is_current: isCurrent,
                launch_date: launchDate || undefined,
                target_close_date: targetCloseDate || undefined,
                actual_close_date: actualCloseDate || undefined,
                investors: investors.map(inv => ({
                    incubator_id: inv.incubator_id,
                    amount: inv.amount.toString(), // String
                    status: inv.status
                }))
            };

            createRoundMutate(payload, {
                onSuccess: () => {
                    toast.success(t('round_created_successfully'));
                    closeModal();
                },
                onError: () => {
                    toast.error(t('error_creating_round'));
                }
            });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <div className="new-round-modal">
            <h2 className="text-black modal-title">{roundId ? t('edit_round') : t('create_new_round')}</h2>

            {/* Round Details Form */}
            <div className="modal-section">
                <h3 className="text-black modal-subtitle">{t('round_details')}</h3>
                <div className="wizard-form-group">
                    <Select
                        label={t('round_name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        options={roundOptions}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="wizard-form-group">
                        <Input
                            name="target_amount"
                            label={t('funding_goal')}
                            type="number"
                            value={targetAmount}
                            setValue={setTargetAmount}
                            placeholder="1000000"
                            required
                        />
                    </div>
                    <div className="wizard-form-group">
                        <Input
                            name="pre_money_valuation"
                            label={t('pre_money_valuation')}
                            type="number"
                            value={preMoneyValuation}
                            setValue={setPreMoneyValuation}
                            placeholder="5000000"
                        />
                    </div>
                </div>

                {/* Date Fields */}
                <div className="form-row">
                    <div className="wizard-form-group">
                        <Input
                            name="launch_date"
                            label={t('launch_date')}
                            type="date"
                            value={launchDate}
                            setValue={setLaunchDate}
                        />
                    </div>
                    <div className="wizard-form-group">
                        <Input
                            name="target_close_date"
                            label={t('target_close_date')}
                            type="date"
                            value={targetCloseDate}
                            setValue={setTargetCloseDate}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="wizard-form-group">
                        <Select
                            label={t('status')}
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            options={statusOptions}
                            required
                        />
                    </div>
                    {status === 'CLOSED' && (
                        <div className="wizard-form-group">
                            <Input
                                name="actual_close_date"
                                label={t('actual_close_date')}
                                type="date"
                                value={actualCloseDate}
                                setValue={setActualCloseDate}
                            />
                        </div>
                    )}
                </div>

                <div className="wizard-form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={isCurrent}
                            onChange={(e) => setIsCurrent(e.target.checked)}
                        />
                        <span className="text-black">{t('is_current_round')}</span>
                    </label>
                </div>
            </div>

            {/* Investors Form */}
            <div className="modal-section">
                <h3 className="text-black modal-subtitle">{t('committed_investors')}</h3>

                <div className="investor-input-group">
                    <div className="wizard-form-group" style={{ marginBottom: 0 }}>
                        <Select
                            label={t('investor_name')}
                            value={newInvestor.incubator_id?.toString() || ''}
                            onChange={handleInvestorSelect}
                            options={[
                                { value: '', label: t('select_investor') },
                                ...investorOptions.map(opt => ({ value: opt.value.toString(), label: opt.label }))
                            ]}
                        />
                    </div>
                    <div className="wizard-form-group" style={{ marginBottom: 0 }}>
                        <Input
                            name="amount"
                            label={t('ticket_amount')}
                            type="number"
                            value={String(newInvestor.amount || '')}
                            setValue={(val) => setNewInvestor({ ...newInvestor, amount: Number(val) })}
                            placeholder="50000"
                        />
                    </div>
                    <div className="wizard-form-group" style={{ marginBottom: 0 }}>
                        <Select
                            label={t('status')}
                            value={newInvestor.status || 'CONTACTED'}
                            onChange={(e) => setNewInvestor({ ...newInvestor, status: e.target.value as any })}
                            options={[
                                { value: 'CONTACTED', label: t('stage_contacted') },
                                { value: 'PITCH_SENT', label: t('stage_pitch_sent') },
                                { value: 'MEETING_SCHEDULED', label: t('stage_meeting_scheduled') },
                                { value: 'DUE_DILIGENCE', label: t('stage_due_diligence') },
                                { value: 'TERM_SHEET', label: t('stage_term_sheet') },
                                { value: 'COMMITTED', label: t('stage_committed') },
                            ]}
                        />
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        <Button variant="secondary" onClick={handleAddInvestor} className="add-investor-btn">
                            + {t('add')}
                        </Button>
                    </div>
                </div>

                {/* Investors List */}
                {investors.length > 0 && (
                    <div className="investors-list">
                        {investors.map((inv, index) => (
                            <div key={index} className="investor-item">
                                <div className="investor-info">
                                    <span className="investor-name">{inv.investor_name}</span>
                                    <span className="investor-amount">${inv.amount.toLocaleString()}</span>
                                </div>
                                <button
                                    className="remove-investor-btn"
                                    onClick={() => handleRemoveInvestor(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="new-round-modal-actions">
                <Button variant="secondary" onClick={closeModal} disabled={isPending}>
                    {t('cancel')}
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
                    {isPending ? (roundId ? t('updating') : t('creating')) : (roundId ? t('update_round') : t('create_round'))}
                </Button>
            </div>
        </div>
    );
};

export default NewRoundModal;
