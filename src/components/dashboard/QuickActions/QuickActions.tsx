import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaDollarSign, FaCommentDots, FaChartLine } from 'react-icons/fa';
import './QuickActions.css';

export interface QuickAction {
    id: string;
    icon: 'upload-evidence' | 'update-finances' | 'request-mentoring' | 'apply-challenge';
    label: string;
    onClick?: () => void;
}

interface QuickActionsProps {
    actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
    const { t } = useTranslation('common');

    const getIcon = (iconType: QuickAction['icon']) => {
        const iconProps = { className: 'quickactions-icon' };

        switch (iconType) {
            case 'upload-evidence':
                return <FaCheckCircle {...iconProps} />;
            case 'update-finances':
                return <FaDollarSign {...iconProps} />;
            case 'request-mentoring':
                return <FaCommentDots {...iconProps} />;
            case 'apply-challenge':
                return <FaChartLine {...iconProps} />;
            default:
                return <FaCheckCircle {...iconProps} />;
        }
    };

    return (
        <div className="quickactions-grid">
            {actions.map((action) => (
                <div
                    key={action.id}
                    className="quickactions-card"
                    onClick={action.onClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            action.onClick?.();
                        }
                    }}
                >
                    {getIcon(action.icon)}
                    <span className="quickactions-label text-black">{action.label}</span>
                </div>
            ))}
        </div>
    );
};

export default QuickActions;
