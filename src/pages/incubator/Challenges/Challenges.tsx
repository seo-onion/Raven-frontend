import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { FiFilter, FiPlus } from 'react-icons/fi';
import ChallengeCard from '@/components/dashboard/ChallengeCard/ChallengeCard';
import Spinner from '@/components/common/Spinner/Spinner';
import Button from '@/components/common/Button/Button';
import useModalStore from '@/stores/ModalStore';
import CreateChallengeModal from '@/modals/CreateChallengeModal/CreateChallengeModal';
import { fetchChallenges, fetchChallengeApplications, type ChallengeDTO, type ChallengeApplicationDTO } from '@/api/incubator';
import './Challenges.css';

const IncubatorChallenges: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: challenges, isLoading: isLoadingChallenges } = useQuery({
        queryKey: ['challenges'],
        queryFn: fetchChallenges,
    });
    const { data: applications, isLoading: isLoadingApplications } = useQuery({
        queryKey: ['challengeApplications'],
        queryFn: fetchChallengeApplications,
    });
    const { setModalContent } = useModalStore();

    const [activeTab, setActiveTab] = useState<'challenges' | 'applications'>('challenges');
    const [selectedChallengeFilter, setSelectedChallengeFilter] = useState<string>('all');

    const openCreateChallengeModal = () => {
        setModalContent(<CreateChallengeModal />);
    };

    const filteredApplications = useMemo(() => {
        if (!applications || !Array.isArray(applications)) return [];
        if (selectedChallengeFilter === 'all') return applications;
        return applications.filter((app: ChallengeApplicationDTO) => app.challenge.toString() === selectedChallengeFilter);
    }, [applications, selectedChallengeFilter]);

    if (isLoadingChallenges || isLoadingApplications) {
        return <div className="incubator-challenges-loading"><Spinner variant="primary" size="lg" /></div>;
    }

    return (
        <div className="incubator-challenges-container">
            <div className="incubator-challenges-header">
                <div>
                    <h1 className="incubator-challenges-title">{t('challenges')}</h1>
                    <p className="incubator-challenges-subtitle">{t('manage_challenges_and_applications')}</p>
                </div>
                <Button variant="primary" onClick={openCreateChallengeModal}>
                    <FiPlus size={18} style={{ marginRight: '0.5rem' }} />
                    {t('create_new_challenge')}
                </Button>
            </div>

            {/* Tabs */}
            <div className="incubator-challenges-tabs">
                <button
                    className={`incubator-challenges-tab ${activeTab === 'challenges' ? 'active' : ''}`}
                    onClick={() => setActiveTab('challenges')}
                >
                    {t('my_challenges')}
                </button>
                <button
                    className={`incubator-challenges-tab ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    {t('applications')}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'challenges' ? (
                <div className="incubator-challenges-grid">
                    {challenges && challenges.length > 0 ? (
                        challenges.map((challenge: ChallengeDTO) => (
                            <ChallengeCard
                                key={challenge.id}
                                avatar={challenge.title.charAt(0)}
                                avatarColor="#4f46e5"
                                title={challenge.title}
                                source={challenge.subtitle || ''}
                                description={challenge.description}
                                technologies={challenge.required_technologies.split(',').map((t: string) => t.trim())}
                                offerAmount={challenge.budget ? `$${parseFloat(challenge.budget.toString()).toLocaleString()}` : 'N/A'}
                                coordinator={t('incubator')} // Placeholder
                                deadline={challenge.deadline || 'N/A'}
                                applicationsCount={challenge.applicant_count}
                                status={challenge.status === 'OPEN' ? 'new' : 'none'}
                                primaryButtonText={t('view_details')}
                                secondaryButtonText={t('edit')}
                                onPrimaryClick={() => { }} // Placeholder for view details
                                onSecondaryClick={() => { }} // Placeholder for edit
                            />
                        ))
                    ) : (
                        <div className="incubator-challenges-empty">
                            {t('no_challenges_found')}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {/* Filter */}
                    <div className="incubator-challenges-filter">
                        <FiFilter className="incubator-challenges-filter-icon" />
                        <select
                            className="incubator-challenges-select"
                            value={selectedChallengeFilter}
                            onChange={(e) => setSelectedChallengeFilter(e.target.value)}
                        >
                            <option value="all">{t('all_challenges')}</option>
                            {challenges?.map((c: ChallengeDTO) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="incubator-challenges-grid">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((app: ChallengeApplicationDTO) => {
                                const challenge = challenges?.find((c: ChallengeDTO) => c.id === app.challenge);
                                return (
                                    <ChallengeCard
                                        key={app.id}
                                        avatar={app.startup_name.charAt(0)}
                                        avatarColor="var(--main-secondary)"
                                        title={app.startup_name}
                                        source={`${t('applied_to')}: ${challenge?.title || app.challenge}`}
                                        description={app.text_solution}
                                        technologies={challenge?.required_technologies.split(',').map((t: string) => t.trim()) || []}
                                        offerAmount={challenge?.budget ? `$${parseFloat(challenge.budget.toString()).toLocaleString()}` : 'N/A'}
                                        coordinator={new Date(app.created).toLocaleDateString()}
                                        deadline={challenge?.deadline || 'N/A'}
                                        applicationsCount={1}
                                        status="applied"
                                        primaryButtonText={t('view_details')}
                                        secondaryButtonText={t('contact')}
                                        onPrimaryClick={() => { }} // Placeholder
                                        onSecondaryClick={() => { }} // Placeholder
                                    />
                                );
                            })
                        ) : (
                            <div className="incubator-challenges-empty">
                                {t('no_applications_found')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncubatorChallenges;
