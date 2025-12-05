import React from 'react';
import { useTranslation } from 'react-i18next';
import './CrowdfundingBar.css';

interface CrowdfundingBarProps {
    goal: string;
    current: string;
    percentage: number;
}

const CrowdfundingBar: React.FC<CrowdfundingBarProps> = ({ goal, current, percentage }) => {
    const { t } = useTranslation('common');

    return (
        <div className="crowdfundingbar-container">
            <h2 className="crowdfundingbar-title">Objetivo de la ronda principal</h2>
            <p className="crowdfundingbar-subtitle" style={{ fontWeight: 'bold', margin: '15px 0 25px 0' }}>
                Capital Comprometido vs. Objetivo Total de la Ronda.
            </p>
            <div className="crowdfundingbar-info">
                <span className="crowdfundingbar-status">
                    {t('goal')}: {goal}
                </span>
                <span className="crowdfundingbar-current">
                    {t('current')}: {current}
                </span>
            </div>
            <div className="crowdfundingbar-progress-container">
                <div
                    className="crowdfundingbar-progress-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {/* <button className="crowdfundingbar-button">
                <FaCheckCircle className="crowdfundingbar-button-icon" />
                {t('mark_complete')}
            </button> */}
        </div>
    );
};

export default CrowdfundingBar;
