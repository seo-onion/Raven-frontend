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

            <div className="progress-stats">
                <div>
                    <h2 className="progress-card-title text-black">{title}</h2>
                    <p className='progress-card-subtitle'>Desarrolla tu producto y valida tu modelo de negocio</p>
                </div>

                <div className="progress-percentage">
                    <span className="progress-number text-black">{percentage}%</span>
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
