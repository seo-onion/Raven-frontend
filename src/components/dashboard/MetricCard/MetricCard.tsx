import React from 'react';
// Usaremos Lucide icons ya que el estilo visual se acerca más al del diseño.
import { IoIosTrendingUp } from "react-icons/io";

interface MetricCardProps {
    title: string;
    value: string; // Valor principal, ej: "68%"
    secondaryValue: string; // Valor secundario, ej: "$340K"
    // Mantengo 'trend' por si quieres reutilizar el componente para mostrar flechas, 
    // pero para replicar la imagen, solo usaremos el ícono en el header.
    trend: 'up' | 'down' | 'neutral'; 
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, secondaryValue }) => {
    return (
        <div className="metriccard-container">
            
            {/* Encabezado: Contiene el círculo del ícono a la izquierda y el ícono pequeño a la derecha */}
            <div className="metriccard-header">
                
                {/* Ícono de la Métrica (Círculo Verde) */}
                <div className="metriccard-icon-wrapper">
                    <IoIosTrendingUp className="metriccard-icon" />
                </div>

            </div>

            {/* Título de la Métrica, ej: Utilidad Bruta */}
            <div className="metriccard-title">{title}</div>
            
            {/* Valor Principal, ej: 68% */}
            <div className="metriccard-value">{value}</div>
            
            {/* Valor Secundario, ej: $340K */}
            <div className="metriccard-secondary-value">{secondaryValue}</div>
        </div>
    );
};

export default MetricCard;