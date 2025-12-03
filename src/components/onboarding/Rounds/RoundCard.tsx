import React from 'react';
import { useTranslation } from 'react-i18next';
import type { InvestmentRound as InvestmentRoundType } from '@/types/campaigns';
import useOnboardingStore from '@/stores/OnboardingStore';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import InvestorForm from './InvestorForm';
import './RoundCard.css';

interface RoundCardProps {
    round: InvestmentRoundType;
    roundIndex: number;
}

const RoundCard: React.FC<RoundCardProps> = ({ round, roundIndex }) => {
    const { t } = useTranslation('common');
    const { updateRound, removeRound, addInvestorToRound } = useOnboardingStore();

    const roundOptions = [
        { value: 'Pre-Seed', label: 'Pre-Seed' },
        { value: 'Seed', label: 'Seed' },
        { value: 'Series A', label: 'Series A' },
        { value: 'Series B', label: 'Series B' },
        { value: 'Series C', label: 'Series C' },
        { value: 'Other', label: 'Other' },
    ];

    return (
        <div className="round-card">
            <div className="round-card-header">
                <h4 className="text-black">{t('round')} {roundIndex + 1}</h4>
                {roundIndex > 0 && (
                    <button
                        type="button"
                        className="wizard-btn-remove"
                        onClick={() => removeRound(roundIndex)}
                    >
                        {t('delete')}
                    </button>
                )}
            </div>
            <div className="wizard-financial-grid">
                <div className="wizard-form-group">
                    <Select
                        label={t('round_name')}
                        value={round.name}
                        onChange={(e) => updateRound(roundIndex, { name: e.target.value })}
                        options={roundOptions}
                        required
                    />
                </div>
                <div className="wizard-form-group">
                    <Input
                        name={`round_target_${roundIndex}`}
                        label={t('goal')}
                        type="number"
                        value={String(round.target)}
                        setValue={(value) => updateRound(roundIndex, { target: Number(value) })}
                        placeholder="500000"
                        required
                    />
                </div>
                <div className="wizard-form-group">
                    <Input
                        name={`round_valuation_${roundIndex}`}
                        label={t('valuation')}
                        type="number"
                        value={String(round.valuation)}
                        setValue={(value) => updateRound(roundIndex, { valuation: Number(value) })}
                        placeholder="5000000"
                        required
                    />
                </div>
            </div>

            <h5 className="text-black wizard-subsection-title">{t('investors')}</h5>
            {round.investors.map((investor, investorIndex) => (
                <InvestorForm
                    key={investorIndex}
                    roundIndex={roundIndex}
                    investorIndex={investorIndex}
                    investor={investor}
                />
            ))}
            <button
                type="button"
                className="wizard-btn-add"
                onClick={() => addInvestorToRound(roundIndex)}
            >
                + {t('add_investor')}
            </button>
        </div>
    );
};

export default RoundCard;
