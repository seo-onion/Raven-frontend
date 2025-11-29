import React from 'react';
import { useTranslation } from 'react-i18next';
import CrowdfundingBar from '../../../components/dashboard/CrowdfundingBar/CrowdfundingBar';
import FundingRoundCard from '../../../components/dashboard/FundingRoundCard/FundingRoundCard';
import InvestorPipelineCard from '../../../components/dashboard/InvestorPipelineCard/InvestorPipelineCard';
import { useInvestors } from '../../../hooks/useStartupData';
import './Inversores.css';

const Inversores: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: investors, isLoading, error } = useInvestors();

    return (
        <div className="inversores-container">
            {/* Header */}
            <div className="inversores-header">
                <div className="inversores-title-group">
                    <h1 className="inversores-main-title">
                        {t('investments')}
                    </h1>
                    <p className="inversores-subtitle">
                        {t('funding_rounds_classification')}
                    </p>
                </div>
                {/* <button className="inversores-btn-primary">
                    <FaPlus className="inversores-btn-icon" />
                    {t('add_contribution')}
                </button> */}
            </div>

            {/* Crowdfunding Bar */}
            <CrowdfundingBar
                goal="$100K"
                current="$80K"
                percentage={80}
            />

            {/* Funding Rounds */}
            <div className="inversores-section">
                <h2 className="inversores-section-title">
                    {t('funding_rounds')}
                </h2>

                <FundingRoundCard
                    name="Pre Seed"
                    value="$150K"
                    closeDate="09/01/2024"
                    status="completed"
                    percentage={100}
                    investors={['Angel Investment', '4 contactos', 'Otros']}
                />

                <FundingRoundCard
                    name="Seed"
                    value="$600K"
                    closeDate="09/07/2024"
                    status="in-progress"
                    percentage={57}
                    investors={['Socios', 'Venture Capital', '2 contactos']}
                />

                <FundingRoundCard
                    name="Serie A"
                    value="$500K"
                    closeDate="09/01/2025"
                    status="pending"
                    percentage={5}
                    investors={['Pendiente']}
                />
            </div>

            {/* Investor Pipeline */}
            <div className="inversores-section">
                <h2 className="inversores-section-title">
                    {t('investor_pipeline')}
                </h2>

                {isLoading && <p className="text-black">{t('loading')}</p>}
                {error && <p className="text-black">{t('error')}: {error.message}</p>}

                {investors && investors.length === 0 && (
                    <p className="text-black">{t('no_investors_yet')}</p>
                )}

                {investors && investors.map((investor) => {
                    const initials = investor.investor_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                    const stageMap = {
                        'CONTACTED': 'in-progress',
                        'PITCH_SENT': 'in-progress',
                        'MEETING_SCHEDULED': 'in-progress',
                        'DUE_DILIGENCE': 'in-progress',
                        'TERM_SHEET': 'active',
                        'COMMITTED': 'active',
                        'DECLINED': 'discarded'
                    };

                    return (
                        <InvestorPipelineCard
                            key={investor.id}
                            name={investor.investor_name}
                            initials={initials}
                            description={investor.notes || t('no_description')}
                            avatarColor="var(--main-secondary)"
                            stage={stageMap[investor.stage] || 'in-progress'}
                            valuation="N/A"
                            softInvestment={investor.ticket_size ? `$${investor.ticket_size.toLocaleString()}` : 'N/A'}
                            expectedClose={investor.next_action_date || t('pending')}
                            email={investor.investor_email || ''}
                            phone=""
                            isComplete={investor.stage === 'COMMITTED'}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Inversores;
