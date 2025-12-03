import React from 'react';
import Card from '@/components/common/Card/Card'; // Import the Card component
import { IoIosTrendingUp } from "react-icons/io"; // Keep the trend icon
import './MetricCard.css';

interface MetricCardProps {
    title: string;
    value: string; // Valor principal, ej: "68%"
    secondaryValue: string; // Valor secundario, ej: "$340K"
    trend: 'up' | 'down' | 'neutral'; // 'trend' prop will be used for icon color
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, secondaryValue, trend }) => {
    // Determine icon color based on trend
    const iconColor = trend === 'up' ? 'var(--state-success)' :
                      trend === 'down' ? 'var(--state-danger)' :
                      'var(--text-secondary)';

    return (
        <Card className="metriccard-container">
            {/* Encabezado: Contiene el círculo del ícono a la izquierda y el ícono pequeño a la derecha */}
            <div className="metriccard-header">
                
                {/* Ícono de la Métrica (Círculo Verde/Rojo/Gris) */}
                <div className="metriccard-icon-wrapper" style={{ backgroundColor: iconColor }}>
                    <IoIosTrendingUp className="metriccard-icon" />
                </div>

            </div>

            {/* Título de la Métrica, ej: Utilidad Bruta */}
            <div className="metriccard-title text-black">{title}</div>
            
            {/* Valor Principal, ej: 68% */}
            <div className="metriccard-value text-black">{value}</div>
            
            {/* Valor Secundario, ej: $340K */}
            <div className="metriccard-secondary-value text-black">{secondaryValue}</div>
        </Card>
    );
};

export default MetricCard;