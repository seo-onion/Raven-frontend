import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import MetricCard from '../../../components/incubator/MetricCard/MetricCard';
import './Overview.css';
import { fetchMyIncubatorData } from '../../../api/incubator';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Overview: React.FC = () => {
    const { data: incubatorData, isLoading } = useQuery({
        queryKey: ['incubatorData'],
        queryFn: fetchMyIncubatorData,
    });

    const portfolio = incubatorData?.portfolio_startups || [];

    // Calculate Metrics
    const totalStartups = portfolio.length;
    const totalRevenue = portfolio.reduce((sum, s) => sum + (s.actual_revenue || 0), 0);
    // Mocking capital raised and success rate as they are not in the current data model
    const capitalRaised = 0;
    const successRate = 0;

    // Calculate Distribution (Doughnut Chart)
    const distribution = {
        incubation: 0,
        preIncubation: 0,
        acceleration: 0,
        graduated: 0
    };

    portfolio.forEach(s => {
        const trl = s.current_trl || 0;
        if (trl >= 1 && trl <= 3) distribution.preIncubation++;
        else if (trl >= 4 && trl <= 6) distribution.incubation++;
        else if (trl >= 7 && trl <= 9) distribution.acceleration++;
        // No explicit 'graduated' status in StartupData yet, assuming TRL 9+ or manual status
    });

    const doughnutChartData = {
        labels: ['Incubación', 'Pre-incubación', 'Aceleración', 'Graduadas'],
        datasets: [
            {
                label: 'Startups',
                data: [distribution.incubation, distribution.preIncubation, distribution.acceleration, distribution.graduated],
                backgroundColor: ['#7c3aed', '#4b89ff', '#2ec1ac', '#ffaa33'],
                borderColor: ['#7c3aed', '#4b89ff', '#2ec1ac', '#ffaa33'],
                borderWidth: 1,
            },
        ],
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    // Line Chart - No historical data available in current API
    // Showing empty or static for now to avoid broken UI
    const lineChartData = {
        labels: ['Actual'],
        datasets: [
            {
                label: 'Revenue Total ($)',
                data: [totalRevenue],
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Startups Activas',
                data: [totalStartups],
                borderColor: '#2ec1ac',
                backgroundColor: 'rgba(46, 193, 172, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    if (isLoading) {
        return <div className="p-8 text-center">Cargando dashboard...</div>;
    }

    return (
        <div className="incubator-overview">
            <div className="incubator-overview-header">
                <h1 className="text-black">Dashboard de Portafolio</h1>
                <p className="incubator-overview-subtitle text-black">Visión general del ecosistema de startups bajo tu gestión</p>
            </div>

            {/* Metrics Grid */}
            <div className="incubator-metrics-grid">
                <MetricCard
                    title="Total Startups"
                    value={totalStartups.toString()}
                    detail={`${distribution.incubation} en incubación activa`}
                    icon="📦"
                    type="startup"
                />
                <MetricCard
                    title="Revenue Total"
                    value={`$${(totalRevenue / 1000).toFixed(1)}K`}
                    detail="Total acumulado"
                    icon="💲"
                    type="revenue"
                />
                <MetricCard
                    title="Capital Levantado"
                    value={`$${capitalRaised}K`}
                    detail="Dato no disponible"
                    icon="🤝"
                    type="capital"
                />
                <MetricCard
                    title="Tasa de Éxito"
                    value={`${successRate}%`}
                    detail="Dato no disponible"
                    icon="🎯"
                    type="success"
                />
            </div>

            {/* Charts Section */}
            <div className="incubator-charts-section">
                <div className="incubator-chart-card incubator-evolution-chart">
                    <h2 className="text-black">Evolución del Portafolio</h2>
                    <div className="incubator-chart-container">
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                </div>
                <div className="incubator-chart-card incubator-distribution-chart">
                    <h2 className="text-black">Distribución por Etapa</h2>
                    <div className="incubator-chart-container">
                        <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                    </div>
                    <div className="incubator-legend">
                        <p className="text-black"><span className="incubator-color-dot incubation"></span> Incubación: {totalStartups ? Math.round((distribution.incubation / totalStartups) * 100) : 0}%</p>
                        <p className="text-black"><span className="incubator-color-dot pre-incubation"></span> Pre-incubación: {totalStartups ? Math.round((distribution.preIncubation / totalStartups) * 100) : 0}%</p>
                        <p className="text-black"><span className="incubator-color-dot acceleration"></span> Aceleración: {totalStartups ? Math.round((distribution.acceleration / totalStartups) * 100) : 0}%</p>
                        <p className="text-black"><span className="incubator-color-dot graduated"></span> Graduadas: {totalStartups ? Math.round((distribution.graduated / totalStartups) * 100) : 0}%</p>
                    </div>
                </div>
            </div>

            {/* Alerts Section - Static for now as API doesn't provide alerts */}
            <div className="incubator-alerts-section">
                <div className="incubator-alerts-header-wrapper">
                    <h2 className="text-black">Alertas del Portafolio</h2>
                    <button className="incubator-alerts-count text-white">0 alertas</button>
                </div>
                <div className="p-4 text-center text-gray-500">No hay alertas activas</div>
            </div>

            {/* Bottom Section: Activity and Quick Actions */}
            <div className="incubator-bottom-section">
                <div className="incubator-activity-card">
                    <h2 className="text-black">Actividad Reciente</h2>
                    <ul className="incubator-activity-list">
                        <div className="p-4 text-center text-gray-500">No hay actividad reciente</div>
                    </ul>
                </div>

                <div className="incubator-quick-actions-card">
                    <h2 className="text-black">Acciones Rápidas</h2>
                    <button className="incubator-quick-action-btn text-black">
                        <span>📦</span> Agregar Nueva Startup
                    </button>
                    <button className="incubator-quick-action-btn text-black">
                        <span>🗓️</span> Convocar Pitch Day
                    </button>
                    <button className="incubator-quick-action-btn text-black">
                        <span>🧑‍🏫</span> Asignar Mentor
                    </button>
                    <button className="incubator-quick-action-btn text-black">
                        <span>📄</span> Exportar Reporte
                    </button>
                </div>
            </div>

            {/* Summary Table */}
            <div className="incubator-summary-card">
                <h2 className="text-black">Resumen de Startups</h2>
                <div className="incubator-table-container">
                    <table className="incubator-startup-table">
                        <thead>
                            <tr>
                                <th className="text-black">Startup</th>
                                <th className="text-black">Etapa</th>
                                <th className="text-black">TRL</th>
                                <th className="text-black">Revenue</th>
                                <th className="text-black">Runway</th>
                                <th className="text-black">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.map((startup, index) => {
                                const trl = startup.current_trl || 0;
                                let stage = 'Desconocido';
                                if (trl >= 1 && trl <= 3) stage = 'Pre-incubación';
                                else if (trl >= 4 && trl <= 6) stage = 'Incubación';
                                else if (trl >= 7 && trl <= 9) stage = 'Aceleración';

                                return (
                                    <tr key={startup.id || index}>
                                        <td className="text-black">{startup.company_name}</td>
                                        <td>
                                            <span className={`incubator-badge incubator-incubation-stage text-black`}>
                                                {stage}
                                            </span>
                                        </td>
                                        <td className="text-black">{startup.current_trl || 'N/A'}</td>
                                        <td className="text-black">${startup.actual_revenue || 0}</td>
                                        <td className="text-black">N/A</td>
                                        <td>
                                            <span className={`incubator-badge incubator-healthy-status text-black`}>
                                                Activo
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;
