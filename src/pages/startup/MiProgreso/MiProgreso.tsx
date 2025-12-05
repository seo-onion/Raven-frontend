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
import useStartupValidation from '@/hooks/useStartupValidation';
import { useInvestmentRounds } from '@/hooks/useStartupData';
import { useMentoringSessions } from '@/hooks/useIncubatorData';
import './MiProgreso.css';

const MiProgreso: React.FC = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const { data: rounds } = useInvestmentRounds();

    const currentRound = rounds?.find(r => r.is_current);
    const targetAmount = currentRound ? Number(currentRound.target_amount || 0) : 0;
    const currentAmount = currentRound?.investors?.reduce((acc, inv) => acc + Number(inv.amount || 0), 0) || 0;

    // Validate startup has company_name, redirect to wizard if not
    useStartupValidation();

    const [requirements, setRequirements] = useState([
        {
            id: 1,
            title: 'Completar perfil de empresa',
            description: 'Añade información básica sobre tu startup',
            completed: false, // Assuming it's not completed by default
            category: 'Perfil',
        },
    ]);

    const handleToggleRequirement = (id: number) => {
        setRequirements(prev => prev.map(req =>
            req.id === id ? { ...req, completed: !req.completed } : req
        ));
    };

    // // Alerts data
    // const alerts = [

    // ];

    // Mentoring sessions data
    const { data: sessionsData } = useMentoringSessions();

    const mentoringSessions = sessionsData?.map(session => {
        const startDate = new Date(session.start_time);
        return {
            id: String(session.id),
            title: session.title,
            mentorName: session.mentor_name,
            date: startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: startDate.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }),
        };
    }) || [];

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
                                        onClick={() => handleToggleRequirement(requirement.id)}
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
                    <Timeline currentStageKey="pre-incubation" />
                </div>

                {/* Grid for Alerts and Mentoring Sessions */}
                <div className="mi-progreso-grid-two">
                    <AlertsNotifications alerts={[]} />
                    <MentoringSessions
                        sessions={mentoringSessions}
                        onViewAll={() => navigate("/dashboard/mentoring")}
                    />
                </div>

                {/* Funding Progress */}
                {currentRound && (
                    <FundingProgress
                        currentAmount={currentAmount}
                        targetAmount={targetAmount}
                        roundName={currentRound.name}
                        onSearchInvestors={() => navigate("/dashboard/inversores")}
                    />
                )}

                {/* Quick Actions */}
                <QuickActions actions={quickActions} />
            </div>
        </div>
    );
};

export default MiProgreso;
