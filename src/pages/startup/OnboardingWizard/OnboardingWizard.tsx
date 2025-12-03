import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useOnboardingStore from '../../../stores/OnboardingStore';
import './OnboardingWizard.css';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import RoundCard from '@/components/onboarding/Rounds/RoundCard';

const OnboardingWizard: React.FC = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    // Zustand Store
    const {
        currentStep,
        isLoading,
        isSaving,
        error,
        loadCampaign,
        setCurrentStep,
        submitOnboarding,
    } = useOnboardingStore();

    // Load campaign data on component mount
    useEffect(() => {
        loadCampaign();
    }, [loadCampaign]);

    const totalSteps = 3;

    // =============================================================================
    // Navigation
    // =============================================================================
    const goToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        const success = await submitOnboarding();
        if (success) {
            navigate('/');
        }
    };

    // =============================================================================
    // Render
    // =============================================================================

    if (isLoading) {
        return (
            <div className="wizard-loading-container">
                <div className="wizard-loading-content">
                    <Spinner variant="primary" size="lg" />
                    <p className="text-black wizard-loading-text">{t('loading_campaign_data')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wizard-error-container">
                <div className="wizard-error-content">
                    <p className="text-black wizard-error-text">{t('error')}: {error}</p>
                </div>
            </div>
        );
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return <Step0CompanyBasics />;
            case 1:
                return <Step1TRLCRL />;
            case 2:
                return <Step2Finanzas />;
            default:
                return <Step0CompanyBasics />;
        }
    };

    return (
        <div className="wizard-container">
            <div className="wizard-card">
                <div className="wizard-progress">
                    <p className="text-black">
                        {t('wizard_step_1')} {currentStep + 1} {t('of')} {totalSteps}
                    </p>
                </div>

                <div className="wizard-content">
                    {renderCurrentStep()}
                </div>

                <div className="wizard-actions">
                    {currentStep > 0 && (
                        <Button
                            variant="secondary"
                            onClick={goToPreviousStep}
                            disabled={isSaving}
                        >
                            {t('previous')}
                        </Button>
                    )}

                    {currentStep < totalSteps - 1 ? (
                        <Button
                            variant="primary"
                            onClick={goToNextStep}
                        >
                            {t('next')}
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSaving}
                        >
                            {isSaving ? t('submitting') : t('submit_application')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// Step Components
// =============================================================================

const Step0CompanyBasics: React.FC = () => {
    const { t } = useTranslation('common');
    const { company_name, industry, setField } = useOnboardingStore();

    const industryOptions = [
        { value: '', label: t('select_industry') },
        { value: 'technology', label: 'Technology' },
        { value: 'fintech', label: 'FinTech' },
        { value: 'healthtech', label: 'HealthTech' },
        { value: 'edtech', label: 'EdTech' },
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'saas', label: 'SaaS' },
        { value: 'ai_ml', label: 'AI/ML' },
        { value: 'blockchain', label: 'Blockchain' },
        { value: 'marketplace', label: 'Marketplace' },
        { value: 'other', label: t('other') },
    ];

    return (
        <div className="wizard-step">
            <h2 className="text-black wizard-step-title">{t('onboarding_step0_title')}</h2>
            <p className="text-black wizard-step-description">{t('onboarding_step0_description')}</p>

            <div className="wizard-form-group">
                <Input
                    name="company_name"
                    label={t('company_name')}
                    value={company_name}
                    setValue={(value) => setField('company_name', value)}
                    placeholder={t('enter_company_name')}
                    required
                />
            </div>

            <div className="wizard-form-group">
                <Select
                    label={t('industry')}
                    value={industry}
                    onChange={(e) => setField('industry', e.target.value)}
                    options={industryOptions}
                    required
                />
            </div>
        </div>
    );
};

const Step1TRLCRL: React.FC = () => {
    const { t } = useTranslation('common');
    const { current_trl, current_crl, evidences, setField, addEvidence, updateEvidence, removeEvidence } = useOnboardingStore();

    const trlOptions = Array.from({ length: 9 }, (_, i) => ({
        value: String(i + 1),
        label: `TRL ${i + 1}`
    }));

    const crlOptions = [
        { value: '', label: t('no_crl') },
        ...Array.from({ length: 9 }, (_, i) => ({
            value: String(i + 1),
            label: `CRL ${i + 1}`
        }))
    ];

        const [activeTab, setActiveTab] = React.useState<'TRL' | 'CRL'>('TRL');

    

        return (

            <div className="wizard-step">

                <h2 className="text-black wizard-step-title">{t('onboarding_step1_title')}</h2>

                <p className="text-black wizard-step-description">{t('onboarding_step1_description')}</p>

    

                <div className="wizard-financial-grid">
                <div className="wizard-form-group">
                    <Select
                        label={t('current_trl_level')}
                        value={String(current_trl)}
                        onChange={(e) => setField('current_trl', Number(e.target.value))}
                        options={[{ value: '', label: t('select_trl') }, ...trlOptions]}
                        required
                        placeholder={t('select_trl')}
                    />
                </div>

                <div className="wizard-form-group">
                    <Select
                        label={t('current_crl_level')}
                        value={current_crl ? String(current_crl) : ''}
                        onChange={(e) => setField('current_crl', e.target.value ? Number(e.target.value) : null)}
                        options={crlOptions}
                        placeholder={t('select_crl_optional')}
                    />
                    <span className="text-black wizard-hint">{t('crl_optional_hint')}</span>
                </div>
            </div>

            <div className="wizard-tabs">

                    <button

                        className={`wizard-tab-btn ${activeTab === 'TRL' ? 'active' : ''}`}

                        onClick={() => setActiveTab('TRL')}

                    >

                        {t('trl_evidences')}

                    </button>

                    <button

                        className={`wizard-tab-btn ${activeTab === 'CRL' ? 'active' : ''}`}

                        onClick={() => setActiveTab('CRL')}

                    >

                        {t('crl_evidences')}

                    </button>

                </div>

    

                <h3 className="text-black wizard-subsection-title">{t('evidence_documentation')}</h3>

            {evidences.filter(e => e.type === activeTab).map((evidence, index) => {
                // Find the original index in the main evidences array
                const originalIndex = evidences.findIndex(e => e === evidence);
                return (
                    <div key={originalIndex} className="wizard-investor-card">
                        <div className="wizard-investor-header">
                            <h4 className="text-black">{t('evidence')} {index + 1}</h4>
                            {evidences.filter(e => e.type === activeTab).length > 1 && (
                                <button
                                    type="button"
                                    className="wizard-btn-remove"
                                    onClick={() => removeEvidence(originalIndex)}
                                >
                                    {t('delete')}
                                </button>
                            )}
                        </div>

                        <div className="wizard-financial-grid">
                            <div className="wizard-form-group">
                                <Select
                                    label={t(`${activeTab.toLowerCase()}_level`)}
                                    value={String(evidence.level)}
                                    onChange={(e) => updateEvidence(originalIndex, { level: Number(e.target.value) })}
                                    options={[{ value: '', label: t(`select_${activeTab.toLowerCase()}`) }, ...(activeTab === 'TRL' ? trlOptions : crlOptions)]}
                                    required
                                />
                            </div>
                        </div>

                        <div className="wizard-form-group">
                            <label className="text-black wizard-label">
                                {t('evidence_description')} *
                            </label>
                            <textarea
                                className="wizard-textarea"
                                rows={3}
                                value={evidence.description}
                                onChange={(e) => updateEvidence(originalIndex, { description: e.target.value })}
                                placeholder={t('evidence_description_placeholder')}
                            />
                        </div>

                        <div className="wizard-form-group">
                            <Input
                                name={`evidence_file_url_${originalIndex}`}
                                label={t('evidence_file_url')}
                                value={evidence.file_url || ''}
                                setValue={(value) => updateEvidence(originalIndex, { file_url: value })}
                                placeholder="https://..."
                            />
                            <span className="text-black wizard-hint">{t('evidence_file_url_hint')}</span>
                        </div>
                    </div>
                )
            })}

            <button
                type="button"
                className="wizard-btn-add"
                onClick={() => addEvidence(activeTab)}
            >
                + {t(`add_${activeTab.toLowerCase()}_evidence`)}
            </button>
        </div>
    );
};

const Step2Finanzas: React.FC = () => {
    const { t } = useTranslation('common');
    const { financials, addRound } = useOnboardingStore();

    return (
        <div className="wizard-step">
            <h2 className="text-black wizard-step-title">{t('onboarding_step2_title')}</h2>
            <p className="text-black wizard-step-description">{t('onboarding_step2_description')}</p>

            <h3 className="text-black wizard-subsection-title">{t('investment_rounds_structure')}</h3>

            {financials?.rounds.map((round, index) => (
                <RoundCard
                    key={index}
                    round={round}
                    roundIndex={index}
                />
            ))}

            <button
                type="button"
                className="wizard-btn-add"
                onClick={addRound}
            >
                + {t('add_another_round')}
            </button>
        </div>
    );
};

export default OnboardingWizard;
