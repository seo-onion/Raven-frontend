import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBolt, FaPaperPlane, FaDollarSign } from 'react-icons/fa';
import MetricItem from '../../../components/dashboard/MetricItem/MetricItem';
import ChallengeCard from '../../../components/dashboard/ChallengeCard/ChallengeCard';
import CreateChallengeSection from '../../../components/dashboard/CreateChallengeSection/CreateChallengeSection';
import './Desafios.css';

const Desafios: React.FC = () => {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState<'all' | 'compatible' | 'my-applications'>('all');

    return (
        <div className="desafios-container">
            {/* Header */}
            <div className="desafios-header">
                <h1 className="desafios-main-title">
                    {t('challenges_marketplace')}
                </h1>
            </div>

            {/* Metrics Grid */}
            <div className="desafios-metrics-grid">
                <MetricItem
                    icon={<FaBolt style={{ color: 'var(--main-secondary)' }} />}
                    label={t('available_challenges')}
                    value="2"
                    valueColor="var(--main-secondary)"
                    iconBgColor="#f3e8ff"
                />
                <MetricItem
                    icon={<FaPaperPlane style={{ color: 'var(--main-secondary)' }} />}
                    label={t('applications_sent')}
                    value="2"
                    valueColor="var(--main-secondary)"
                    iconBgColor="#f3e8ff"
                />
                <MetricItem
                    icon={<FaDollarSign style={{ color: '#10b981' }} />}
                    label={t('potential_value')}
                    value="$640K"
                    valueColor="#10b981"
                    iconBgColor="#d1fae5"
                />
            </div>

            {/* Tabs */}
            <div className="desafios-tabs">
                <button
                    className={`desafios-tab ${activeTab === 'all' ? 'desafios-tab-active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    {t('all_challenges')}
                </button>
                <button
                    className={`desafios-tab ${activeTab === 'compatible' ? 'desafios-tab-active' : ''}`}
                    onClick={() => setActiveTab('compatible')}
                >
                    {t('compatible_challenges')}
                </button>
                <button
                    className={`desafios-tab ${activeTab === 'my-applications' ? 'desafios-tab-active' : ''}`}
                    onClick={() => setActiveTab('my-applications')}
                >
                    {t('my_applications')}
                </button>
            </div>

            {/* Challenges List */}
            <div className="desafios-list">
                <ChallengeCard
                    avatar="B"
                    avatarColor="#4f46e5"
                    title="Sistema de detección de fraude con IA"
                    source="Banco Innovación"
                    description="Desarrollar una plataforma que use técnicas de machine learning para detectar fraudes en tiempo real con alta precisión. (Máximo 2 líneas de texto para que sea claro)"
                    technologies={['Python', 'Machine Learning', 'AWS']}
                    offerAmount="$70K - $100K"
                    coordinator="Marta Valles"
                    deadline="14/11/2024"
                    applicationsCount={12}
                    status="applied"
                    primaryButtonText={t('remove_application')}
                    secondaryButtonText={t('view_candidates')}
                />

                <ChallengeCard
                    avatar="R"
                    avatarColor="#10b981"
                    title="Optimización de cadena de suministro con IoT"
                    source="Retail Innova"
                    description="Reinventar la gestión de la cadena de suministro con IoT para trazabilidad en tiempo real de inventario y optimización logística."
                    technologies={['IoT', 'Blockchain', 'Cloud']}
                    offerAmount="$70K - $80K"
                    coordinator="Pedro Ortiz"
                    deadline="21/11/2024"
                    applicationsCount={6}
                    status="none"
                    primaryButtonText={t('apply_challenge')}
                    secondaryButtonText={t('view_details')}
                />

                <ChallengeCard
                    avatar="H"
                    avatarColor="var(--main-secondary)"
                    title="Plataforma de telemedicina integrada"
                    source="HealthCore Medical"
                    description="Desarrollo de plataforma que integre consultas virtuales, historial médico electrónico y gestión de pagos."
                    technologies={['Mobile', 'FHIR', 'API Integration']}
                    offerAmount="$40K - $100K"
                    coordinator="Daniela Pérez"
                    deadline="19/12/2024"
                    applicationsCount={19}
                    status="none"
                    primaryButtonText={t('view_my_proposal')}
                    secondaryButtonText={`${t('chat_with')} Daniela`}
                />

                <ChallengeCard
                    avatar="E"
                    avatarColor="#f97316"
                    title="Sistema de aprendizaje adaptativo"
                    source="EducaTech Global"
                    description="Plataforma educativa que se adapta al ritmo y estilo de aprendizaje de cada estudiante usando IA. (Máximo 2 líneas de texto)"
                    technologies={['Next.js', 'Python', 'Analytics']}
                    offerAmount="$30K - $60K"
                    coordinator="Ana Gutiérrez"
                    deadline="24/01/2025"
                    applicationsCount={18}
                    status="new"
                    primaryButtonText={t('view_my_proposal')}
                    secondaryButtonText={`${t('chat_with')} Ana`}
                />
            </div>

            {/* Create Challenge Section */}
            <CreateChallengeSection />
        </div>
    );
};

export default Desafios;
