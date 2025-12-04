import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useIncubatorData } from '@/hooks/useIncubatorData';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import useModalStore from '@/stores/ModalStore';
import AddInvestorModal from '@/modals/AddInvestorModal/AddInvestorModal';
import { FiPlus, FiMail, FiPhone } from 'react-icons/fi';
import './Inversores.css';

const IncubatorInversores: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: incubatorData, isLoading } = useIncubatorData();
    const { setModalContent } = useModalStore();

    const investors = useMemo(() => {
        const members = incubatorData?.members;
        if (!members || !Array.isArray(members)) return [];
        return members.filter((member: any) => member.role === 'INVESTOR' || member.role === 'BOTH');
    }, [incubatorData]);

    const openAddInvestorModal = () => {
        setModalContent(<AddInvestorModal />);
    };

    if (isLoading) {
        return <div className="inversores_loading"><Spinner variant="primary" size="lg" /></div>;
    }

    return (
        <div className="inversores_container">
            <div className="inversores_header">
                <div>
                    <h1 className="inversores_title">{t('investors')}</h1>
                    <p className="inversores_subtitle">{t('manage_incubator_investors')}</p>
                </div>
                <Button variant="primary" onClick={openAddInvestorModal}>
                    <FiPlus /> {t('add_investor')}
                </Button>
            </div>

            <div className="inversores_grid">
                {investors.length > 0 ? (
                    investors.map((investor: any) => (
                        <div key={investor.id} className="inversores_card">
                            <div className="inversores_avatar">
                                {investor.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="inversores_content">
                                <h3 className="inversores_name">{investor.full_name}</h3>
                                <span className="inversores_role">{investor.role}</span>

                                <div className="inversores_details">
                                    <div className="inversores_detail_item">
                                        <FiMail className="inversores_detail_icon" />
                                        <span>{investor.email}</span>
                                    </div>
                                    {investor.phone && (
                                        <div className="inversores_detail_item">
                                            <FiPhone className="inversores_detail_icon" />
                                            <span>{investor.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="inversores_empty">
                        {t('no_investors_found')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncubatorInversores;
