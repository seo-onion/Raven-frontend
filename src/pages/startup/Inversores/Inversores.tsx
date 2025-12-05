import React from 'react';
import { useTranslation } from 'react-i18next';
import CrowdfundingBar from '../../../components/dashboard/CrowdfundingBar/CrowdfundingBar';
import FundingRoundCard from '../../../components/dashboard/FundingRoundCard/FundingRoundCard';
import { useInvestmentRounds, useStartupData } from '../../../hooks/useStartupData';
import useStartupValidation from '@/hooks/useStartupValidation';
import Button from '@/components/common/Button/Button';
import useModalStore from '@/stores/ModalStore';
import NewRoundModal from '@/modals/NewRoundModal/NewRoundModal';
import NewInvestorModal from '@/modals/NewInvestorModal/NewInvestorModal';
import AssociateIncubatorModal from '@/modals/AssociateIncubatorModal/AssociateIncubatorModal';
import Spinner from '@/components/common/Spinner/Spinner';
import './Inversores.css';

const Inversores: React.FC = () => {
    const { t } = useTranslation('common');

    const { data: rounds, isLoading: isLoadingRounds, error: errorRounds } = useInvestmentRounds();
    const { data: startupData, isLoading: isLoadingStartupData } = useStartupData();
    const associatedIncubators = startupData?.incubators;
    const { setModalContent } = useModalStore();

    // Validate startup has company_name, redirect to wizard if not
    useStartupValidation();

    const handleNewRound = () => {
        setModalContent(<NewRoundModal />);
    };

    const handleNewInvestor = (roundId: number) => {
        setModalContent(<NewInvestorModal roundId={roundId} />);
    };

    const handleAssociateIncubators = () => {
        setModalContent(<AssociateIncubatorModal />);
    };

    const currentRound = rounds?.find(r => r.is_current);
    const totalGoal = currentRound ? Number(currentRound.target_amount || 0) : 0;
    const totalCurrent = currentRound?.investors?.reduce((acc, inv) => acc + Number(inv.amount || 0), 0) || 0;
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
                    const investors = round.investors || [];
                    const roundTarget = Number(round.target_amount || 0);
                    const roundCurrent = investors.reduce((acc, investor) => acc + Number(investor.amount || 0), 0);
                    const roundPercentage = roundTarget > 0 ? (roundCurrent / roundTarget) * 100 : 0;

                    let cardStatus: 'pending' | 'in-progress' | 'completed' = 'pending';
                    if (round.status === 'OPEN') cardStatus = 'in-progress';
                    if (round.status === 'CLOSED') cardStatus = 'completed';

                    return (
                        <div key={round.id} className="funding-round-with-button">
                            <FundingRoundCard
                                name={round.name}
                                value={`$${roundTarget.toLocaleString()}`}
                                closeDate={round.target_close_date || 'N/A'}
                                status={cardStatus}
                                percentage={Math.round(roundPercentage)}
                                investors={investors.map(i => i.incubator_details?.name || 'Unknown')}
                            />
                            <Button variant="secondary" onClick={() => handleNewInvestor(round.id)}>
                                + {t('add_investor')}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Associated Incubators */}
            <div className="inversores-section">
                <div className="inversores-section-header">
                    <h2 className="inversores-section-title">
                        {t('associated_incubators')}
                    </h2>
                    <Button variant="primary" onClick={handleAssociateIncubators}>
                        + {t('associate_incubators')}
                    </Button>
                </div>

                {isLoadingStartupData && (
                    <div className="inversores-loading">
                        <Spinner variant="primary" size="lg" />
                    </div>
                )}

                {associatedIncubators && associatedIncubators.length === 0 && (
                    <p className="text-black">{t('no_associated_incubators')}</p>
                )}

                {associatedIncubators && associatedIncubators.map((incubator) => (
                    <div key={incubator.id} className="incubator-card">
                        <div className="incubator-header">
                            <h3 className="incubator-name text-black">{incubator.name}</h3>
                            <p className="incubator-meta text-black">
                                {t('created')}: {new Date(incubator.created).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inversores;