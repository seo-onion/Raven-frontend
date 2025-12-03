import React from 'react';
import { useTranslation } from 'react-i18next';
import CrowdfundingBar from '../../../components/dashboard/CrowdfundingBar/CrowdfundingBar';
import FundingRoundCard from '../../../components/dashboard/FundingRoundCard/FundingRoundCard';
import InvestorPipelineCard from '../../../components/dashboard/InvestorPipelineCard/InvestorPipelineCard';
import { useInvestors, useInvestmentRounds } from '../../../hooks/useStartupData';
import Button from '@/components/common/Button/Button';
import useModalStore from '@/stores/ModalStore';
import NewRoundModal from '@/modals/NewRoundModal/NewRoundModal';
import NewInvestorModal from '@/modals/NewInvestorModal/NewInvestorModal';
import './Inversores.css';

// Definir el tipo para el stage del pipeline
type PipelineStage = 'in-progress' | 'active' | 'discarded';

const Inversores: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: investors, isLoading: isLoadingInvestors, error: errorInvestors } = useInvestors();
    const { data: rounds, isLoading: isLoadingRounds, error: errorRounds } = useInvestmentRounds();
    const { setModalContent } = useModalStore();

    const handleNewRound = () => {
        setModalContent(<NewRoundModal />);
    };

    const handleNewInvestor = (roundId: number) => {
        setModalContent(<NewInvestorModal roundId={roundId} />);
    };

    const totalGoal = rounds?.reduce((acc, round) => acc + round.target, 0) || 0;
    const totalCurrent = rounds?.reduce((acc, round) => acc + round.investors.reduce((iAcc, i) => iAcc + i.amount, 0), 0) || 0;
    const totalPercentage = totalGoal > 0 ? (totalCurrent / totalGoal) * 100 : 0;

    return (
        <div className="inversores-container">
            {/* Header */}
            <div className="inversores-header">
                <div className="inversores-title-group">
                    <h1 className="inversores-main-title">
                        {t('investments')}
                    </h1>
                    <p className="inversores-subtitle">
                        {t('funding_rounds_classification')}
                    </p>
                </div>
                <Button variant="primary" onClick={handleNewRound}>
                    + {t('new_round')}
                </Button>
            </div>

            {/* Crowdfunding Bar */}
            <CrowdfundingBar
                goal={`$${totalGoal.toLocaleString()}`}
                current={`$${totalCurrent.toLocaleString()}`}
                percentage={totalPercentage}
            />

            {/* Funding Rounds */}
            <div className="inversores-section">
                <h2 className="inversores-section-title">
                    {t('funding_rounds')}
                </h2>

                {isLoadingRounds && <p className="text-black">{t('loading')}</p>}
                {errorRounds && <p className="text-black">{t('error')}: {(errorRounds as Error).message}</p>}
                {rounds?.map((round) => {
                    const roundCurrent = round.investors.reduce((acc, investor) => acc + investor.amount, 0);
                    const roundPercentage = round.target > 0 ? (roundCurrent / round.target) * 100 : 0;
                    return (
                        <div key={round.id} className="funding-round-with-button">
                            <FundingRoundCard
                                name={round.name}
                                value={`$${round.target.toLocaleString()}`}
                                closeDate="N/A"
                                status="in-progress"
                                percentage={roundPercentage}
                                investors={round.investors.map(i => i.name)}
                            />
                            <Button variant="secondary" onClick={() => handleNewInvestor(round.id!)}>
                                + {t('add_investor')}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Investor Pipeline */}
            <div className="inversores-section">
                <h2 className="inversores-section-title">
                    {t('investor_pipeline')}
                </h2>

                {isLoadingInvestors && <p className="text-black">{t('loading')}</p>}
                {errorInvestors && <p className="text-black">{t('error')}: {(errorInvestors as Error).message}</p>}

                {investors && investors.length === 0 && (
                    <p className="text-black">{t('no_investors_yet')}</p>
                )}

                {investors && investors.map((investor) => {
                    const initials = investor.investor_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                    // Mapeo con tipo explícito
                    const stageMap: Record<string, PipelineStage> = {
                        'CONTACTED': 'in-progress',
                        'PITCH_SENT': 'in-progress',
                        'MEETING_SCHEDULED': 'in-progress',
                        'DUE_DILIGENCE': 'in-progress',
                        'TERM_SHEET': 'active',
                        'COMMITTED': 'active',
                        'DECLINED': 'discarded'
                    };

                    // Asegurar el tipo con aserción
                    const pipelineStage: PipelineStage = stageMap[investor.stage] || 'in-progress';

                    return (
                        <InvestorPipelineCard
                            key={investor.id}
                            name={investor.investor_name}
                            initials={initials}
                            description={investor.notes || t('no_description')}
                            avatarColor="var(--main-secondary)"
                            stage={pipelineStage}
                            valuation="N/A"
                            softInvestment={investor.ticket_size ? `$${investor.ticket_size.toLocaleString()}` : 'N/A'}
                            expectedClose={investor.next_action_date || t('pending')}
                            email={investor.investor_email || ''}
                            phone=""
                            isComplete={investor.stage === 'COMMITTED'}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Inversores;