import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useIncubatorData } from '@/hooks/useIncubatorData';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import useModalStore from '@/stores/ModalStore';
import AddMentorModal from '@/modals/AddMentorModal/AddMentorModal';
import { FiPlus, FiMail, FiPhone } from 'react-icons/fi';
import './Mentoring.css';

const IncubatorMentoring: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: incubatorData, isLoading } = useIncubatorData();
    const { setModalContent } = useModalStore();

    const mentors = useMemo(() => {
        const members = incubatorData?.members;
        if (!members || !Array.isArray(members)) return [];
        return members.filter((member: any) => member.role === 'MENTOR' || member.role === 'BOTH');
    }, [incubatorData]);

    const openAddMentorModal = () => {
        setModalContent(<AddMentorModal />);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner variant="primary" size="lg" /></div>;
    }

    return (
        <div className="mentoring_container">
            <div className="mentoring_header">
                <div>
                    <h1 className="mentoring_title">{t('mentors')}</h1>
                    <p className="mentoring_subtitle">{t('manage_incubator_mentors')}</p>
                </div>
                <Button variant="primary" onClick={openAddMentorModal}>
                    <FiPlus /> {t('add_mentor')}
                </Button>
            </div>

            <div className="mentoring_grid">
                {mentors.length > 0 ? (
                    mentors.map((mentor: any) => (
                        <div key={mentor.id} className="mentoring_card">
                            <div className="mentoring_avatar">
                                {mentor.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="mentoring_content">
                                <h3 className="mentoring_name">{mentor.full_name}</h3>
                                <span className="mentoring_role">{mentor.role}</span>

                                <div className="mentoring_details">
                                    <div className="mentoring_detail_item">
                                        <FiMail className="mentoring_detail_icon" />
                                        <span>{mentor.email}</span>
                                    </div>
                                    {mentor.phone && (
                                        <div className="mentoring_detail_item">
                                            <FiPhone className="mentoring_detail_icon" />
                                            <span>{mentor.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="mentoring_empty">
                        {t('no_mentors_found')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncubatorMentoring;
