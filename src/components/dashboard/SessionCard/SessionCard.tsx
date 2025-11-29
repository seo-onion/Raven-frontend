import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCalendar } from 'react-icons/fa';
import './SessionCard.css';

interface SessionCardProps {
    title: string;
    mentorName: string;
    date: string;
    time: string;
    onReschedule?: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
    title,
    mentorName,
    date,
    time,
    onReschedule,
}) => {
    const { t } = useTranslation('common');

    return (
        <div className="sessioncard-container">
            <div className="sessioncard-info">
                <h4 className="sessioncard-title">{title}</h4>
                <p className="sessioncard-meta">
                    {t('with')} {mentorName} ·{' '}
                    <FaCalendar className="sessioncard-icon" />
                    {date} - {time}
                </p>
            </div>
            <div className="sessioncard-actions">
                <button className="sessioncard-button" onClick={onReschedule}>
                    {t('reschedule')}
                </button>
            </div>
        </div>
    );
};

export default SessionCard;
