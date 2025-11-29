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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const RevenueVsCostsChart: React.FC = () => {
    const { t } = useTranslation('common');

    const chartData = {
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        datasets: [
            {
                label: t('revenue'),
                data: [125000, 145000, 165000, 185000],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
            },
            {
                label: t('costs'),
                data: [95000, 105000, 115000, 125000],
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
        <div className="revenuecostschart-container">
            <h3 className="revenuecostschart-title">{t('revenue_vs_costs')}</h3>
            <div className="revenuecostschart-chart-wrapper">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default RevenueVsCostsChart;
