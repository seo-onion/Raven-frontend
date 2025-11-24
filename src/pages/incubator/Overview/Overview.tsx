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
import MetricCard from '../../../components/incubator/MetricCard/MetricCard';
import './Overview.css';

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
    const startups = [
        { name: 'EduPlay', stage: 'Incubación', trl: '4/9', revenue: '$5K', runway: '6 meses', status: 'critical' },
        { name: 'HealthHub', stage: 'Incubación', trl: '6/9', revenue: '$12K', runway: '10 meses', status: 'warning' },
        { name: 'TechVision AI', stage: 'Incubación', trl: '5/9', revenue: '$45K', runway: '9 meses', status: 'healthy' },
        { name: 'EcoDelivery', stage: 'Aceleración', trl: '7/9', revenue: '$89K', runway: '14 meses', status: 'excellent' },
        { name: 'SmartFarm', stage: 'Graduado', trl: '9/9', revenue: '$250K', runway: '18 meses', status: 'graduated' },
    ];

    const activities = [
        { startup: 'HealthHub', action: 'Cerró proyecto con Clínica San Felipe', time: 'Hace 2 horas', color: '#2ec1ac' },
        { startup: 'TechVision AI', action: 'Subió evidencias de TRL 4', time: 'Hace 5 horas', color: '#4b89ff' },
        { startup: 'EcoDelivery', action: 'Alcanzó $89K en revenue', time: 'Hace 1 día', color: '#ffaa33' },
        { startup: 'EduPlay', action: 'Solicitó mentoría en Legal', time: 'Hace 2 días', color: 'var(--main-primary)' },
    ];

    const lineChartData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue Total ($K)',
                data: [250, 280, 320, 350, 380, 401],
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Startups Activas',
                data: [3, 4, 4, 5, 5, 5],
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

    const doughnutChartData = {
        labels: ['Incubación', 'Pre-incubación', 'Aceleración', 'Graduadas'],
        datasets: [
            {
                label: 'Startups',
                data: [2, 1, 1, 1],
                backgroundColor: [
                    '#7c3aed',
                    '#4b89ff',
                    '#2ec1ac',
                    '#ffaa33',
                ],
                borderColor: [
                    '#7c3aed',
                    '#4b89ff',
                    '#2ec1ac',
                    '#ffaa33',
                ],
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
                    value="5"
                    detail="2 en incubación activa"
                    icon="📦"
                    type="startup"
                />
                <MetricCard
                    title="Revenue Total"
                    value="$401K"
                    detail="↑ +15% vs mes anterior"
                    icon="💲"
                    type="revenue"
                />
                <MetricCard
                    title="Capital Levantado"
                    value="$850K"
                    detail="3 rondas activas"
                    icon="🤝"
                    type="capital"
                />
                <MetricCard
                    title="Tasa de Éxito"
                    value="85%"
                    detail="107h de mentoría total"
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
                        <p className="text-black"><span className="incubator-color-dot incubation"></span> Incubación: 40%</p>
                        <p className="text-black"><span className="incubator-color-dot pre-incubation"></span> Pre-incubación: 20%</p>
                        <p className="text-black"><span className="incubator-color-dot acceleration"></span> Aceleración: 20%</p>
                        <p className="text-black"><span className="incubator-color-dot graduated"></span> Graduadas: 20%</p>
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            <div className="incubator-alerts-section">
                <div className="incubator-alerts-header-wrapper">
                    <h2 className="text-black">Alertas del Portafolio</h2>
                    <button className="incubator-alerts-count text-white">3 alertas</button>
                </div>

                <div className="incubator-alert-item incubator-alert-critical">
                    <div className="incubator-alert-info">
                        <div className="incubator-alert-title text-black">EduPlay</div>
                        <div className="incubator-alert-detail text-black">Runway crítico (&lt;6 meses)</div>
                    </div>
                    <button className="incubator-alert-detail-btn text-black">Ver Detalles</button>
                </div>

                <div className="incubator-alert-item incubator-alert-warning">
                    <div className="incubator-alert-info">
                        <div className="incubator-alert-title text-black">TechVision AI</div>
                        <div className="incubator-alert-detail text-black">Sin actualizaciones en TRL 5 por 25 días.</div>
                    </div>
                    <button className="incubator-alert-detail-btn text-black">Ver Detalles</button>
                </div>

                <div className="incubator-alert-item incubator-alert-success">
                    <div className="incubator-alert-info">
                        <div className="incubator-alert-title text-black">EcoDelivery</div>
                        <div className="incubator-alert-detail text-black">Completó TRL 7 exitosamente</div>
                    </div>
                    <button className="incubator-alert-detail-btn text-black">Ver Detalles</button>
                </div>
            </div>

            {/* Bottom Section: Activity and Quick Actions */}
            <div className="incubator-bottom-section">
                <div className="incubator-activity-card">
                    <h2 className="text-black">Actividad Reciente</h2>
                    <ul className="incubator-activity-list">
                        {activities.map((activity, index) => (
                            <li key={index} className="incubator-activity-item">
                                <span className="incubator-activity-startup text-black" style={{ color: activity.color }}>
                                    {activity.startup}
                                </span>
                                <span className="text-black">{activity.action}</span>
                                <span className="incubator-activity-time text-black">{activity.time}</span>
                            </li>
                        ))}
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

                    <div className="incubator-graduation-block">
                        <p className="text-black">Próxima Graduación</p>
                        <p className="text-black"><strong>EcoDelivery</strong> está lista para graduarse. Programa el evento de cierre.</p>
                        <button className="incubator-grad-btn text-white">Programar Graduación</button>
                    </div>
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
                            {startups.map((startup, index) => (
                                <tr key={index}>
                                    <td className="text-black">{startup.name}</td>
                                    <td>
                                        <span className={`incubator-badge incubator-${startup.stage.toLowerCase()}-stage text-black`}>
                                            {startup.stage}
                                        </span>
                                    </td>
                                    <td className="text-black">{startup.trl}</td>
                                    <td className="text-black">{startup.revenue}</td>
                                    <td className="text-black">{startup.runway}</td>
                                    <td>
                                        <span className={`incubator-badge incubator-${startup.status}-status text-black`}>
                                            {startup.status === 'critical' && '🚨 Crítico'}
                                            {startup.status === 'warning' && '⚠️ Alerta'}
                                            {startup.status === 'healthy' && '✅ Saludable'}
                                            {startup.status === 'excellent' && '⭐ Excelente'}
                                            {startup.status === 'graduated' && '🎓 Graduado'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;
