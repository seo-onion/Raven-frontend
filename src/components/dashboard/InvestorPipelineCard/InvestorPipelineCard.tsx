import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import './InvestorPipelineCard.css';

export type InvestorStage = 'active' | 'in-progress' | 'discarded';

interface InvestorPipelineCardProps {
    name: string;
    initials: string;
    description: string;
    avatarColor: string;
    stage: InvestorStage;
    valuation: string;
    softInvestment: string;
    expectedClose: string;
    email: string;
    phone: string;
    isComplete?: boolean;
}

const InvestorPipelineCard: React.FC<InvestorPipelineCardProps> = ({
    name,
    initials,
    description,
    avatarColor,
    stage,
    valuation,
    softInvestment,
    expectedClose,
    email,
    phone,
    isComplete = false,
}) => {
    const { t } = useTranslation('common');

    const getStageLabel = () => {
        switch (stage) {
            case 'active':
                return t('in_stage');
            case 'in-progress':
                return t('in_stage');
            case 'discarded':
                return t('discarded');
        }
    };

    const getStageClass = () => {
        switch (stage) {
            case 'active':
                return 'investorpipeline-stage-active';
            case 'in-progress':
                return 'investorpipeline-stage-progress';
            case 'discarded':
                return 'investorpipeline-stage-discarded';
        }
    };

    return (
        <div className="investorpipeline-container">
            <div className="investorpipeline-header">
                <div className="investorpipeline-info">
                    <div
                        className="investorpipeline-avatar"
                        style={{ backgroundColor: avatarColor }}
                    >
                        {initials}
                    </div>
                    <div className="investorpipeline-details">
                        <h3>{name}</h3>
                        <p>{description}</p>
                    </div>
                </div>
                <span className={`investorpipeline-stage ${getStageClass()}`}>
                    {getStageLabel()}
                </span>
            </div>

            <div className="investorpipeline-metrics">
                <div className="investorpipeline-metric-item">
                    <span className="investorpipeline-metric-label">
                        {t('valuation')}
                    </span>
                    <span className="investorpipeline-metric-value">
                        {valuation}
                    </span>
                </div>
                <div className="investorpipeline-metric-item">
                    <span className="investorpipeline-metric-label">
                        {t('soft_investment')}
                    </span>
                    <span className="investorpipeline-metric-value">
                        {softInvestment}
                    </span>
                </div>
                <div className="investorpipeline-metric-item">
                    <span className="investorpipeline-metric-label">
                        {t('expected_close')}
                    </span>
                    <span className="investorpipeline-metric-value">
                        {expectedClose}
                    </span>
                </div>
            </div>

            <div className="investorpipeline-actions">
                <div className="investorpipeline-contact">
                    <a href={`mailto:${email}`}>
                        <FaEnvelope className="investorpipeline-contact-icon" />
                        {email}
                    </a>
                    <a href={`tel:${phone}`}>
                        <FaPhone className="investorpipeline-contact-icon" />
                        {phone}
                    </a>
                </div>
                {/* <button
                    className={`investorpipeline-button ${isComplete ? 'investorpipeline-button-complete' : ''}`}
                >
                    {isComplete ? t('mark_complete') : t('view_full_profile')}
                </button> */}
            </div>
        </div>
    );
};

export default InvestorPipelineCard;
