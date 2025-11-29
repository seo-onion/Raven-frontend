import React from 'react';
import { useTranslation } from 'react-i18next';
import './ChallengeCard.css';

export type ChallengeStatus = 'new' | 'applied' | 'none';

interface ChallengeCardProps {
    avatar: string;
    avatarColor: string;
    title: string;
    source: string;
    description: string;
    technologies: string[];
    offerAmount: string;
    coordinator: string;
    deadline: string;
    applicationsCount: number;
    status: ChallengeStatus;
    primaryButtonText: string;
    secondaryButtonText: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
    avatar,
    avatarColor,
    title,
    source,
    description,
    technologies,
    offerAmount,
    coordinator,
    deadline,
    applicationsCount,
    status,
}) => {
    const { t } = useTranslation('common');

    const getStatusBadge = () => {
        if (status === 'new') {
            return <span className="challengecard-status challengecard-status-new">{t('new')}</span>;
        }
        if (status === 'applied') {
            return <span className="challengecard-status challengecard-status-applied">{t('you_applied')}</span>;
        }
        return null;
    };

    return (
        <div className="challengecard-container">
            <div
                className="challengecard-avatar"
                style={{ backgroundColor: avatarColor }}
            >
                {avatar}
            </div>
            <div className="challengecard-content">
                <div className="challengecard-title-group">
                    <h3 className="challengecard-title">
                        {title}
                        {getStatusBadge()}
                    </h3>
                    <p className="challengecard-source">@{source}</p>
                </div>
                <p className="challengecard-description">{description}</p>

                <div className="challengecard-tech-section">
                    <span className="challengecard-tech-label">
                        {t('required_technologies')}
                    </span>
                    <div className="challengecard-tech-tags">
                        {technologies.map((tech, index) => (
                            <span key={index} className="challengecard-tech-tag">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="challengecard-details">
                    <div className="challengecard-details-group">
                        <div className="challengecard-detail-item">
                            <span className="challengecard-detail-label">
                                {t('offer_amount')}
                            </span>
                            <span className="challengecard-detail-value">
                                {offerAmount}
                            </span>
                        </div>
                        <div className="challengecard-detail-item">
                            <span className="challengecard-detail-label">
                                {t('coordinator')}
                            </span>
                            <span className="challengecard-detail-value">
                                {coordinator}
                            </span>
                        </div>
                        <div className="challengecard-detail-item">
                            <span className="challengecard-detail-label">
                                {t('deadline')}
                            </span>
                            <span className="challengecard-detail-value">
                                {deadline}
                            </span>
                        </div>
                    </div>
                    {/* <div className="challengecard-actions">
                        <button
                            className="challengecard-button challengecard-button-secondary"
                            onClick={onSecondaryClick}
                        >
                            {secondaryButtonText}
                        </button>
                        <button
                            className="challengecard-button challengecard-button-primary"
                            onClick={onPrimaryClick}
                        >
                            {primaryButtonText}
                        </button>
                    </div> */}
                </div>
                <p className="challengecard-applications">
                    {applicationsCount} {t('startups_applied')}
                </p>
            </div>
        </div>
    );
};

export default ChallengeCard;
