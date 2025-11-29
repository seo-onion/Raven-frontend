import React from 'react';
import './Timeline.css';
import { GoCheckCircle } from "react-icons/go";

// Definición de las etapas para fácil referencia y orden
const STAGES = [
    { key: 'pre-incubation', label: 'Pre-incubación' },
    { key: 'incubation', label: 'Incubación' },
    { key: 'acceleration', label: 'Aceleración' },
    { key: 'graduation', label: 'Graduación' },
];

// Tipo de las props
interface StageTimelineProps {
    /** La clave de la etapa actual (e.g., 'incubation') */
    currentStageKey: 'pre-incubation' | 'incubation' | 'acceleration' | 'graduation';
}

const StageTimeline: React.FC<StageTimelineProps> = ({ currentStageKey }) => {
    // Encontramos el índice de la etapa actual
    const currentIndex = STAGES.findIndex(stage => stage.key === currentStageKey);

    return (
        <div className="stage-timeline-container">
            {/* Título */}
            <h2 className="timeline-title">Timeline de Etapas</h2>

            <div className="timeline-stages">
                {STAGES.map((stage, index) => {
                    // Determinar el estado de cada etapa
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isPending = index > currentIndex;

                    // Clases CSS dinámicas para el estado visual
                    let statusClass = '';
                    if (isCompleted) statusClass = 'is-completed';
                    else if (isCurrent) statusClass = 'is-current';
                    else if (isPending) statusClass = 'is-pending';

                    return (
                        <React.Fragment key={stage.key}>
                            <div className={`stage-item ${statusClass}`}>
                                {/* Marcador de la Etapa */}
                                <div className="stage-marker">
                                    <span className="stage-icon">
                                        {/* Icono: Check si está completado, Círculo si está pendiente/actual */}
                                        {isCompleted ? (
                                            <GoCheckCircle size={18} className="completed-icon" />
                                        ) : (
                                            <span className="pending-circle" />
                                        )}
                                    </span>
                                    {/* Nombre de la Etapa y etiqueta "Actual" */}
                                    <span className="stage-label">
                                        {stage.label}
                                        {isCurrent && <span className="current-badge">Actual</span>}
                                    </span>
                                </div>
                                
                                {/* Barra de Progreso (Línea) */}
                                {/* No se muestra la barra después de la última etapa */}
                                {index < STAGES.length - 1 && (
                                    <div className="stage-progress-bar-container">
                                        <div 
                                            className={`stage-progress-bar ${isCompleted || isCurrent ? 'is-filled' : ''}`}
                                            // Estilo para simular el llenado parcial o total.
                                            // Usaremos un truco en CSS para el color, pero la clase 'is-filled' ayuda.
                                        >
                                            {/* La barra de progreso azul se muestra como un hijo de esta línea */}
                                            <div className={`progress-fill ${isCompleted || isCurrent ? 'full' : ''}`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StageTimeline;

// Ejemplo de uso (opcional, para referencia):
/*
import StageTimeline from './StageTimeline';
const MyComponent = () => (
    <StageTimeline currentStageKey="incubation" />
);
*/