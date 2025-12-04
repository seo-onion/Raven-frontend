import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useIncubatorInvestments, useCommitInvestment } from '@/hooks/useIncubatorData';
import MetricCard from '@/components/dashboard/MetricCard/MetricCard';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import toast from 'react-hot-toast';
import { FiDollarSign, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';
import useModalStore from '@/stores/ModalStore';
import ConfirmCommitModal from '@/modals/ConfirmCommitModal/ConfirmCommitModal';
import './Finanzas.css'; // Reusing styles from Startup Finanzas if compatible, or I should create a new one. 
// Assuming I can reuse some styles or I'll add inline styles for now to be safe.

const IncubatorFinanzas: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: investments, isLoading } = useIncubatorInvestments();
    const { mutate: commit, isPending: isCommitting } = useCommitInvestment();

    const metrics = useMemo(() => {
        if (!investments || !Array.isArray(investments)) return [];

        const totalInvestments = investments.length;
        const totalAmount = investments.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0);
        const committedInvestments = investments.filter((inv: any) => inv.status === 'COMMITTED');
        const committedAmount = committedInvestments.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0);
        const pendingInvestments = investments.filter((inv: any) => inv.status !== 'COMMITTED');

        return [
            {
                title: t('total_investments'),
                value: totalInvestments.toString(),
                secondaryValue: t('deals_tracked'),
                trend: 'neutral' as const,
                icon: <FiActivity />
            },
            {
                title: t('total_capital'),
                value: `$${totalAmount.toLocaleString()}`,
                secondaryValue: t('potential_deployment'),
                trend: 'up' as const,
                icon: <FiDollarSign />
            },
            {
                title: t('committed_capital'),
                value: `$${committedAmount.toLocaleString()}`,
                secondaryValue: `${committedInvestments.length} ${t('deals')}`,
                trend: 'up' as const,
                icon: <FiCheckCircle />
            },
            {
                title: t('pending_action'),
                value: pendingInvestments.length.toString(),
                secondaryValue: t('deals_to_review'),
                trend: 'down' as const, // Down is good for pending? Or neutral.
                icon: <FiClock />
            }
        ];
    }, [investments, t]);

    const pendingInvestmentsList = useMemo(() => {
        if (!investments || !Array.isArray(investments)) return [];
        return investments.filter((inv: any) => inv.status !== 'COMMITTED');
    }, [investments]);

    const committedInvestmentsList = useMemo(() => {
        if (!investments || !Array.isArray(investments)) return [];
        return investments.filter((inv: any) => inv.status === 'COMMITTED');
    }, [investments]);


    const { setModalContent } = useModalStore();

    const handleCommit = (id: number) => {
        commit(id, {
            onSuccess: () => {
                toast.success(t('investment_committed_success'));
            },
            onError: () => {
                toast.error(t('error_committing_investment'));
            }
        });
    };

    const openConfirmModal = (investment: any) => {
        setModalContent(
            <ConfirmCommitModal
                investmentId={investment.id}
                startupName={investment.startup_name}
                amount={typeof investment.amount === 'number' ? investment.amount : parseFloat(investment.amount)}
                onConfirm={handleCommit}
            />
        );
    };

    if (isLoading) {
        return <div className="finanzas_loading"><Spinner variant="primary" size="lg" /></div>;
    }

    const getStatusClass = (status: string) => {
        if (status === 'COMMITTED') return 'finanzas_investmentstatus committed';
        if (status === 'REJECTED') return 'finanzas_investmentstatus rejected';
        return 'finanzas_investmentstatus pending';
    };

    const renderInvestmentCard = (investment: any, isPendingSection: boolean) => (
        <div key={investment.id} className="finanzas_investmentcard">
            <div className="finanzas_investmentavatar">
                {investment.logo_url ? (
                    <img src={investment.logo_url} alt={investment.startup_name} />
                ) : (
                    investment.startup_name.charAt(0).toUpperCase()
                )}
            </div>
            <div className="finanzas_investmentcontent">
                <h3 className="finanzas_investmentname">{investment.startup_name}</h3>
                <p className="finanzas_investmentround">{investment.round_name} • Round {investment.round}</p>
            </div>

            <div className="finanzas_investmentdetails">
                <div className="finanzas_investmentdetail">
                    <span className="finanzas_investmentlabel">{t('amount')}</span>
                    <span className="finanzas_investmentvalue">
                        ${typeof investment.amount === 'number'
                            ? investment.amount.toLocaleString()
                            : parseFloat(investment.amount).toLocaleString()}
                    </span>
                </div>

                <div className="finanzas_investmentdetail">
                    <span className="finanzas_investmentlabel">{t('status')}</span>
                    <span className={getStatusClass(investment.status)}>
                        {investment.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {isPendingSection && (
                <div className="finanzas_investmentactions">
                    <Button
                        variant="primary"
                        disabled={isCommitting}
                        onClick={() => openConfirmModal(investment)}
                    >
                        {t('commit_capital')}
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="finanzas-container">
            <div className='finanzas-header-container'>
                <div>
                    <h1 className="finanzas-main-title">
                        {t('incubator_financial_dashboard')}
                    </h1>
                    <p className="finanzas-subtitle">
                        {t('manage_investments_and_deals')}
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="finanzas-metrics-grid">
                {metrics.map((metric, index) => (
                    <MetricCard
                        key={index}
                        title={metric.title}
                        value={metric.value}
                        secondaryValue={metric.secondaryValue}
                        trend={metric.trend}
                    />
                ))}
            </div>

            {/* Pending Investments */}
            <div className="finanzas_section">
                <h2 className="finanzas_sectionheader">{t('pending_investments')}</h2>
                <div className="finanzas_sectionwrapper">
                    <div className="finanzas-list-grid">
                        {pendingInvestmentsList.length > 0 ? (
                            pendingInvestmentsList.map((inv: any) => renderInvestmentCard(inv, true))
                        ) : (
                            <div className="finanzas-empty-state">
                                {t('no_pending_investments')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Committed Investments */}
            <div className="finanzas_section">
                <h2 className="finanzas_sectionheader">{t('committed_investments')}</h2>
                <div className="finanzas_sectionwrapper">
                    <div className="finanzas-list-grid">
                        {committedInvestmentsList.length > 0 ? (
                            committedInvestmentsList.map((inv: any) => renderInvestmentCard(inv, false))
                        ) : (
                            <div className="finanzas-empty-state">
                                {t('no_committed_investments')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncubatorFinanzas;
