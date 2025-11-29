import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProgressCard from '../../../components/dashboard/ProgressCard/ProgressCard';
import Timeline from '../../../components/dashboard/Timeline/Timeline';
import RequirementItem from '../../../components/dashboard/RequirementItem/RequirementItem';
import CompanyInfo from '../../../components/dashboard/CompanyInfo/CompanyInfo';
import AlertsNotifications from '../../../components/dashboard/AlertsNotifications/AlertsNotifications';
import MentoringSessions from '../../../components/dashboard/MentoringSessions/MentoringSessions';
import FundingProgress from '../../../components/dashboard/FundingProgress/FundingProgress';
import QuickActions from '../../../components/dashboard/QuickActions/QuickActions';
import { useNavigate } from 'react-router-dom';
import './MiProgreso.css';

const MiProgreso: React.FC = () => {
    const { t } = useTranslation('common');


        const navigate = useNavigate()
    
    const [requirements] = useState([
        {
            id: 1,
            title: 'Completar perfil de empresa',
            description: 'Añade información básica sobre tu startup',
            completed: true,
            category: 'Perfil',
        },
        {
            id: 2,
            title: 'Subir pitch deck',
            description: 'Documento de presentación de tu proyecto',
            completed: true,
            category: 'Documentos',
        },
        {
            id: 3,
            title: 'Validar nivel TRL/CRL',
            description: 'Completa la evaluación de madurez tecnológica',
            completed: false,
            category: 'Validación',
        },
        {
            id: 4,
            title: 'Conectar con mentores',
            description: 'Agenda al menos una sesión de mentoría',
            completed: false,
            category: 'Networking',
        },
        {
            id: 5,
            title: 'Completar plan financiero',
            description: 'Proyecciones a 3 años',
            completed: false,
            category: 'Finanzas',
        },
    ]);

    // Alerts data
    const alerts = [
        {
            id: '1',
            type: 'warning' as const,
            message: 'Burn rate actual: $8K/mes - Runway: 9 meses',
        },
        {
            id: '2',
            type: 'info' as const,
            message: 'Tienes 2 sesiones de mentoría programadas esta semana',
        },
        {
            id: '3',
            type: 'success' as const,
            message: "Nuevo desafío compatible: 'Sistema de detección de fraude con IA'",
        },
    ];

    // Mentoring sessions data
    const mentoringSessions = [
        {
            id: '1',
            title: 'Modelado financiero para Series A',
            mentorName: 'Carlos Mendoza',
            date: '28 oct 2024',
            time: '3:00 PM',
        },
        {
            id: '2',
            title: 'Estrategia Go-to-Market',
            mentorName: 'Ana Gutiérrez',
            date: '30 oct 2024',
            time: '10:00 AM',
        },
    ];

    // Quick actions data
    const quickActions = [
        {
            id: '1',
            icon: 'upload-evidence' as const,
            label: t('upload_evidence_trl'),
            onClick: () => navigate('/dashboard/trl-crl'),
        },
        {
            id: '2',
            icon: 'update-finances' as const,
            label: t('update_finances'),
            onClick: () => navigate('/dashboard/finanzas'),
        },
        {
            id: '3',
            icon: 'request-mentoring' as const,
            label: t('request_mentoring'),
            onClick: () => navigate('/dashboard/mentoring'),
        },
        {
            id: '4',
            icon: 'apply-challenge' as const,
            label: t('apply_to_challenge'),
            onClick: () => navigate('/dashboard/desafios'),
        },
    ];

    const completedCount = requirements.filter(r => r.completed).length;
    const progressPercentage = Math.round((completedCount / requirements.length) * 100);


    return (
        <div className="mi-progreso-container">
            <div className="mi-progreso-header">
                <h1 className="text-black">Mi Progreso</h1>
                <p className="text-black">Resumen de tu trayectoria en el proceso de incubación</p>
            </div>

            <div className="mi-progreso-grid">
                <div className="mi-progreso-main">
                    <div className="progress-requirements-unified">
                        <ProgressCard
                            title="Tu etapa actual: Incubación"
                            percentage={progressPercentage}
                            completedCount={completedCount}
                            totalCount={requirements.length}
                        />

                        <div className="requirements-section-unified">
                            <h2 className="section-subtitle text-black">Requisitos para avanzar a Aceleración</h2>
                            <div className="requirements-list">
                                {requirements.map(requirement => (
                                    <RequirementItem
                                        key={requirement.id}
                                        title={requirement.title}
                                        description={requirement.description}
                                        completed={requirement.completed}
                                        category={requirement.category}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="mi-progreso-sidebar">
                    <CompanyInfo />
                </aside>
            </div>

            {/* Full width sections */}
            <div className="mi-progreso-full-width">
                <div className="timeline-section">
                    <h2 className="section-subtitle text-black">Timeline de etapas</h2>
                    <Timeline currentStageKey="incubation"/>
                </div>

                {/* Grid for Alerts and Mentoring Sessions */}
                <div className="mi-progreso-grid-two">
                    <AlertsNotifications alerts={alerts} />
                    <MentoringSessions
                        sessions={mentoringSessions}
                        onViewAll={() => navigate("/dashboard/mentoring")}
                    />
                </div>

                {/* Funding Progress */}
                <FundingProgress
                    currentAmount={45000}
                    targetAmount={150000}
                    roundName="Ronda Seed"
                    onSearchInvestors={() => navigate("/dashboard/inversores")}
                />

                {/* Quick Actions */}
                <QuickActions actions={quickActions} />
            </div>
        </div>
    );
};

export default MiProgreso;
