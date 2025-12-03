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
import './RevenueVsCostsChart.css';
import type { FinancialData } from '@/types/startup'; // Import FinancialData type

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface RevenueVsCostsChartProps {
    financialData: FinancialData[];
    revenueMultiplier: number;
    costMultiplier: number;
}

const RevenueVsCostsChart: React.FC<RevenueVsCostsChartProps> = ({ financialData, revenueMultiplier, costMultiplier }) => {
    const { t } = useTranslation('common');

    // Dynamically generate chart data based on financialData and multipliers
    const labels = financialData.map(data => new Date(data.period_date).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }));
    const revenues = financialData.map(data => data.revenue * revenueMultiplier);
    const costs = financialData.map(data => data.costs * costMultiplier);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: t('revenue'),
                data: revenues,
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
            },
            {
                label: t('costs'),
                data: costs,
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4,
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
                    label: function (context: any) {
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
                    callback: function (value: any) {
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
        <div className="revenuecostschart-container">
            <h3 className="revenuecostschart-title">{t('revenue_vs_costs')}</h3>
            <div className="revenuecostschart-chart-wrapper">
                {financialData.length > 0 ? (
                    <Line data={chartData} options={chartOptions} />
                ) : (
                    <p>{t('no_financial_data_available')}</p>
                )}
            </div>
        </div>
    );
};

export default RevenueVsCostsChart;
