import React from 'react';
import './RequirementItem.css';

interface RequirementItemProps {
    title: string;
    description?: string;
    completed: boolean;
    category: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({
    title,
    description,
    completed,
}) => {
    return (
        <div className={`requirement-item ${completed ? 'completed' : ''}`}>
            <div className="requirement-checkbox">
                {completed ? '✓' : ''}
            </div>
            <div className="requirement-content">
                <div className="requirement-header">
                    <h3 className="requirement-title text-black">{title}</h3>
                </div>
                <p className="requirement-description text-black">{description}</p>
            </div>
        </div>
    );
};

export default RequirementItem;
