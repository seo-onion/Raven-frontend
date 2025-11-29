import React from 'react';
import { useTranslation } from 'react-i18next';
import CrowdfundingBar from '../../../components/dashboard/CrowdfundingBar/CrowdfundingBar';
import FundingRoundCard from '../../../components/dashboard/FundingRoundCard/FundingRoundCard';
import InvestorPipelineCard from '../../../components/dashboard/InvestorPipelineCard/InvestorPipelineCard';
import './Inversores.css';

const Inversores: React.FC = () => {
    const { t } = useTranslation('common');

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

                <InvestorPipelineCard
                    name="Desprosa Capital"
                    initials="DC"
                    description="Inversionistas especializados en startups tecnológicas y energías renovables."
                    avatarColor="var(--main-secondary)"
                    stage="active"
                    valuation="$50M"
                    softInvestment="$100K - $150K"
                    expectedClose="Junio 2025"
                    email="contacto@desprosacapital.com"
                    phone="+1 408 555 0123"
                    isComplete={true}
                />

                <InvestorPipelineCard
                    name="Andressen Horowitz"
                    initials="AH"
                    description="Inversionistas enfocados en software, Web3 y deep technology."
                    avatarColor="#2563eb"
                    stage="in-progress"
                    valuation="$1.5B"
                    softInvestment="$2M - $5M"
                    expectedClose="Octubre 2025"
                    email="michael@ahorowitz.com"
                    phone="+1 408 555 1460"
                     
                />

                <InvestorPipelineCard
                    name="Rocio Venturini"
                    initials="RV"
                    description="Inversionista Angel. Enfocada en B2B y SaaS."
                    avatarColor="#dc2626"
                    stage="discarded"
                    valuation="N/A"
                    softInvestment="$50K"
                    expectedClose="Pendiente"
                    email="ana.rodriguez@email.com"
                    phone="+56 9 8765 4321"
                     
                />
            </div>
        </div>
    );
};

export default Inversores;
