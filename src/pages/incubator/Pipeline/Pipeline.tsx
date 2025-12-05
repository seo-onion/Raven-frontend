import React from 'react';
import { useTranslation } from 'react-i18next';
import { useIncubatorData } from '@/hooks/useIncubatorData';
import PortfolioList from '@/components/incubator/PortfolioList/PortfolioList';
import Spinner from '@/components/common/Spinner/Spinner';

import './Pipeline.css';

const Pipeline: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: incubatorData, isLoading } = useIncubatorData();

    if (isLoading) {
        return <div className="pipeline-loading"><Spinner variant="primary" size="lg" /></div>;
    }

    const portfolioStartups = incubatorData?.portfolio_startups || [];

    return (
        <div className="pipeline-container">
            <h1 className="pipeline-title">{t('pipeline')}</h1>

            {portfolioStartups.length > 0 ? (
                <PortfolioList startups={portfolioStartups} />
            ) : (
                <div className="pipeline-empty-state">
                    {t('no_startups_in_pipeline')}
                </div>
            )}
        </div>
    );
};

export default Pipeline;
