import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import Button from '@/components/common/Button/Button';
import './FundingProgress.css';

interface FundingProgressProps {
    currentAmount: number;
    targetAmount: number;
    roundName: string;
    onSearchInvestors?: () => void;
    onViewDetails?: () => void;
}

const FundingProgress = ({
    currentAmount,
    targetAmount,
    roundName,
    onSearchInvestors,
    onViewDetails,
}: FundingProgressProps) => {
    const { t } = useTranslation('common');

    const percentage = Math.round((currentAmount / targetAmount) * 100);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="fundingprogress-container">
            <h2 className="fundingprogress-title text-black">
                {roundName} {t('in_progress')}
            </h2>

            <div className="fundingprogress-info">
                <p className="fundingprogress-amount text-black">
                    {formatCurrency(currentAmount)} {t('of')}{' '}
                    {formatCurrency(targetAmount)} {t('committed')}
                </p>
                <span className="fundingprogress-percentage">
                    {percentage}% {t('completed')}
                </span>
            </div>

            <div className="fundingprogress-bar-container">
                <div
                    className="fundingprogress-bar"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className="fundingprogress-actions">
                <Button
                    variant="secondary"
                    size="md"
                    onClick={onSearchInvestors}
                    className="fundingprogress-action-primary"
                >
                    <FaSearch className="fundingprogress-icon" />
                    {t('search_investors')}
                </Button>
            </div>
        </div>
    );
};

export default FundingProgress;
