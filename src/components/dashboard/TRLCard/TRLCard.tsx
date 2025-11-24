import React from 'react';
import './TRLCard.css';

interface TRLCardProps {
    level: number;
    title: string;
    description: string;
    current: boolean;
    completed: boolean;
}

const TRLCard: React.FC<TRLCardProps> = ({
    level,
    title,
    description,
    current,
    completed,
}) => {
    return (
        <div className={`trl-card ${current ? 'current' : ''} ${completed ? 'completed' : ''}`}>
            <div className="trl-card-header">
                <div className="trl-level">
                    <span className="level-number text-black">Nivel {level}</span>
                    {completed && <span className="level-check">✓</span>}
                    {current && <span className="level-badge text-black">Actual</span>}
                </div>
            </div>
            <h3 className="trl-title text-black">{title}</h3>
            <p className="trl-description text-black">{description}</p>
        </div>
    );
};

export default TRLCard;
