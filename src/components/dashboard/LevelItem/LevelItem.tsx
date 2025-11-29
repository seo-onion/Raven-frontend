import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaCircle, FaFileAlt, FaImage, FaVideo } from 'react-icons/fa';
import { FaCircleDot } from 'react-icons/fa6';
import './LevelItem.css';

export type LevelStatus = 'completed' | 'in-progress' | 'pending';

interface LevelItemProps {
    level: number;
    title: string;
    description: string;
    status: LevelStatus;
    lastUpdate?: string;
    updatedBy?: string;
    isOpen?: boolean;
    onToggle?: () => void;
}

export const LevelItem = ({ level, title, description, status, lastUpdate, updatedBy, isOpen = false, onToggle }: LevelItemProps) => {
    const { t } = useTranslation('common');

    const getStatusBadge = () => {
        switch (status) {
            case 'completed':
                return (
                    <span className="levelitem-badge levelitem-badge-completed">
                        {t('completed')}
                    </span>
                );
            case 'in-progress':
                return (
                    <span className="levelitem-badge levelitem-badge-progress">
                        {t('in_progress')}
                    </span>
                );
            case 'pending':
                return (
                    <span className="levelitem-badge levelitem-badge-pending">
                        {t('pending')}
                    </span>
                );
        }
    };

    const getIcon = () => {
        const iconClass = `levelitem-icon levelitem-icon-${status}`;
        if (status === 'completed') {
            return <FaCheckCircle className={iconClass} />;
        }
        if (status === 'in-progress') {
            return <FaCircleDot className={iconClass} />;
        }
        return <FaCircle className={iconClass} />;
    };

    return (
        <div className={`levelitem-container levelitem-${status}`}>
            <div
                className="levelitem-header"
                onClick={onToggle}
                style={{ cursor: onToggle ? 'pointer' : 'default' }}
            >
                <div className="levelitem-title-group">
                    {getIcon()}
                    <div className="levelitem-text-content">
                        <h3 className="levelitem-title">
                            TRL {level}: {title}
                        </h3>
                        <p className="levelitem-description">
                            {description}
                        </p>
                        {lastUpdate && updatedBy && (
                            <span className="levelitem-last-update">
                                {t('last_update')}: {lastUpdate} {t('by')} {updatedBy}
                            </span>
                        )}
                    </div>
                </div>
                {getStatusBadge()}
            </div>

            {isOpen && (
                <>
                    <div className="levelitem-divider"></div>
                    <div className="levelitem-evidence">
                        <h4 className="levelitem-evidence-title">
                            {t('evidence_documentation')}
                        </h4>
                        <div className="levelitem-note-area">
                            {t('add_progress_notes')}
                        </div>
                        <div className="levelitem-upload-buttons">
                            <button
                                className="levelitem-upload-btn"
                                disabled={status === 'pending'}
                            >
                                <FaFileAlt className="levelitem-upload-icon" />
                                {t('upload_pdf')}
                            </button>
                            <button
                                className="levelitem-upload-btn"
                                disabled={status === 'pending'}
                            >
                                <FaImage className="levelitem-upload-icon" />
                                {t('upload_image')}
                            </button>
                            <button
                                className="levelitem-upload-btn"
                                disabled={status === 'pending'}
                            >
                                <FaVideo className="levelitem-upload-icon" />
                                {t('upload_video')}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
