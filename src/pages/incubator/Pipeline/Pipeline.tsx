import React from 'react';
import { useTranslation } from 'react-i18next';
import { useIncubatorData } from '@/hooks/useIncubatorData';
import PortfolioList from '@/components/incubator/PortfolioList/PortfolioList';
import Spinner from '@/components/common/Spinner/Spinner';

const Pipeline: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: incubatorData, isLoading } = useIncubatorData();

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner variant="primary" size="lg" /></div>;
    }

    const portfolioStartups = incubatorData?.portfolio_startups || [];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-black">{t('pipeline')}</h1>

            {portfolioStartups.length > 0 ? (
                <PortfolioList startups={portfolioStartups} />
            ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                    {t('no_startups_in_pipeline')}
                </div>
            )}
        </div>
    );
};

export default Pipeline;
