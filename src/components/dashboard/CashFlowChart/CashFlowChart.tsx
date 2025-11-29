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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CashFlowChart: React.FC = () => {
    const { t } = useTranslation('common');

    const chartData = {
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        datasets: [
            {
                label: t('net_cash_flow'),
                data: [30000, 40000, 50000, 60000],
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
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default CashFlowChart;
