import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaBolt, FaPlus } from 'react-icons/fa';
import './CreateChallengeSection.css';

interface CreateChallengeSectionProps {
    onCreateClick?: () => void;
}

const CreateChallengeSection: React.FC<CreateChallengeSectionProps> = ({ onCreateClick }) => {
    const { t } = useTranslation('common');

    return (
        <div className="createchallenge-container">
            <FaBolt className="createchallenge-icon" />
            <h3 className="createchallenge-title">
                {t('have_business_challenge')}
            </h3>
            <p className="createchallenge-description">
                {t('publish_challenge_description')}
            </p>
            <button
                className="createchallenge-button"
                onClick={onCreateClick}
            >
                <FaPlus className="createchallenge-button-icon" />
                {t('publish_challenge')}
            </button>
        </div>
    );
};

export default CreateChallengeSection;
