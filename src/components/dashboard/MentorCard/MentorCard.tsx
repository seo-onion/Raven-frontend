import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaStar } from 'react-icons/fa';
import './MentorCard.css';

interface MentorCardProps {
    name: string;
    initials: string;
    avatarColor: string;
    role: string;
    bio: string;
    expertise: string[];
    expertiseColor?: string;
    expertiseBgColor?: string;
    experience: string;
    rating: number;
    ratingCount: number;
    sessions: number;
    isCertified?: boolean;
    onSchedule?: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({
    name,
    initials,
    avatarColor,
    role,
    bio,
    expertise,
    expertiseColor = 'var(--main-secondary)',
    expertiseBgColor = '#ede9fe',
    experience,
    rating,
    ratingCount,
    sessions,
    isCertified = true,
    onSchedule,
}) => {
    const { t } = useTranslation('common');

    return (
        <div className="mentorcard-container">
            <div
                className="mentorcard-avatar"
                style={{ backgroundColor: avatarColor }}
            >
                {initials}
            </div>
            <div className="mentorcard-content">
                <div className="mentorcard-header">
                    <h4 className="mentorcard-name">{name}</h4>
                    {isCertified && (
                        <div className="mentorcard-certificate">
                            <FaCheck className="mentorcard-certificate-icon" />
                            {t('certified')}
                        </div>
                    )}
                </div>
                <p className="mentorcard-role">{role}</p>
                <p className="mentorcard-bio">{bio}</p>

                <div className="mentorcard-expertise">
                    {expertise.map((tag, index) => (
                        <span
                            key={index}
                            className="mentorcard-expertise-tag"
                            style={{ color: expertiseColor, backgroundColor: expertiseBgColor }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mentorcard-stats">
                    <div className="mentorcard-stats-group">
                        <div className="mentorcard-stat-item">
                            <span className="mentorcard-stat-label">
                                {t('experience')}
                            </span>
                            <span className="mentorcard-stat-value">{experience}</span>
                        </div>
                        <div className="mentorcard-stat-item">
                            <span className="mentorcard-stat-label">
                                {t('rating')}
                            </span>
                            <span className="mentorcard-stat-value">
                                <FaStar className="mentorcard-rating-star" />
                                {rating} ({ratingCount})
                            </span>
                        </div>
                        <div className="mentorcard-stat-item">
                            <span className="mentorcard-stat-label">
                                {t('sessions')}
                            </span>
                            <span className="mentorcard-stat-value">{sessions}</span>
                        </div>
                    </div>
                    <div className="mentorcard-actions">
                        <button className="mentorcard-button" onClick={onSchedule}>
                            {t('schedule_mentoring')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorCard;
