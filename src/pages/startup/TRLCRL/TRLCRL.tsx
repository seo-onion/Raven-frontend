import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReadinessIndicator from '../../../components/dashboard/ReadinessIndicator/ReadinessIndicator';
import { LevelItem, type LevelStatus } from '../../../components/dashboard/LevelItem/LevelItem';
import { useEvidences, useStartupData, useCreateEvidence, useDeleteEvidence } from '../../../hooks/useStartupData'; // Import useStartupData
import './TRLCRL.css';
import Spinner from '@/components/common/Spinner/Spinner';
import type { Evidence } from '@/types/startup';
import toast from 'react-hot-toast';
import { TRL_LEVEL_DESCRIPTIONS, CRL_LEVEL_DESCRIPTIONS } from '@/constants';

interface LevelData {
    level: number;
    title: string;
    description: string;
    status: LevelStatus;
    lastUpdate?: string; // From evidence.updated
    updatedBy?: string; // From evidence.startup.profile.user.email, or just startup name for now
    evidenceId?: number; // Store evidence ID for removal
    evidenceFileUrl?: string; // Store file_url
    evidenceDescription?: string; // Store evidence description
}




// Helper to generate dynamic levels
const generateLevels = (
    type: 'TRL' | 'CRL',
    totalLevels: number,
    currentLevelFromStartupData: number | null, // The current highest level according to backend startup data
    evidences: Evidence[],
    t: (key: string) => string,
    descriptions: ((t: (key: string) => string) => string)[]
): LevelData[] => {
    const levels: LevelData[] = [];
    const declaredLevel = currentLevelFromStartupData || 0; // Use startupData's declared level

    for (let i = 1; i <= totalLevels; i++) {
        const matchingEvidence = evidences.find(e => e.type === type && e.level === i);
        let status: LevelStatus = 'pending';

        if (i <= declaredLevel) {
            // If level is <= declared level, it's considered completed (with or without evidence)
            status = 'completed';
        } else if (i === declaredLevel + 1 && declaredLevel < totalLevels) {
            // The next level after the declared one is 'in-progress'
            status = 'in-progress';
        } else {
            // All other levels are pending
            status = 'pending';
        }

        levels.push({
            level: i,
            title: descriptions[i - 1](t),
            description: t(`${type.toLowerCase()}_level_${i}_description`),
            status: status,
            lastUpdate: matchingEvidence ? new Date(matchingEvidence.updated).toLocaleDateString() : undefined,
            updatedBy: matchingEvidence ? matchingEvidence.reviewer_notes || t('system') : undefined,
            evidenceId: matchingEvidence?.id,
            evidenceFileUrl: matchingEvidence?.file_url,
            evidenceDescription: matchingEvidence?.description,
        });
    }

    return levels;
};


