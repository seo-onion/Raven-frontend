import React, { useState } from 'react';
import useModalStore from '@/stores/ModalStore';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import Button from '@/components/common/Button/Button';
import './ScheduleMentorModal.css';

interface Mentor {
    id: number;
    name: string;
    role: string;
    initials: string;
    avatarColor: string;
}

interface ScheduleMentorModalProps {
    mentor?: Mentor;
    mentors?: Mentor[];
    handleClose?: () => void;
}

const ScheduleMentorModal: React.FC<ScheduleMentorModalProps> = ({ mentor: initialMentor, mentors }) => {
    const { t } = useTranslation('common');
    const { closeModal } = useModalStore();
    const [isScheduled, setIsScheduled] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | undefined>(initialMentor);
    const [formData, setFormData] = useState({
        topic: '',
        date: '',
        time: '',
        notes: ''
    });

    // If mentors are provided but no initial mentor, select the first one by default
    React.useEffect(() => {
        if (!selectedMentor && mentors && mentors.length > 0) {
            setSelectedMentor(mentors[0]);
        }
    }, [mentors, selectedMentor]);

    const handleMentorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mentorId = Number(e.target.value);
        const mentor = mentors?.find(m => m.id === mentorId);
        if (mentor) {
            setSelectedMentor(mentor);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMentor) return;

        // Simulate scheduling
        setIsScheduled(true);

        // Close modal after 2 seconds
        setTimeout(() => {
            closeModal();
        }, 2000);
    };

    if (isScheduled) {
        return (
            <div className="schedulementormodal-success">
                <div className="schedulementormodal-success-icon">
                    <FaCheckCircle />
                </div>
                <h3 className="schedulementormodal-success-title text-black">
                    {t('scheduled_successfully')}
                </h3>
                <p className="schedulementormodal-success-message text-black">
                    {t('mentor_scheduled_message', { mentorName: selectedMentor?.name })}
                </p>
            </div>
        );
    }

    return (
        <div className="schedulementormodal-container">
            <div className="schedulementormodal-header">
                <h3 className="schedulementormodal-title text-black">
                    {t('schedule_mentoring_session')}
                </h3>

                {mentors && mentors.length > 0 ? (
                    <div className="schedulementormodal-mentor-select-container">
                        <label htmlFor="mentor-select" className="schedulementormodal-label text-black">
                            {t('select_mentor')}
                        </label>
                        <select
                            id="mentor-select"
                            className="schedulementormodal-select"
                            value={selectedMentor?.id || ''}
                            onChange={handleMentorChange}
                        >
                            {mentors.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name} - {m.role}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : selectedMentor ? (
                    <div className="schedulementormodal-mentor-info">
                        <div
                            className="schedulementormodal-avatar"
                            style={{ backgroundColor: selectedMentor.avatarColor }}
                        >
                            {selectedMentor.initials}
                        </div>
                        <div>
                            <p className="schedulementormodal-mentor-name text-black">{selectedMentor.name}</p>
                            <p className="schedulementormodal-mentor-role">{selectedMentor.role}</p>
                        </div>
                    </div>
                ) : null}
            </div>

            <form className="schedulementormodal-form" onSubmit={handleSubmit}>
                <div className="schedulementormodal-form-group">
                    <label htmlFor="topic" className="schedulementormodal-label text-black">
                        {t('session_topic')}
                    </label>
                    <input
                        type="text"
                        id="topic"
                        name="topic"
                        className="schedulementormodal-input"
                        value={formData.topic}
                        onChange={handleInputChange}
                        required
                        placeholder={t('enter_topic')}
                    />
                </div>

                <div className="schedulementormodal-form-row">
                    <div className="schedulementormodal-form-group">
                        <label htmlFor="date" className="schedulementormodal-label text-black">
                            {t('date')}
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="schedulementormodal-input"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="schedulementormodal-form-group">
                        <label htmlFor="time" className="schedulementormodal-label text-black">
                            {t('time')}
                        </label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            className="schedulementormodal-input"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="schedulementormodal-form-group">
                    <label htmlFor="notes" className="schedulementormodal-label text-black">
                        {t('additional_notes')} ({t('optional')})
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        className="schedulementormodal-textarea"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder={t('enter_notes')}
                    />
                </div>

                <div className="schedulementormodal-actions">
                    <Button
                        variant="secondary"
                        onClick={closeModal}
                        className="schedulementormodal-btn-secondary"
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        className="schedulementormodal-btn-primary"
                    >
                        {t('schedule')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleMentorModal;
