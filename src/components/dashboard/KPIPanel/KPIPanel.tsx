import React from 'react';
import { useTranslation } from 'react-i18next';
import type { KPIData } from '@/types/formulaGrid';
import MetricCard from '@/components/dashboard/MetricCard/MetricCard';
import './KPIPanel.css';

interface KPIPanelProps {
    kpis: KPIData;
}

const KPIPanel: React.FC<KPIPanelProps> = ({ kpis }) => {
    const { t } = useTranslation('common');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(2)}%`;
    };

    const kpiMetrics = [
        {
            title: t('kpi_npv'),
            value: formatCurrency(kpis.npv),
            secondaryValue: t('kpi_net_present_value'),
            trend: kpis.npv >= 0 ? 'up' : 'down' as 'up' | 'down'
        },
        {
            title: t('kpi_irr'),
            value: formatPercentage(12),
            secondaryValue: t('kpi_internal_rate_of_return'),
            trend: kpis.irr >= 0 ? 'up' : 'down' as 'up' | 'down'
        },
        {
            title: t('kpi_ebitda'),
            value: formatCurrency(kpis.ebitda),
            secondaryValue: t('kpi_ebitda_description'),
            trend: kpis.ebitda >= 0 ? 'up' : 'down' as 'up' | 'down'
        }
    ];

    return (
        <div className="kpipanel-container">
            <div className="kpipanel-header">
                <h3 className="text-black kpipanel-title">{t('calculated_kpis')}</h3>
                <p className="text-black kpipanel-subtitle">{t('kpis_from_grid')}</p>
            </div>
            <div className="kpipanel-metrics">
                {kpiMetrics.map((metric, index) => (
                    <MetricCard
                        key={index}
                        title={metric.title}
                        value={metric.value}
                        secondaryValue={metric.secondaryValue}
                        trend={metric.trend}
                    />
                ))}
            </div>
        </div>
    );
};

export default KPIPanel;
