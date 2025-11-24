import React from 'react';
import './ProgressCard.css';

interface ProgressCardProps {
    title: string;
    percentage: number;
    completedCount: number;
    totalCount: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
    title,
    percentage,
    completedCount,
    totalCount,
}) => {
    return (
        <div className="progress-card">
            <h2 className="progress-card-title text-black">{title}</h2>
            <div className="progress-stats">
                <div className="progress-percentage">
                    <span className="progress-number text-black">{percentage}%</span>
                    <span className="progress-label text-black">Completado</span>
                </div>
                <div className="progress-count">
                    <span className="count-text text-black">
                        {completedCount} de {totalCount} tareas
                    </span>
                </div>
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressCard;
