import React, { useState } from 'react';
import ProgressCard from '../../../components/dashboard/ProgressCard/ProgressCard';
import Timeline from '../../../components/dashboard/Timeline/Timeline';
import RequirementItem from '../../../components/dashboard/RequirementItem/RequirementItem';
import CompanyInfo from '../../../components/dashboard/CompanyInfo/CompanyInfo';
import './MiProgreso.css';

const MiProgreso: React.FC = () => {
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

    const completedCount = requirements.filter(r => r.completed).length;
    const progressPercentage = Math.round((completedCount / requirements.length) * 100);

    const timelineEvents = [
        {
            id: 1,
            title: 'Registro completado',
            date: '15 Nov 2024',
            type: 'success' as const,
            description: 'Tu cuenta ha sido creada exitosamente',
        },
        {
            id: 2,
            title: 'Perfil actualizado',
            date: '18 Nov 2024',
            type: 'success' as const,
            description: 'Información de la empresa añadida',
        },
        {
            id: 3,
            title: 'Próxima sesión de mentoría',
            date: '25 Nov 2024',
            type: 'pending' as const,
            description: 'Reunión con mentor asignado',
        },
        {
            id: 4,
            title: 'Evaluación TRL pendiente',
            date: '30 Nov 2024',
            type: 'warning' as const,
            description: 'Completa tu evaluación de madurez',
        },
    ];

    return (
        <div className="mi-progreso-container">
            <div className="mi-progreso-header">
                <h1 className="text-black">Mi Progreso</h1>
                <p className="text-black">Resumen de tu trayectoria en el proceso de incubación</p>
            </div>

            <div className="mi-progreso-grid">
                <div className="mi-progreso-main">
                    <ProgressCard
                        title="Progreso General"
                        percentage={progressPercentage}
                        completedCount={completedCount}
                        totalCount={requirements.length}
                    />

                    <div className="requirements-section">
                        <h2 className="section-title text-black">Requisitos</h2>
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

                    <div className="timeline-section">
                        <h2 className="section-title text-black">Línea de Tiempo</h2>
                        <Timeline events={timelineEvents} />
                    </div>
                </div>

                <aside className="mi-progreso-sidebar">
                    <CompanyInfo />
                </aside>
            </div>
        </div>
    );
};

export default MiProgreso;
