import { useTranslation } from 'react-i18next';
import { FaCalendar } from 'react-icons/fa';
import Button from '@/components/common/Button/Button';
import './MentoringSessions.css';

export interface MentoringSession {
    id: string;
    title: string;
    mentorName: string;
    date: string;
    time: string;
}

interface MentoringSessionsProps {
    sessions: MentoringSession[];
    onViewAll?: () => void;
}

const MentoringSessions = ({ sessions, onViewAll }: MentoringSessionsProps) => {
    const { t } = useTranslation('common');

    return (
        <div className="mentoringsessions-container">
            <h2 className="mentoringsessions-title text-black">
                {t('upcoming_mentoring_sessions')}
            </h2>
            <div className="mentoringsessions-list">
                {sessions.map((session, index) => (
                    <div
                        key={session.id}
                        className={`mentoringsessions-item ${index < sessions.length - 1 ? 'mentoringsessions-item-border' : ''
                            }`}
                    >
                        <p className="mentoringsessions-item-title text-black">
                            {session.title}
                        </p>
                        <p className="mentoringsessions-item-mentor text-black">
                            {t('with')} {session.mentorName}
                        </p>
                        <div className="mentoringsessions-item-datetime">
                            <FaCalendar className="mentoringsessions-icon" />
                            <span className="text-black">
                                {session.date} - {session.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <Button
                variant="secondary"
                size="md"
                onClick={onViewAll}
                className="mentoringsessions-button"
            >
                {t('view_all_sessions')}
            </Button>
        </div>
    );
};

export default MentoringSessions;
