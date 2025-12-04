import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useChallenges, useChallengeApplications } from '@/hooks/useIncubatorData';
import { type ChallengeDTO, type ChallengeApplicationDTO } from '@/api/incubator';


import ChallengeCard from '@/components/dashboard/ChallengeCard/ChallengeCard';
import Spinner from '@/components/common/Spinner/Spinner';
import useModalStore from '@/stores/ModalStore';
import CreateChallengeModal from '@/modals/CreateChallengeModal/CreateChallengeModal';
import CreateChallengeSection from '@/components/dashboard/CreateChallengeSection/CreateChallengeSection';
import { FiFilter } from 'react-icons/fi';
import './Challenges.css';

const IncubatorChallenges: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: challenges, isLoading: isLoadingChallenges } = useChallenges();
    const { data: applications, isLoading: isLoadingApplications } = useChallengeApplications();
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
        return <div className="flex justify-center items-center h-64"><Spinner variant="primary" size="lg" /></div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-black">{t('challenges')}</h1>
                    <p className="text-gray-500">{t('manage_challenges_and_applications')}</p>
                </div>
                <CreateChallengeSection onCreateClick={openCreateChallengeModal} />
            </div>

            {/* Tabs */}
            <div className="desafios-tabs">
                <button
                    className={`desafios-tab ${activeTab === 'challenges' ? 'desafios-tab-active' : ''}`}
                    onClick={() => setActiveTab('challenges')}
                >
                    {t('my_challenges')}
                </button>
                <button
                    className={`desafios-tab ${activeTab === 'applications' ? 'desafios-tab-active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    {t('applications')}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'challenges' ? (
                <div className="grid grid-cols-1 gap-4">
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
                        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                            {t('no_challenges_found')}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {/* Filter */}
                    <div className="flex items-center gap-2 mb-4">
                        <FiFilter className="text-gray-500" />
                        <select
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedChallengeFilter}
                            onChange={(e) => setSelectedChallengeFilter(e.target.value)}
                        >
                            <option value="all">{t('all_challenges')}</option>
                            {challenges?.map((c: ChallengeDTO) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
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
                            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
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
