import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaAward, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import MetricItem from '../../../components/dashboard/MetricItem/MetricItem';
import SessionCard from '../../../components/dashboard/SessionCard/SessionCard';
import MentorCard from '../../../components/dashboard/MentorCard/MentorCard';
import useModalStore from '../../../stores/ModalStore';
import useStartupValidation from '@/hooks/useStartupValidation';
import ScheduleMentorModal from '../../../modals/ScheduleMentorModal/ScheduleMentorModal';
import { useMentors } from '@/hooks/useStartupData';
import Spinner from '@/components/common/Spinner/Spinner';
import './Mentoring.css';

const Mentoring: React.FC = () => {
    const { t } = useTranslation('common');
    const { setModalContent } = useModalStore();

    // Validate startup has company_name, redirect to wizard if not
    useStartupValidation();

    // Fetch mentors from associated incubators
    const { data: mentorsList = [], isLoading, error } = useMentors();

    // Transform backend mentors to card format
    const mentorsData = mentorsList.map((mentor) => {
        // Generate initials from name
        const initials = mentor.full_name
            .split(' ')
            .slice(0, 2)
            .map((namePart: string) => namePart[0])
            .join('')
            .toUpperCase();

        // Generate a consistent avatar color based on name hash
        const colors = [
            'var(--main-secondary)',
            '#4f46e5',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#ec4899',
            '#14b8a6',
        ];
        const colorIndex = mentor.id % colors.length;
        const avatarColor = colors[colorIndex];

        return {
            id: mentor.id,
            name: mentor.full_name,
            initials: initials,
            avatarColor: avatarColor,
            role: mentor.role === 'BOTH' ? 'Mentor / Inversor' : 'Mentor',
            email: mentor.email,
            phone: mentor.phone || '',
            bio: '', // Backend doesn't provide bio
            expertise: [], // Backend doesn't provide expertise
            expertiseColor: avatarColor,
            expertiseBgColor: '#ede9fe',
            experience: '', // Backend doesn't provide experience
            rating: 0, // Backend doesn't provide rating
            ratingCount: 0,
            sessions: 0, // Backend doesn't provide sessions count
            isCertified: false,
        };
    });

    const handleRequestMentoring = () => {
        if (mentorsData.length > 0) {
            const defaultMentor = mentorsData[0];
            setModalContent(
                <ScheduleMentorModal
                    mentor={{
                        name: defaultMentor.name,
                        role: defaultMentor.role,
                        initials: defaultMentor.initials,
                        avatarColor: defaultMentor.avatarColor,
                    }}
                />
            );
        }
    };

    const handleScheduleMentor = (mentor: typeof mentorsData[0]) => {
        setModalContent(
            <ScheduleMentorModal
                mentor={{
                    name: mentor.name,
                    role: mentor.role,
                    initials: mentor.initials,
                    avatarColor: mentor.avatarColor,
                }}
            />
        );
    };

    if (isLoading) {
        return (
            <div className="mentoring-loading">
                <Spinner variant="primary" size="lg" />
            </div>
        );
    }

    if (error || mentorsData.length === 0) {
        return (
            <div className="mentoring-empty">
                <p>{t('no_mentors_available')}</p>
            </div>
        );
    }

    return (
        <div className="mentoring-container">
            {/* Header */}
            <div className="mentoring-header">
                <h1 className="mentoring-main-title">
                    {t('mentoring')}
                </h1>
                <button className="mentoring-btn-primary" onClick={handleRequestMentoring}>
                    <FaPlus className="mentoring-btn-icon" />
                    {t('request_mentoring')}
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="mentoring-metrics-grid">
                <MetricItem
                    icon={<FaAward style={{ color: '#6b7280' }} />}
                    label={t('available_mentors')}
                    value={String(mentorsData.length)}
                    valueColor="var(--main-secondary)"
                    iconBgColor="white"
                />
                <MetricItem
                    icon={<FaCalendar style={{ color: '#6b7280' }} />}
                    label={t('scheduled_sessions')}
                    value="0"
                    valueColor="var(--main-secondary)"
                    iconBgColor="white"
                />
                <MetricItem
                    icon={<FaCheckCircle style={{ color: '#6b7280' }} />}
                    label={t('completed_sessions')}
                    value="0"
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

                {/* Mentor List */}
                <div className="mentoring-list">
                    {mentorsData.map((mentor) => (
                        <MentorCard
                            key={mentor.id}
                            name={mentor.name}
                            initials={mentor.initials}
                            avatarColor={mentor.avatarColor}
                            role={mentor.role}
                            bio={mentor.bio}
                            expertise={mentor.expertise}
                            expertiseColor={mentor.expertiseColor}
                            expertiseBgColor={mentor.expertiseBgColor}
                            experience={mentor.experience}
                            rating={mentor.rating}
                            ratingCount={mentor.ratingCount}
                            sessions={mentor.sessions}
                            isCertified={mentor.isCertified}
                            onSchedule={() => handleScheduleMentor(mentor)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mentoring;
