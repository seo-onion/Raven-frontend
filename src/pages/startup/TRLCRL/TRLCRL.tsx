import React, { useState } from 'react';
import TRLCard from '../../../components/dashboard/TRLCard/TRLCard';
import EvidenceUpload from '../../../components/dashboard/EvidenceUpload/EvidenceUpload';
import './TRLCRL.css';

const TRLCRL: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'trl' | 'crl'>('trl');

    const trlLevels = [
        {
            level: 1,
            title: 'Principios básicos observados',
            description: 'Investigación científica básica comienza a traducirse en investigación y desarrollo aplicado',
            current: false,
            completed: true,
        },
        {
            level: 2,
            title: 'Concepto de tecnología formulado',
            description: 'Aplicaciones prácticas de características observadas son identificadas',
            current: false,
            completed: true,
        },
        {
            level: 3,
            title: 'Prueba de concepto experimental',
            description: 'Validación experimental de concepto en laboratorio',
            current: false,
            completed: true,
        },
        {
            level: 4,
            title: 'Validación de componentes en laboratorio',
            description: 'Componentes básicos validados en entorno de laboratorio',
            current: true,
            completed: false,
        },
        {
            level: 5,
            title: 'Validación de componentes en entorno relevante',
            description: 'Componentes validados en entorno relevante al uso final',
            current: false,
            completed: false,
        },
        {
            level: 6,
            title: 'Demostración del sistema en entorno relevante',
            description: 'Sistema o prototipo demostrado en ambiente operacional relevante',
            current: false,
            completed: false,
        },
        {
            level: 7,
            title: 'Demostración del sistema en entorno operacional',
            description: 'Prototipo del sistema demostrado en ambiente operacional',
            current: false,
            completed: false,
        },
        {
            level: 8,
            title: 'Sistema completo y calificado',
            description: 'Tecnología ha sido probada y calificada en su forma final',
            current: false,
            completed: false,
        },
        {
            level: 9,
            title: 'Sistema probado en misión exitosa',
            description: 'Sistema operando en condiciones reales del mercado',
            current: false,
            completed: false,
        },
    ];

    const crlLevels = [
        {
            level: 1,
            title: 'Idea de negocio',
            description: 'Concepto inicial de negocio identificado',
            current: false,
            completed: true,
        },
        {
            level: 2,
            title: 'Formulación del modelo de negocio',
            description: 'Modelo de negocio básico definido',
            current: false,
            completed: true,
        },
        {
            level: 3,
            title: 'Validación con clientes potenciales',
            description: 'Primeras validaciones con mercado objetivo',
            current: true,
            completed: false,
        },
        {
            level: 4,
            title: 'Demostración con primeros clientes',
            description: 'Primeras ventas o usuarios piloto',
            current: false,
            completed: false,
        },
        {
            level: 5,
            title: 'Comercialización inicial',
            description: 'Primeras operaciones comerciales activas',
            current: false,
            completed: false,
        },
        {
            level: 6,
            title: 'Operaciones comerciales establecidas',
            description: 'Operaciones comerciales regulares y repetibles',
            current: false,
            completed: false,
        },
    ];

    const currentLevels = activeTab === 'trl' ? trlLevels : crlLevels;

    return (
        <div className="trl-crl-container">
            <div className="trl-crl-header">
                <h1 className="text-black">Evaluación TRL/CRL</h1>
                <p className="text-black">Nivel de Madurez Tecnológica y Comercial</p>
            </div>

            <div className="trl-crl-tabs">
                <button
                    className={`tab-btn ${activeTab === 'trl' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trl')}
                >
                    <span className="tab-icon">🔬</span>
                    <span className="text-black">TRL - Madurez Tecnológica</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'crl' ? 'active' : ''}`}
                    onClick={() => setActiveTab('crl')}
                >
                    <span className="tab-icon">💼</span>
                    <span className="text-black">CRL - Madurez Comercial</span>
                </button>
            </div>

            <div className="trl-crl-content">
                <div className="levels-grid">
                    {currentLevels.map((level) => (
                        <TRLCard
                            key={level.level}
                            level={level.level}
                            title={level.title}
                            description={level.description}
                            current={level.current}
                            completed={level.completed}
                        />
                    ))}
                </div>

                <div className="evidence-section">
                    <h2 className="section-title text-black">Evidencias</h2>
                    <p className="section-description text-black">
                        Sube documentos que respalden tu nivel actual de madurez{' '}
                        {activeTab === 'trl' ? 'tecnológica' : 'comercial'}
                    </p>
                    <EvidenceUpload />
                </div>
            </div>
        </div>
    );
};

export default TRLCRL;
