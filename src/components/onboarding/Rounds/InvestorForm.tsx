import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Investor } from '@/types/campaigns';
import useOnboardingStore from '@/stores/OnboardingStore';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import './InvestorForm.css';

interface InvestorFormProps {
    roundIndex: number;
    investorIndex: number;
    investor: Investor;
}

const InvestorForm: React.FC<InvestorFormProps> = ({ roundIndex, investorIndex, investor }) => {
    const { t } = useTranslation('common');
    const { updateInvestorInRound, removeInvestorFromRound } = useOnboardingStore();

    const statusOptions = [
        { value: 'CONTACTED', label: t('stage_contacted') },
        { value: 'PITCH_SENT', label: t('stage_pitch_sent') },
        { value: 'MEETING_SCHEDULED', label: t('stage_meeting_scheduled') },
        { value: 'DUE_DILIGENCE', label: t('stage_due_diligence') },
        { value: 'TERM_SHEET', label: t('stage_term_sheet') },
        { value: 'COMMITTED', label: t('stage_committed') },
    ];

    return (
        <div className="investor-form">
            <div className="investor-form-header">
                <h6 className="text-black">{t('investor')} {investorIndex + 1}</h6>
                <button
                    type="button"
                    className="wizard-btn-remove"
                    onClick={() => removeInvestorFromRound(roundIndex, investorIndex)}
                >
                    {t('delete')}
                </button>
            </div>
            <div className="wizard-investor-fields">
                <div className="wizard-form-group">
                    <Input
                        name={`investor_name_${roundIndex}_${investorIndex}`}
                        label={t('investor_name')}
                        value={investor.name}
                        setValue={(value) => updateInvestorInRound(roundIndex, investorIndex, { name: value })}
                        placeholder="Angel Investor"
                        required
                    />
                </div>
                <div className="wizard-form-group">
                    <Input
                        name={`investor_email_${roundIndex}_${investorIndex}`}
                        label={t('email')}
                        type="email"
                        value={investor.email}
                        setValue={(value) => updateInvestorInRound(roundIndex, investorIndex, { email: value })}
                        placeholder="investor@example.com"
                        required
                    />
                </div>
                <div className="wizard-form-group">
                    <Select
                        label={t('status')}
                        value={investor.status}
                        onChange={(e) => updateInvestorInRound(roundIndex, investorIndex, { status: e.target.value })}
                        options={statusOptions}
                        required
                    />
                </div>
                <div className="wizard-form-group">
                    <Input
                        name={`investor_amount_${roundIndex}_${investorIndex}`}
                        label={t('amount')}
                        type="number"
                        value={String(investor.amount)}
                        setValue={(value) => updateInvestorInRound(roundIndex, investorIndex, { amount: Number(value) })}
                        placeholder="50000"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default InvestorForm;
