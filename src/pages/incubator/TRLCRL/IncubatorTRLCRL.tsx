import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Spinner from '@/components/common/Spinner/Spinner';
import Button from '@/components/common/Button/Button';
import { fetchPortfolioEvidences, reviewEvidence, type PortfolioEvidenceDTO, type ReviewEvidenceRequest } from '@/api/incubator';
import { FiCheck, FiX, FiArrowLeft, FiFileText, FiExternalLink, FiFilter, FiClock, FiCheckCircle, FiXCircle, FiClipboard, FiRotateCcw } from 'react-icons/fi';
import { GoBeaker } from 'react-icons/go';
import { TbChartLine } from 'react-icons/tb';
import './IncubatorTRLCRL.css';

// ============================================================================
// Evidence Review Detail View
// ============================================================================
interface EvidenceReviewViewProps {
    startupName: string;
    evidences: PortfolioEvidenceDTO[];
    onBack: () => void;
}

const EvidenceReviewView: React.FC<EvidenceReviewViewProps> = ({ startupName, evidences, onBack }) => {
    const { t } = useTranslation('common');
    const queryClient = useQueryClient();
    const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});
    const [reviewingEvidence, setReviewingEvidence] = useState<{ id: number; action: 'approve' | 'reject' | 'reset' } | null>(null);

    // Mutation for reviewing evidence
    const reviewMutation = useMutation({
        mutationFn: ({ evidenceId, data }: { evidenceId: number; data: ReviewEvidenceRequest }) =>
            reviewEvidence(evidenceId, data),
        onSuccess: (_, variables) => {
            const action = variables.data.status === 'APPROVED' ? 'aprobada' : 'rechazada';
            toast.success(`Evidencia ${action} exitosamente`);
            queryClient.invalidateQueries({ queryKey: ['incubator-portfolio-evidences'] });
            setReviewingEvidence(null);
        },
        onError: () => {
            toast.error(t('error_reviewing_evidence') || 'Error al revisar la evidencia');
            setReviewingEvidence(null);
        }
    });

    const handleApprove = (evidenceId: number) => {
        setReviewingEvidence({ id: evidenceId, action: 'approve' });
        reviewMutation.mutate({
            evidenceId,
            data: {
                status: 'APPROVED',
                reviewer_notes: reviewNotes[evidenceId] || undefined
            }
        });
    };

    const handleReject = (evidenceId: number) => {
        if (!reviewNotes[evidenceId]) {
            toast.error(t('rejection_requires_notes') || 'Por favor, proporciona una nota explicando el rechazo');
            return;
        }
        setReviewingEvidence({ id: evidenceId, action: 'reject' });
        reviewMutation.mutate({
            evidenceId,
            data: {
                status: 'REJECTED',
                reviewer_notes: reviewNotes[evidenceId]
            }
        });
    };

    const handleReset = (evidenceId: number) => {
        setReviewingEvidence({ id: evidenceId, action: 'reset' });
        reviewMutation.mutate({
            evidenceId,
            data: {
                status: 'PENDING',
                reviewer_notes: undefined
            }
        });
    };

    // Group evidences by type
    const trlEvidences = evidences.filter(e => e.type === 'TRL');
    const crlEvidences = evidences.filter(e => e.type === 'CRL');

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'incubatortrlcrl_status approved';
            case 'REJECTED': return 'incubatortrlcrl_status rejected';
            default: return 'incubatortrlcrl_status pending';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'APPROVED': return t('approved') || 'Aprobado';
            case 'REJECTED': return t('rejected') || 'Rechazado';
            default: return t('pending') || 'Pendiente';
        }
    };

    const renderEvidenceList = (list: PortfolioEvidenceDTO[], type: string) => {
        if (list.length === 0) {
            return (
                <div className="incubatortrlcrl_emptylist">
                    {t('no_evidences_type') || `No hay evidencias de ${type}`}
                </div>
            );
        }

        return list.map(evidence => (
            <div key={evidence.id} className="incubatortrlcrl_evidencecard">
                <div className="incubatortrlcrl_evidenceheader">
                    <div className="incubatortrlcrl_evidencelevel">
                        <span className="incubatortrlcrl_leveltype">{evidence.type}</span>
                        <span className="incubatortrlcrl_levelnumber">{evidence.level}</span>
                    </div>
                    <span className={getStatusBadgeClass(evidence.status)}>
                        {getStatusLabel(evidence.status)}
                    </span>
                </div>

                <div className="incubatortrlcrl_evidencebody">
                    {evidence.description && (
                        <p className="incubatortrlcrl_description">{evidence.description}</p>
                    )}

                    {evidence.file_url && (
                        <a
                            href={evidence.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="incubatortrlcrl_filelink"
                        >
                            <FiExternalLink size={14} />
                            {t('view_file') || 'Ver archivo'}
                        </a>
                    )}

                    <div className="incubatortrlcrl_meta">
                        <span>{t('submitted') || 'Enviado'}: {new Date(evidence.created).toLocaleDateString()}</span>
                    </div>

                    {evidence.reviewer_notes && (
                        <div className="incubatortrlcrl_reviewernotes">
                            <strong>{t('reviewer_notes') || 'Notas del revisor'}:</strong> {evidence.reviewer_notes}
                        </div>
                    )}
                </div>

                {/* Review Actions - Only show for PENDING evidences */}
                {evidence.status === 'PENDING' && (
                    <div className="incubatortrlcrl_reviewactions">
                        <textarea
                            placeholder={t('review_notes_placeholder') || 'Notas de revisión (requerido para rechazar)...'}
                            value={reviewNotes[evidence.id] || ''}
                            onChange={(e) => setReviewNotes(prev => ({ ...prev, [evidence.id]: e.target.value }))}
                            className="incubatortrlcrl_notesarea"
                        />
                        <div className="incubatortrlcrl_actionbuttons">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApprove(evidence.id)}
                                disabled={reviewMutation.isPending}
                                className="incubatortrlcrl_approvebtn"
                            >
                                {reviewingEvidence?.id === evidence.id && reviewingEvidence?.action === 'approve' ? (
                                    <>
                                        <Spinner variant="secondary" size="sm" />
                                        {t('approving') || 'Aprobando...'}
                                    </>
                                ) : (
                                    <>
                                        <FiCheck size={16} />
                                        {t('approve') || 'Aprobar'}
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleReject(evidence.id)}
                                disabled={reviewMutation.isPending}
                                className="incubatortrlcrl_rejectbtn"
                            >
                                {reviewingEvidence?.id === evidence.id && reviewingEvidence?.action === 'reject' ? (
                                    <>
                                        <Spinner variant="primary" size="sm" />
                                        {t('rejecting') || 'Rechazando...'}
                                    </>
                                ) : (
                                    <>
                                        <FiX size={16} />
                                        {t('reject') || 'Rechazar'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Reset to Pending - Show for APPROVED or REJECTED evidences */}
                {(evidence.status === 'APPROVED' || evidence.status === 'REJECTED') && (
                    <div className="incubatortrlcrl_reviewactions incubatortrlcrl_resetactions">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleReset(evidence.id)}
                            disabled={reviewMutation.isPending}
                            className="incubatortrlcrl_resetbtn"
                        >
                            {reviewingEvidence?.id === evidence.id && reviewingEvidence?.action === 'reset' ? (
                                <>
                                    <Spinner variant="primary" size="sm" />
                                    {t('resetting') || 'Restableciendo...'}
                                </>
                            ) : (
                                <>
                                    <FiRotateCcw size={16} />
                                    {t('reset_to_pending') || 'Restablecer a Pendiente'}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="incubatortrlcrl_container">
            {/* Header with Back Button */}
            <div className="incubatortrlcrl_detailheader">
                <Button variant="secondary" size="sm" onClick={onBack} className="incubatortrlcrl_backbtn">
                    <FiArrowLeft size={18} />
                    {t('back') || 'Volver'}
                </Button>
                <div>
                    <h1 className="incubatortrlcrl_title">{startupName}</h1>
                    <p className="incubatortrlcrl_subtitle">{t('evidence_review') || 'Revisión de Evidencias TRL/CRL'}</p>
                </div>
            </div>

            {/* Evidence Sections */}
            <div className="incubatortrlcrl_sections">
                {/* TRL Section */}
                <div className="incubatortrlcrl_section">
                    <div className="incubatortrlcrl_sectionheader">
                        <h2>
                            <span className="incubatortrlcrl_sectionicon trl"><GoBeaker size={20} /></span>
                            TRL - Technology Readiness Level
                        </h2>
                        <span className="incubatortrlcrl_sectioncount">{trlEvidences.length} {t('evidences') || 'evidencias'}</span>
                    </div>
                    <div className="incubatortrlcrl_evidencelist">
                        {renderEvidenceList(trlEvidences, 'TRL')}
                    </div>
                </div>

                {/* CRL Section */}
                <div className="incubatortrlcrl_section">
                    <div className="incubatortrlcrl_sectionheader">
                        <h2>
                            <span className="incubatortrlcrl_sectionicon crl"><TbChartLine size={20} /></span>
                            CRL - Commercial Readiness Level
                        </h2>
                        <span className="incubatortrlcrl_sectioncount">{crlEvidences.length} {t('evidences') || 'evidencias'}</span>
                    </div>
                    <div className="incubatortrlcrl_evidencelist">
                        {renderEvidenceList(crlEvidences, 'CRL')}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Main Incubator TRL/CRL Component
// ============================================================================
interface SelectedStartup {
    id: number;
    name: string;
}

type FilterStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

const IncubatorTRLCRL: React.FC = () => {
    const { t } = useTranslation('common');
    const [selectedStartup, setSelectedStartup] = useState<SelectedStartup | null>(null);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');

    // Fetch portfolio evidences
    const { data: allEvidences, isLoading, error } = useQuery({
        queryKey: ['incubator-portfolio-evidences'],
        queryFn: fetchPortfolioEvidences,
    });

    // Group evidences by startup
    const groupedEvidences = useMemo(() => {
        if (!allEvidences) return {};

        const grouped: Record<number, {
            startupId: number;
            startupName: string;
            logoUrl: string | null;
            evidences: PortfolioEvidenceDTO[];
            pendingCount: number;
            approvedCount: number;
            rejectedCount: number;
        }> = {};

        allEvidences.forEach(evidence => {
            if (!grouped[evidence.startup_id]) {
                grouped[evidence.startup_id] = {
                    startupId: evidence.startup_id,
                    startupName: evidence.startup_name,
                    logoUrl: evidence.logo_url,
                    evidences: [],
                    pendingCount: 0,
                    approvedCount: 0,
                    rejectedCount: 0,
                };
            }
            grouped[evidence.startup_id].evidences.push(evidence);

            if (evidence.status === 'PENDING') grouped[evidence.startup_id].pendingCount++;
            else if (evidence.status === 'APPROVED') grouped[evidence.startup_id].approvedCount++;
            else if (evidence.status === 'REJECTED') grouped[evidence.startup_id].rejectedCount++;
        });

        return grouped;
    }, [allEvidences]);

    // Filter startups based on status filter
    const filteredStartups = useMemo(() => {
        const startups = Object.values(groupedEvidences);

        if (filterStatus === 'ALL') return startups;

        return startups.filter(startup => {
            if (filterStatus === 'PENDING') return startup.pendingCount > 0;
            if (filterStatus === 'APPROVED') return startup.approvedCount > 0;
            if (filterStatus === 'REJECTED') return startup.rejectedCount > 0;
            return true;
        });
    }, [groupedEvidences, filterStatus]);

    // Stats
    const stats = useMemo(() => {
        if (!allEvidences) return { total: 0, pending: 0, approved: 0, rejected: 0 };

        return {
            total: allEvidences.length,
            pending: allEvidences.filter(e => e.status === 'PENDING').length,
            approved: allEvidences.filter(e => e.status === 'APPROVED').length,
            rejected: allEvidences.filter(e => e.status === 'REJECTED').length,
        };
    }, [allEvidences]);

    const handleViewStartup = (startupId: number, startupName: string) => {
        setSelectedStartup({ id: startupId, name: startupName });
    };

    const handleBack = () => {
        setSelectedStartup(null);
    };

    // If viewing a specific startup
    if (selectedStartup && groupedEvidences[selectedStartup.id]) {
        return (
            <EvidenceReviewView
                startupName={selectedStartup.name}
                evidences={groupedEvidences[selectedStartup.id].evidences}
                onBack={handleBack}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="incubatortrlcrl_container">
                <div className="incubatortrlcrl_loading">
                    <Spinner variant="primary" size="lg" />
                    <p>{t('loading') || 'Cargando evidencias...'}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="incubatortrlcrl_container">
                <div className="incubatortrlcrl_error">
                    <h2>{t('error_loading_data') || 'Error al cargar datos'}</h2>
                    <p>{t('try_again_later') || 'Intenta de nuevo más tarde'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="incubatortrlcrl_container">
            {/* Header */}
            <div className="incubatortrlcrl_header">
                <div>
                    <h1 className="incubatortrlcrl_title">
                        {t('trl_crl_review') || 'Revisión TRL/CRL'}
                    </h1>
                    <p className="incubatortrlcrl_subtitle">
                        {t('trl_crl_review_description') || 'Revisa y valida las evidencias de madurez tecnológica y comercial de tu portafolio'}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="incubatortrlcrl_statsgrid">
                <div className="incubatortrlcrl_statcard">
                    <span className="incubatortrlcrl_staticon"><FiClipboard size={24} /></span>
                    <div>
                        <span className="incubatortrlcrl_statvalue">{stats.total}</span>
                        <span className="incubatortrlcrl_statlabel">{t('total_evidences') || 'Total Evidencias'}</span>
                    </div>
                </div>
                <div className="incubatortrlcrl_statcard pending">
                    <span className="incubatortrlcrl_staticon"><FiClock size={24} /></span>
                    <div>
                        <span className="incubatortrlcrl_statvalue">{stats.pending}</span>
                        <span className="incubatortrlcrl_statlabel">{t('pending_review') || 'Pendientes'}</span>
                    </div>
                </div>
                <div className="incubatortrlcrl_statcard approved">
                    <span className="incubatortrlcrl_staticon"><FiCheckCircle size={24} /></span>
                    <div>
                        <span className="incubatortrlcrl_statvalue">{stats.approved}</span>
                        <span className="incubatortrlcrl_statlabel">{t('approved') || 'Aprobadas'}</span>
                    </div>
                </div>
                <div className="incubatortrlcrl_statcard rejected">
                    <span className="incubatortrlcrl_staticon"><FiXCircle size={24} /></span>
                    <div>
                        <span className="incubatortrlcrl_statvalue">{stats.rejected}</span>
                        <span className="incubatortrlcrl_statlabel">{t('rejected') || 'Rechazadas'}</span>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="incubatortrlcrl_filterbar">
                <FiFilter size={16} />
                <span>{t('filter_by') || 'Filtrar por'}:</span>
                <div className="incubatortrlcrl_filterbuttons">
                    {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as FilterStatus[]).map(status => (
                        <button
                            key={status}
                            className={`incubatortrlcrl_filterbtn ${filterStatus === status ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === 'ALL' && (t('all') || 'Todos')}
                            {status === 'PENDING' && (t('pending') || 'Pendientes')}
                            {status === 'APPROVED' && (t('approved') || 'Aprobados')}
                            {status === 'REJECTED' && (t('rejected') || 'Rechazados')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Startups List */}
            <div className="incubatortrlcrl_startupslist">
                {filteredStartups.length === 0 ? (
                    <div className="incubatortrlcrl_empty">
                        <FiFileText size={48} />
                        <h3>{t('no_evidences') || 'No hay evidencias'}</h3>
                        <p>{t('no_evidences_description') || 'Las startups de tu portafolio no han enviado evidencias aún.'}</p>
                    </div>
                ) : (
                    filteredStartups.map(startup => (
                        <div key={startup.startupId} className="incubatortrlcrl_startupcard">
                            <div className="incubatortrlcrl_startupinfo">
                                <div className="incubatortrlcrl_startuplogo">
                                    {startup.logoUrl ? (
                                        <img src={startup.logoUrl} alt={startup.startupName} />
                                    ) : (
                                        <span>{startup.startupName.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="incubatortrlcrl_startupname">{startup.startupName}</h3>
                                    <p className="incubatortrlcrl_startupstats">
                                        {startup.evidences.length} {t('evidences') || 'evidencias'}
                                    </p>
                                </div>
                            </div>

                            <div className="incubatortrlcrl_startupcounts">
                                {startup.pendingCount > 0 && (
                                    <span className="incubatortrlcrl_countbadge pending">
                                        <FiClock size={12} /> {startup.pendingCount}
                                    </span>
                                )}
                                {startup.approvedCount > 0 && (
                                    <span className="incubatortrlcrl_countbadge approved">
                                        <FiCheckCircle size={12} /> {startup.approvedCount}
                                    </span>
                                )}
                                {startup.rejectedCount > 0 && (
                                    <span className="incubatortrlcrl_countbadge rejected">
                                        <FiXCircle size={12} /> {startup.rejectedCount}
                                    </span>
                                )}
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleViewStartup(startup.startupId, startup.startupName)}
                                className="incubatortrlcrl_viewbtn"
                            >
                                {t('review') || 'Revisar'}
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default IncubatorTRLCRL;
