import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReadinessIndicator from '../../../components/dashboard/ReadinessIndicator/ReadinessIndicator';
import { LevelItem, type LevelStatus } from '../../../components/dashboard/LevelItem/LevelItem';
import { useEvidences, useStartupData, useCreateEvidence, useDeleteEvidence, useReadinessLevels, useUpdateReadinessLevel } from '../../../hooks/useStartupData'; // Import useStartupData
import useStartupValidation from '@/hooks/useStartupValidation';
import useModalStore from '@/stores/ModalStore';
import AddReadinessLevelModal from '@/modals/AddReadinessLevelModal/AddReadinessLevelModal';
import './TRLCRL.css';
import Spinner from '@/components/common/Spinner/Spinner';
import Button from '@/components/common/Button/Button';
import type { Evidence, ReadinessLevel } from '@/types/startup';
import toast from 'react-hot-toast';

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
    readinessLevelId?: number; // Store readiness level ID for deletion
}


// Helper to generate dynamic levels from ReadinessLevels and Evidence
const generateLevels = (
    type: 'TRL' | 'CRL',
    readinessLevels: ReadinessLevel[],
    evidences: Evidence[]
): LevelData[] => {
    // Filter readiness levels for the given type and sort by level
    const typeReadinessLevels = readinessLevels.filter(rl => rl.type === type).sort((a, b) => a.level - b.level);

    const levels: LevelData[] = [];

    // Process only the readiness levels from the backend
    for (const readinessLevel of typeReadinessLevels) {
        const matchingEvidence = evidences.find(e => e.type === type && e.level === readinessLevel.level);
        let status: LevelStatus = 'pending';

        if (matchingEvidence) {
            switch (matchingEvidence.status) {
                case 'APPROVED':
                    status = 'completed';
                    break;
                case 'PENDING':
                    status = 'in-progress';
                    break;
                case 'REJECTED':
                    status = 'pending';
                    break;
                default:
                    status = 'pending';
            }
        }

        levels.push({
            level: readinessLevel.level,
            title: readinessLevel.title,
            description: readinessLevel.subtitle || '',
            status: status,
            lastUpdate: matchingEvidence ? new Date(matchingEvidence.updated).toLocaleDateString() : undefined,
            updatedBy: matchingEvidence ? matchingEvidence.reviewer_notes || 'Sistema' : undefined,
            evidenceId: matchingEvidence?.id,
            evidenceFileUrl: matchingEvidence?.file_url,
            evidenceDescription: matchingEvidence?.description,
            readinessLevelId: readinessLevel.id,
        });
    }

    return levels;
};


const TRLCRL: React.FC = () => {
    const { t } = useTranslation('common');
    const { setModalContent } = useModalStore();
    const [activeTab, setActiveTab] = useState<'trl' | 'crl'>('trl');
    const [openLevelIndex, setOpenLevelIndex] = useState<number | null>(null);

    // Validate startup has company_name, redirect to wizard if not
    useStartupValidation();

    // Fetch startup data, evidences, and readiness levels
    const { data: startupData, isLoading: isLoadingStartup } = useStartupData();
    const { data: evidences, isLoading: isLoadingEvidences } = useEvidences();
    const { data: readinessLevels, isLoading: isLoadingReadinessLevels } = useReadinessLevels();

    // Mutation hooks for evidence and readiness levels
    const createEvidenceMutation = useCreateEvidence();
    const deleteEvidenceMutation = useDeleteEvidence();
    const updateReadinessLevelMutation = useUpdateReadinessLevel();

    const isLoading = isLoadingStartup || isLoadingEvidences || isLoadingReadinessLevels || createEvidenceMutation.isPending || deleteEvidenceMutation.isPending || updateReadinessLevelMutation.isPending;
    const error = !startupData || !evidences || !readinessLevels; // More robust error handling needed

    // Calculate currentHighestCompletedLevel based on APPROVED evidences
    const currentHighestCompletedTRL = Math.max(0, ...(evidences || []).filter(e => e.type === 'TRL' && e.status === 'APPROVED').map(e => e.level));
    const currentHighestCompletedCRL = Math.max(0, ...(evidences || []).filter(e => e.type === 'CRL' && e.status === 'APPROVED').map(e => e.level));

    const currentHighestCompletedLevel = activeTab === 'trl' ? currentHighestCompletedTRL : currentHighestCompletedCRL;

    // Calculate total created evidences for each type
    const totalCreatedTRL = (evidences || []).filter(e => e.type === 'TRL').length;
    const totalCreatedCRL = (evidences || []).filter(e => e.type === 'CRL').length;

    // Calculate approved evidences for each type
    const approvedTRL = (evidences || []).filter(e => e.type === 'TRL' && e.status === 'APPROVED').length;
    const approvedCRL = (evidences || []).filter(e => e.type === 'CRL' && e.status === 'APPROVED').length;


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

    const handleUpdateLevel = async (readinessLevelId: number, level: number, type: 'TRL' | 'CRL', title: string, subtitle: string) => {
        console.log('Updating level:', { readinessLevelId, level, type, title, subtitle });
        try {
            await updateReadinessLevelMutation.mutateAsync({
                readinessLevelId,
                levelData: {
                    level,
                    type,
                    title,
                    subtitle
                }
            });
            toast.success(t('level_updated_successfully'));
        } catch (err) {
            toast.error(t('error_updating_level'));
            console.error('Error updating level:', err);
        }
    };

    const handleAddReadinessLevel = () => {
        // Calculate the next level based on current levels
        const levelsList = activeTab === 'trl' ? trlLevels : crlLevels;
        const maxLevel = levelsList.length > 0
            ? Math.max(...levelsList.map(l => l.level))
            : 0;
        const nextLevel = maxLevel + 1;

        setModalContent(
            <AddReadinessLevelModal
                type={activeTab.toUpperCase() as 'TRL' | 'CRL'}
                defaultLevel={nextLevel}
                onSuccess={() => {
                    // Modal will close automatically after success
                }}
            />
        );
    };


    const trlLevels = generateLevels(
        'TRL',
        readinessLevels || [],
        evidences || []
    );

    const crlLevels = generateLevels(
        'CRL',
        readinessLevels || [],
        evidences || []
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
                    currentLevel={approvedTRL}
                    totalLevels={totalCreatedTRL}
                    label={t('technology_readiness_level')}
                />
                <ReadinessIndicator
                    type="CRL"
                    currentLevel={approvedCRL}
                    totalLevels={totalCreatedCRL}
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
                        readinessLevelId={levelItem.readinessLevelId}
                        isOpen={openLevelIndex === levelItem.level} // Use level for open/close state
                        onToggle={() => setOpenLevelIndex(openLevelIndex === levelItem.level ? null : levelItem.level)}
                        currentHighestCompletedLevel={currentHighestCompletedLevel} // Pass the new prop
                        type={activeTab.toUpperCase() as 'TRL' | 'CRL'}
                        onAddEvidence={handleAddEvidence}
                        onRemoveEvidence={handleRemoveEvidence}
                        onUpdateLevel={(id, title, subtitle) => handleUpdateLevel(id, levelItem.level, activeTab.toUpperCase() as 'TRL' | 'CRL', title, subtitle)}
                    />
                ))}

                {/* Button to add new ReadinessLevel */}
                <div className="trl-crl-add-level-button">
                    <Button
                        variant="secondary"
                        onClick={handleAddReadinessLevel}
                        disabled={isLoading}
                    >
                        {t('add_readiness_level')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TRLCRL;