const TRLCRL: React.FC = () => {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState<'trl' | 'crl'>('trl');
    const [openLevelIndex, setOpenLevelIndex] = useState<number | null>(null);

    // Fetch startup data and evidences
    const { data: startupData, isLoading: isLoadingStartup } = useStartupData();
    const { data: evidences, isLoading: isLoadingEvidences } = useEvidences();

    // Mutation hooks for evidence
    const createEvidenceMutation = useCreateEvidence();
    const deleteEvidenceMutation = useDeleteEvidence();

    const isLoading = isLoadingStartup || isLoadingEvidences || createEvidenceMutation.isPending || deleteEvidenceMutation.isPending;
    const error = !startupData || !evidences; // More robust error handling needed

    const currentTRLLevelFromStartup = startupData?.current_trl || 0;
    const currentCRLLevelFromStartup = startupData?.current_crl || 0;

    // Calculate currentHighestCompletedLevel based on APPROVED evidences
    const currentHighestCompletedTRL = Math.max(0, ...(evidences || []).filter(e => e.type === 'TRL' && e.status === 'APPROVED').map(e => e.level));
    const currentHighestCompletedCRL = Math.max(0, ...(evidences || []).filter(e => e.type === 'CRL' && e.status === 'APPROVED').map(e => e.level));

    const currentHighestCompletedLevel = activeTab === 'trl' ? currentHighestCompletedTRL : currentHighestCompletedCRL;


    const handleAddEvidence = async (level: number, type: 'TRL' | 'CRL', description: string, fileUrl: string, evidenceId?: number) => {
        console.log('TRLCRL: Received description from LevelItem:', description);
        console.log('TRLCRL: Received fileUrl from LevelItem:', fileUrl);
        try {
            const evidenceData = {
                type,
                level,
                description,
                file_url: fileUrl
            };
            await createEvidenceMutation.mutateAsync({ evidenceData, evidenceId });
            toast.success(t('evidence_added_successfully'));
            setOpenLevelIndex(null); // Close the item after adding
        } catch (err) {
            toast.error(t('error_adding_evidence'));
            console.error('Error adding evidence:', err);
        }
    };

    const handleRemoveEvidence = async (evidenceId: number) => {
        try {
            await deleteEvidenceMutation.mutateAsync(evidenceId);
            toast.success(t('evidence_removed_successfully'));
        } catch (err) {
            toast.error(t('error_removing_evidence'));
            console.error('Error removing evidence:', err);
        }
    };


    const trlLevels = generateLevels(
        'TRL',
        9,
        currentTRLLevelFromStartup, // Pass current level from startup data
        evidences || [],
        t,
        TRL_LEVEL_DESCRIPTIONS
    );

    const crlLevels = generateLevels(
        'CRL',
        6, // Assuming CRL has 6 levels based on previous hardcoded data
        currentCRLLevelFromStartup, // Pass current level from startup data
        evidences || [],
        t,
        CRL_LEVEL_DESCRIPTIONS
    );

    const currentLevels = activeTab === 'trl' ? trlLevels : crlLevels;

    if (isLoading) {
        return (
            <div className="trl-crl-loading">
                <Spinner variant="primary" size="lg" />
                <p>{t('loading_data')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="trl-crl-error">
                <p>{t('error_loading_trl_crl')}</p>
            </div>
        );
    }

    return (
        <div className="trl-crl-container">
            <h1 className="trl-crl-main-title">
                {t('trl_crl_maturity_levels')}
            </h1>
            <p className="trl-crl-subtitle">
                {t('manage_tech_commercial_evidence')}
            </p>

            {/* Readiness Indicators Grid */}
            <div className="trl-crl-indicators-grid">
                <ReadinessIndicator
                    type="TRL"
                    currentLevel={currentTRLLevelFromStartup}
                    totalLevels={9}
                    label={t('technology_readiness_level')}
                />
                <ReadinessIndicator
                    type="CRL"
                    currentLevel={currentCRLLevelFromStartup}
                    totalLevels={6} // Assuming CRL has 6 levels
                    label={t('commercial_readiness_level')}
                />
            </div>

            {/* Tabs */}
            <div className="trl-crl-tabs">
                <button
                    className={`trl-crl-tab-btn ${activeTab === 'trl' ? 'trl-crl-tab-active' : ''}`}
                    onClick={() => setActiveTab('trl')}
                >
                    {t('trl_technology_readiness')}
                </button>
                <button
                    className={`trl-crl-tab-btn ${activeTab === 'crl' ? 'trl-crl-tab-active' : ''}`}
                    onClick={() => setActiveTab('crl')}
                >
                    {t('crl_commercial_readiness')}
                </button>
            </div>

            {/* Levels List */}
            <div className="trl-crl-levels-list">
                {currentLevels.map((levelItem) => (
                    <LevelItem
                        key={levelItem.level}
                        level={levelItem.level}
                        title={levelItem.title}
                        description={levelItem.description}
                        status={levelItem.status}
                        lastUpdate={levelItem.lastUpdate}
                        updatedBy={levelItem.updatedBy}
                        evidenceFileUrl={levelItem.evidenceFileUrl}
                        evidenceDescription={levelItem.evidenceDescription}
                        evidenceId={levelItem.evidenceId}
                        isOpen={openLevelIndex === levelItem.level} // Use level for open/close state
                        onToggle={() => setOpenLevelIndex(openLevelIndex === levelItem.level ? null : levelItem.level)}
                        currentHighestCompletedLevel={currentHighestCompletedLevel} // Pass the new prop
                        type={activeTab.toUpperCase() as 'TRL' | 'CRL'}
                        onAddEvidence={handleAddEvidence}
                        onRemoveEvidence={handleRemoveEvidence}
                    />
                ))}
            </div>
        </div>
    );
};

export default TRLCRL;
