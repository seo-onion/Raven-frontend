import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './MetricCard.css';

interface MetricCardProps {
    title: string;
    value: string;
    subtext: string;
    trend: 'up' | 'down';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtext, trend }) => {
    return (
        <div className="metriccard-container">
            <div className="metriccard-header">
                <span className="metriccard-title">{title}</span>
            </div>
            <div className="metriccard-value">{value}</div>
            <div className="metriccard-subtext">
                <span className={`metriccard-trend metriccard-trend-${trend}`}>
                    {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                    {subtext}
                </span>
            </div>
        </div>
    );
};

export default MetricCard;
