import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBolt, FaPaperPlane, FaDollarSign } from 'react-icons/fa';
import MetricItem from '../../../components/dashboard/MetricItem/MetricItem';
import ChallengeCard from '../../../components/dashboard/ChallengeCard/ChallengeCard';
import useStartupValidation from '@/hooks/useStartupValidation';
import { useChallenges, useChallengeApplications } from '@/hooks/useIncubatorData';
import useModalStore from '@/stores/ModalStore';
import ApplyChallengeModal from '@/modals/ApplyChallengeModal/ApplyChallengeModal';
import ViewProposalModal from '@/modals/ViewProposalModal/ViewProposalModal';
import Spinner from '@/components/common/Spinner/Spinner';
import { type ChallengeDTO, type ChallengeApplicationDTO } from '@/api/incubator';
import './Desafios.css';

const Desafios: React.FC = () => {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState<'all' | 'compatible' | 'my-applications'>('all');
    const { setModalContent } = useModalStore();

    // Validate startup has company_name, redirect to wizard if not
    useStartupValidation();

    const { data: challenges, isLoading: isLoadingChallenges } = useChallenges();
    const { data: applications, isLoading: isLoadingApplications } = useChallengeApplications();

    const appliedChallengeIds = useMemo(() => {
        if (!applications) return new Set<number>();
        return new Set(applications.map((app: ChallengeApplicationDTO) => app.challenge));
    }, [applications]);

    const metrics = useMemo(() => {
        if (!challenges || !applications) return { available: 0, sent: 0, potential: 0 };

        const openChallenges = challenges.filter((c: ChallengeDTO) => c.status === 'OPEN');
        const available = openChallenges.length;
        const sent = applications.length;

        // Calculate potential value from all open challenges (Total Addressable)
        const potential = openChallenges.reduce((sum: number, c: ChallengeDTO) => {
            const budget = c.budget ? parseFloat(c.budget.toString()) : 0;
            return sum + (isNaN(budget) ? 0 : budget);
        }, 0);

        return { available, sent, potential };
    }, [challenges, applications]);

    const filteredChallenges = useMemo(() => {
        if (!challenges) return [];
        if (activeTab === 'my-applications') return []; // Handled separately

        return challenges.filter((c: ChallengeDTO) => {
            if (c.status !== 'OPEN') return false;

            // User requirement: If applied, do not show in 'all' or 'compatible'
            if (appliedChallengeIds.has(c.id)) return false;

            if (activeTab === 'compatible') {
                // Filter out already applied challenges for "compatible" view (as a simple logic)
                return !appliedChallengeIds.has(c.id);
            }
            return true;
        });
    }, [challenges, activeTab, appliedChallengeIds]);

    const myApplicationsList = useMemo(() => {
        if (!applications || !challenges) return [];
        return applications.map((app: ChallengeApplicationDTO) => {
            const challenge = challenges.find((c: ChallengeDTO) => c.id === app.challenge);
            return {
                ...app,
                challengeDetails: challenge
            };
        });
    }, [applications, challenges]);

    const handleApply = (challenge: ChallengeDTO) => {
        setModalContent(
            <ApplyChallengeModal
                challengeId={challenge.id}
                challengeTitle={challenge.title}
            />
        );
    };

    const handleViewProposal = (app: ChallengeApplicationDTO, challenge?: ChallengeDTO) => {
        setModalContent(
            <ViewProposalModal
                application={app}
                challenge={challenge}
            />
        );
    };

    if (isLoadingChallenges || isLoadingApplications) {
        return <div className="flex justify-center items-center h-64"><Spinner variant="primary" size="lg" /></div>;
    }

    return (
        <div className="desafios-container">
            {/* Header */}
            <div className="desafios-header">
                <h1 className="desafios-main-title">
                    {t('challenges_marketplace')}
                </h1>
            </div>

            {/* Metrics Grid */}
            <div className="desafios-metrics-grid">
                <MetricItem
                    icon={<FaBolt style={{ color: 'var(--main-secondary)' }} />}
                    label={t('available_challenges')}
                    value={metrics.available.toString()}
                    valueColor="var(--main-secondary)"
                    iconBgColor="#f3e8ff"
                />
                <MetricItem
                    icon={<FaPaperPlane style={{ color: 'var(--main-secondary)' }} />}
                    label={t('applications_sent')}
                    value={metrics.sent.toString()}
                    valueColor="var(--main-secondary)"
                    iconBgColor="#f3e8ff"
                />
                <MetricItem
                    icon={<FaDollarSign style={{ color: '#10b981' }} />}
                    label={t('potential_value')}
                    value={`$${metrics.potential.toLocaleString()}`}
                    valueColor="#10b981"
                    iconBgColor="#d1fae5"
                />
            </div>

            {/* Tabs */}
            <div className="desafios-tabs">
                <button
                    className={`desafios-tab ${activeTab === 'all' ? 'desafios-tab-active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    {t('all_challenges')}
                </button>
                <button
                    className={`desafios-tab ${activeTab === 'compatible' ? 'desafios-tab-active' : ''}`}
                    onClick={() => setActiveTab('compatible')}
                >
                    {t('compatible_challenges')}
                </button>
                <button
                    className={`desafios-tab ${activeTab === 'my-applications' ? 'desafios-tab-active' : ''}`}
                    onClick={() => setActiveTab('my-applications')}
                >
                    {t('my_applications')}
                </button>
            </div>

            {/* Challenges List */}
            <div className="desafios-list">
                {activeTab === 'my-applications' ? (
                    myApplicationsList.length > 0 ? (
                        myApplicationsList.map((app: ChallengeApplicationDTO & { challengeDetails?: ChallengeDTO }) => (
                            <ChallengeCard
                                key={app.id}
                                avatar={app.challengeDetails?.title.charAt(0) || 'C'}
                                avatarColor="var(--main-secondary)"
                                title={app.challengeDetails?.title || t('unknown_challenge')}
                                source={t('applied_on') + ': ' + new Date(app.created).toLocaleDateString()}
                                description={app.text_solution}
                                technologies={app.challengeDetails?.required_technologies.split(',').map((t: string) => t.trim()) || []}
                                offerAmount={app.challengeDetails?.budget ? `$${parseFloat(app.challengeDetails.budget.toString()).toLocaleString()}` : 'N/A'}
                                coordinator={t('pending_review')} // Placeholder
                                deadline={app.challengeDetails?.deadline || 'N/A'}
                                applicationsCount={app.challengeDetails?.applicant_count || 0}
                                status="applied"
                                primaryButtonText={t('view_my_proposal')}
                                secondaryButtonText=""
                                onPrimaryClick={() => handleViewProposal(app, app.challengeDetails)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 w-full">
                            {t('no_applications_found')}
                        </div>
                    )
                ) : (
                    filteredChallenges.length > 0 ? (
                        filteredChallenges.map((challenge: ChallengeDTO) => {
                            return (
                                <ChallengeCard
                                    key={challenge.id}
                                    avatar={challenge.title.charAt(0)}
                                    avatarColor="#4f46e5"
                                    title={challenge.title}
                                    source={challenge.subtitle || ''}
                                    description={challenge.description}
                                    technologies={challenge.required_technologies.split(',').map((t: string) => t.trim())}
                                    offerAmount={challenge.budget ? `$${parseFloat(challenge.budget.toString()).toLocaleString()}` : 'N/A'}
                                    coordinator={t('incubator')} // We don't have incubator name in ChallengeDTO yet, maybe add it later
                                    deadline={challenge.deadline || 'N/A'}
                                    applicationsCount={challenge.applicant_count}
                                    status="none"
                                    primaryButtonText={t('apply_challenge')}
                                    secondaryButtonText={t('view_details')}
                                    onPrimaryClick={() => handleApply(challenge)}
                                />
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 w-full">
                            {t('no_challenges_found')}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Desafios;
