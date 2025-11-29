import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaAward, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import MetricItem from '../../../components/dashboard/MetricItem/MetricItem';
import SessionCard from '../../../components/dashboard/SessionCard/SessionCard';
import MentorCard from '../../../components/dashboard/MentorCard/MentorCard';
import './Mentoring.css';

const Mentoring: React.FC = () => {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState<'all' | 'fundraising' | 'marketing' | 'tech' | 'legal' | 'product'>('all');

    return (
        <div className="mentoring-container">
            {/* Header */}
            <div className="mentoring-header">
                <h1 className="mentoring-main-title">
                    {t('mentoring')}
                </h1>
                <button className="mentoring-btn-primary">
                    <FaPlus className="mentoring-btn-icon" />
                    {t('request_mentoring')}
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="mentoring-metrics-grid">
                <MetricItem
                    icon={<FaAward style={{ color: '#6b7280' }} />}
                    label={t('certified_mentors')}
                    value="3"
                    valueColor="var(--main-secondary)"
                    iconBgColor="white"
                />
                <MetricItem
                    icon={<FaCalendar style={{ color: '#6b7280' }} />}
                    label={t('scheduled_sessions')}
                    value="1"
                    valueColor="var(--main-secondary)"
                    iconBgColor="white"
                />
                <MetricItem
                    icon={<FaCheckCircle style={{ color: '#6b7280' }} />}
                    label={t('completed_sessions')}
                    value="1"
                    valueColor="var(--main-secondary)"
                    iconBgColor="white"
                />
            </div>

            {/* Upcoming Sessions */}
            <div className="mentoring-section">
                <h2 className="mentoring-section-title">
                    {t('upcoming_sessions')}
                </h2>
                <SessionCard
                    title="Estrategia de Fundraising para Series A"
                    mentorName="Jane Doe"
                    date="28 oct 2024"
                    time="3:00 PM"
                />
            </div>

            {/* Mentors Directory */}
            <div className="mentoring-section">
                <h2 className="mentoring-section-title">
                    {t('mentors_directory')}
                </h2>

                {/* Filter Tabs */}
                <div className="mentoring-tabs">
                    <button
                        className={`mentoring-tab ${activeTab === 'all' ? 'mentoring-tab-active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        {t('all')}
                    </button>
                    <button
                        className={`mentoring-tab ${activeTab === 'fundraising' ? 'mentoring-tab-active' : ''}`}
                        onClick={() => setActiveTab('fundraising')}
                    >
                        {t('fundraising')}
                    </button>
                    <button
                        className={`mentoring-tab ${activeTab === 'marketing' ? 'mentoring-tab-active' : ''}`}
                        onClick={() => setActiveTab('marketing')}
                    >
                        {t('marketing')}
                    </button>
                    <button
                        className={`mentoring-tab ${activeTab === 'tech' ? 'mentoring-tab-active' : ''}`}
                        onClick={() => setActiveTab('tech')}
                    >
                        {t('tech')}
                    </button>
                    <button
                        className={`mentoring-tab ${activeTab === 'legal' ? 'mentoring-tab-active' : ''}`}
                        onClick={() => setActiveTab('legal')}
                    >
                        {t('legal')}
                    </button>
                    <button
                        className={`mentoring-tab ${activeTab === 'product' ? 'mentoring-tab-active' : ''}`}
                        onClick={() => setActiveTab('product')}
                    >
                        {t('product')}
                    </button>
                </div>

                {/* Mentor List */}
                <div className="mentoring-list">
                    <MentorCard
                        name="Dr. María González"
                        initials="M"
                        avatarColor="var(--main-secondary)"
                        role="CEO & Co-Founder @ TechInnovations"
                        bio="Ex-VP de Producto en Google. Fundadora de 3 startups exitosas con perfil combinado de $100M+."
                        expertise={['Tech', 'Product Marketing', 'Data & Analytics']}
                        experience={`15 ${t('years')}`}
                        rating={4.9}
                        ratingCount={156}
                        sessions={385}
                        isCertified={true}
                    />

                    <MentorCard
                        name="Carlos Ruiz"
                        initials="C"
                        avatarColor="#4f46e5"
                        role="CTO @ Perfect Solutions"
                        bio="Arquitecto de sistemas escalables. Ha liderado equipos técnicos de 50+ ingenieros alrededor del mundo."
                        expertise={['Tech Architecture', 'Team Building', 'Agile']}
                        expertiseColor="#4f46e5"
                        expertiseBgColor="#e0f2fe"
                        experience={`12 ${t('years')}`}
                        rating={4.6}
                        ratingCount={92}
                        sessions={101}
                        isCertified={true}
                    />

                    <MentorCard
                        name="Ana Martínez"
                        initials="A"
                        avatarColor="#10b981"
                        role="Growth Marketing Agent"
                        bio="Especialista en Growth Marketing. Ha escalado 3 startups de 0 a 100K usuarios."
                        expertise={['Marketing', 'Growth Hacking', 'Brand Strategy']}
                        expertiseColor="#10b981"
                        expertiseBgColor="#d1fae5"
                        experience={`10 ${t('years')}`}
                        rating={4.7}
                        ratingCount={78}
                        sessions={203}
                        isCertified={true}
                    />

                    <MentorCard
                        name="Roberto Díaz"
                        initials="R"
                        avatarColor="#9ca3af"
                        role="Legal & Corporate Advisor"
                        bio="Abogado corporativo especializado en startups y venture capital."
                        expertise={['Legal', 'Compliance', 'Corporate Finance']}
                        expertiseColor="#9ca3af"
                        expertiseBgColor="#f3f4f6"
                        experience={`5 ${t('years')}`}
                        rating={4.5}
                        ratingCount={24}
                        sessions={58}
                        isCertified={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default Mentoring;
