import React from 'react';
import { useTranslation } from 'react-i18next';
import MetricCard from '../../../components/dashboard/MetricCard/MetricCard';
import CashFlowChart from '../../../components/dashboard/CashFlowChart/CashFlowChart';
import RevenueVsCostsChart from '../../../components/dashboard/RevenueVsCostsChart/RevenueVsCostsChart';
import SensitivityAnalysis from '../../../components/dashboard/SensitivityAnalysis/SensitivityAnalysis';
import CashFlowTable from '../../../components/dashboard/CashFlowTable/CashFlowTable';
import './Finanzas.css';

const Finanzas: React.FC = () => {
    const { t } = useTranslation('common');

    return (
        <div className="finanzas-container">
            <h1 className="finanzas-main-title">
                {t('financial_dashboard')}
            </h1>
            <p className="finanzas-subtitle">
                {t('manage_financial_projections')}
            </p>


            {/* Metrics Grid */}
            <div className="finanzas-metrics-grid">
                <MetricCard
                    title={t('gross_profit')}
                    value="$125,000"
                    subtext="+15% vs mes anterior"
                    trend="up"
                />
                <MetricCard
                    title={t('operating_profit')}
                    value="$89,500"
                    subtext="+8% vs mes anterior"
                    trend="up"
                />
                <MetricCard
                    title={t('net_profit')}
                    value="$65,000"
                    subtext="+12% vs mes anterior"
                    trend="up"
                />
                <MetricCard
                    title={t('costs')}
                    value="$60,000"
                    subtext="-3% vs mes anterior"
                    trend="down"
                />
                <MetricCard
                    title={t('annual_recurring_revenue')}
                    value="$450,000"
                    subtext="+22% vs año anterior"
                    trend="up"
                />
                <MetricCard
                    title={t('churn_rate')}
                    value="2.5%"
                    subtext="-0.5% vs mes anterior"
                    trend="down"
                />
                <MetricCard
                    title={t('break_even_point')}
                    value="8 meses"
                    subtext="Proyectado Q3 2024"
                    trend="up"
                />
                <MetricCard
                    title={t('burn_rate')}
                    value="$15,000/mes"
                    subtext="18 meses de runway"
                    trend="up"
                />
            </div>

            {/* Charts Grid */}
            <div className="finanzas-charts-grid">
                <CashFlowChart />
                <RevenueVsCostsChart />
            </div>

            {/* Sensitivity Analysis */}
            <SensitivityAnalysis />

            {/* Cash Flow Table */}
            <CashFlowTable />
        </div>
    );
};

export default Finanzas;
