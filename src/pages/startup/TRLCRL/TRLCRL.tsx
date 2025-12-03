import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReadinessIndicator from '../../../components/dashboard/ReadinessIndicator/ReadinessIndicator';
import { LevelItem, type LevelStatus } from '../../../components/dashboard/LevelItem/LevelItem';
import { useEvidences } from '../../../hooks/useStartupData';
import './TRLCRL.css';

const TRLCRL: React.FC = () => {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState<'trl' | 'crl'>('trl');
    const [openLevelIndex, setOpenLevelIndex] = useState<number | null>(null);
    const { data: evidences } = useEvidences();

    // Get current TRL level from evidences
    const currentTRL = evidences && evidences.length > 0
        ? Math.max(...evidences.map(e => e.level))
        : 1;

    interface LevelData {
        level: number;
        title: string;
        description: string;
        status: LevelStatus;
        lastUpdate?: string;
        updatedBy?: string;
    }

    const trlLevels: LevelData[] = [
        {
            level: 1,
            title: 'Principios básicos observados',
            description: 'Investigación científica básica, referencias en literatura y/o artículos aplicados',
            status: 'completed',
            lastUpdate: '14/01/2024',
            updatedBy: 'Elena Ríos',
        },
        {
            level: 2,
            title: 'Concepto tecnológico formulado',
            description: 'Aplicación práctica pensada y organizacional.',
            status: 'completed',
            lastUpdate: '16/02/2024',
            updatedBy: 'Luis Ruiz',
        },
        {
            level: 3,
            title: 'Prueba de concepto experimental',
            description: 'Investigación activa de I+D iniciales con estudios analíticos y de laboratorio.',
            status: 'completed',
            lastUpdate: '04/03/2024',
            updatedBy: 'Mario González',
        },
        {
            level: 4,
            title: 'Validación en laboratorio',
            description: 'Tecnología componente básica y sus elementos integrados para establecer que funcionan juntos.',
            status: 'in-progress',
            lastUpdate: '30/10/2024',
            updatedBy: 'Carla Ruiz',
        },
        {
            level: 5,
            title: 'Validación en entorno relevante',
            description: 'Tecnología componente básica y sus elementos integrados probados en un entorno simulado.',
            status: 'pending',
        },
        {
            level: 6,
            title: 'Demostración del sistema en entorno relevante',
            description: 'Sistema o prototipo demostrado en ambiente operacional relevante',
            status: 'pending',
        },
        {
            level: 7,
            title: 'Demostración del sistema en entorno operacional',
            description: 'Prototipo del sistema demostrado en ambiente operacional',
            status: 'pending',
        },
        {
            level: 8,
            title: 'Sistema completo y calificado',
            description: 'Tecnología ha sido probada y calificada en su forma final',
            status: 'pending',
        },
        {
            level: 9,
            title: 'Sistema probado en misión exitosa',
            description: 'Sistema operando en condiciones reales del mercado',
            status: 'pending',
        },
    ];

    const crlLevels: LevelData[] = [
        {
            level: 1,
            title: 'Idea de negocio',
            description: 'Concepto inicial de negocio identificado',
            status: 'completed',
            lastUpdate: '10/01/2024',
            updatedBy: 'Ana Torres',
        },
        {
            level: 2,
            title: 'Formulación del modelo de negocio',
            description: 'Modelo de negocio básico definido',
            status: 'completed',
            lastUpdate: '15/02/2024',
            updatedBy: 'Pedro Sánchez',
        },
        {
            level: 3,
            title: 'Validación con clientes potenciales',
            description: 'Primeras validaciones con mercado objetivo',
            status: 'pending',
        },
        {
            level: 4,
            title: 'Demostración con primeros clientes',
            description: 'Primeras ventas o usuarios piloto',
            status: 'pending',
        },
        {
            level: 5,
            title: 'Comercialización inicial',
            description: 'Primeras operaciones comerciales activas',
            status: 'pending',
        },
        {
            level: 6,
            title: 'Operaciones comerciales establecidas',
            description: 'Operaciones comerciales regulares y repetibles',
            status: 'pending',
        },
    ];

    const currentLevels = activeTab === 'trl' ? trlLevels : crlLevels;
    // Use real TRL level from evidences or fallback to mock data
    const currentTRLLevel = evidences && evidences.length > 0
        ? currentTRL
        : trlLevels.filter(l => l.status === 'completed').length;
    const currentCRLLevel = crlLevels.filter(l => l.status === 'completed').length;

    return (
        <div className="trl-crl-container">
            <h1 className="trl-crl-main-title">
                {t('trl_crl_maturity_levels')}
            </h1>
            <p className="trl-crl-subtitle">
                {t('manage_tech_commercial_evidence')}
            </p>

            {/* Readiness Indicators Grid */}
            <div className="trl-crl-indicators-grid">
                <ReadinessIndicator
                    type="TRL"
                    currentLevel={currentTRLLevel}
                    totalLevels={9}
                    label={t('technology_readiness_level')}
                />
                <ReadinessIndicator
                    type="CRL"
                    currentLevel={currentCRLLevel}
                    totalLevels={9}
                    label={t('commercial_readiness_level')}
                />
            </div>

            {/* Tabs */}
            <div className="trl-crl-tabs">
                <button
                    className={`trl-crl-tab-btn ${activeTab === 'trl' ? 'trl-crl-tab-active' : ''}`}
                    onClick={() => setActiveTab('trl')}
                >
                    {t('trl_technology_readiness')}
                </button>
                <button
                    className={`trl-crl-tab-btn ${activeTab === 'crl' ? 'trl-crl-tab-active' : ''}`}
                    onClick={() => setActiveTab('crl')}
                >
                    {t('crl_commercial_readiness')}
                </button>
            </div>

            {/* Levels List */}
            <div className="trl-crl-levels-list">
                {currentLevels.map((level, index) => (
                    <LevelItem
                        key={level.level}
                        level={level.level}
                        title={level.title}
                        description={level.description}
                        status={level.status}
                        lastUpdate={level.lastUpdate}
                        updatedBy={level.updatedBy}
                        isOpen={openLevelIndex === index}
                        onToggle={() => setOpenLevelIndex(openLevelIndex === index ? null : index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TRLCRL;
