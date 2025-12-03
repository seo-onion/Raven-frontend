import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import './CashFlowChart.css';
import type { FinancialData } from '../../../types/startup'; // Corrected import path with 'type'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface CashFlowChartProps {
    financialData: FinancialData[];
    revenueMultiplier: number;
    costMultiplier: number;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ financialData, revenueMultiplier, costMultiplier }) => {
    const { t } = useTranslation('common');

    // Dynamically generate chart data based on financialData and multipliers
    const labels = financialData.map(data => new Date(data.period_date).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }));
    const netCashFlowData = financialData.map(data => {
        const adjustedRevenue = data.revenue * revenueMultiplier;
        const adjustedCosts = data.costs * costMultiplier;
        return adjustedRevenue - adjustedCosts;
    });

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: t('net_cash_flow'),
                data: netCashFlowData,
                borderColor: 'var(--main-secondary)',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('es-PE', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value: any) {
                        return new Intl.NumberFormat('es-PE', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                        }).format(value);
                    }
                }
            },
        },
    };

    return (
        <div className="cashflowchart-container">
            <h3 className="cashflowchart-title">{t('cash_flow_projection')}</h3>
            <div className="cashflowchart-chart-wrapper">
                {financialData.length > 0 ? (
                    <Line data={chartData} options={chartOptions} />
                ) : (
                    <p>{t('no_financial_data_available')}</p>
                )}
            </div>
        </div>
    );
};

export default CashFlowChart;
