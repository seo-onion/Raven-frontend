import React from 'react';
import { useTranslation } from 'react-i18next';
import './FundingRoundCard.css';

export type RoundStatus = 'completed' | 'in-progress' | 'pending';

interface FundingRoundCardProps {
    name: string;
    value: string;
    closeDate: string;
    status: RoundStatus;
    percentage: number;
    investors: string[];
}

const FundingRoundCard: React.FC<FundingRoundCardProps> = ({
    name,
    value,
    closeDate,
    status,
    percentage,
    investors,
}) => {
    const { t } = useTranslation('common');

    const getStatusBadge = () => {
        switch (status) {
            case 'completed':
                return (
                    <span className="fundinground-badge fundinground-badge-completed">
                        {t('completed')}
                    </span>
                );
            case 'in-progress':
                return (
                    <span className="fundinground-badge fundinground-badge-progress">
                        {percentage}%
                    </span>
                );
            case 'pending':
                return (
                    <span className="fundinground-badge fundinground-badge-pending">
                        {percentage}%
                    </span>
                );
        }
    };

    const getProgressColor = () => {
        if (status === 'completed') return '#10b981';
        if (status === 'in-progress') return 'var(--main-secondary)';
        return '#9ca3af';
    };

    return (
        <div className="fundinground-container">
            <div className="fundinground-header">
                <span className="fundinground-name">{name}</span>
                <span className="fundinground-value">{value}</span>
            </div>
            <div className="fundinground-info">
                <span>{t('estimated_close')}: {closeDate}</span>
                {getStatusBadge()}
            </div>
            <div className="fundinground-progress-container">
                <div
                    className="fundinground-progress-fill"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: getProgressColor(),
                    }}
                ></div>
            </div>
            <div className="fundinground-investors">
                <span>{t('participating_investors')}:</span>
                {investors.map((investor, index) => (
                    <span key={index} className="fundinground-investor-tag">
                        {investor}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default FundingRoundCard;
