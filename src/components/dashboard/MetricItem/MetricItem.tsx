import React from 'react';
import './MetricItem.css';

interface MetricItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueColor?: string;
    iconBgColor?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({
    icon,
    label,
    value,
    valueColor = 'var(--main-secondary)',
    iconBgColor = '#f3e8ff',
}) => {
    return (
        <div className="metricitem-container">
            <div
                className="metricitem-icon-container"
                style={{ backgroundColor: iconBgColor }}
            >
                {icon}
            </div>
            <div className="metricitem-content">
                <p className="metricitem-label">{label}</p>
                <span className="metricitem-value" style={{ color: valueColor }}>
                    {value}
                </span>
            </div>
        </div>
    );
};

export default MetricItem;
