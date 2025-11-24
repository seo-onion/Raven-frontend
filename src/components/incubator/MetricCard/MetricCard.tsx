import React from 'react';
import './MetricCard.css';

interface MetricCardProps {
    title: string;
    value: string;
    detail: string;
    icon: string;
    type: 'startup' | 'revenue' | 'capital' | 'success';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, detail, icon, type }) => {
    return (
        <div className={`incubator-metric-card incubator-metric-${type}`}>
            <div className="incubator-metric-header">
                <span className="incubator-metric-title text-black">{title}</span>
                <span className="incubator-metric-icon">{icon}</span>
            </div>
            <div className="incubator-metric-value text-black">{value}</div>
            <div className="incubator-metric-detail text-black">{detail}</div>
        </div>
    );
};

export default MetricCard;
