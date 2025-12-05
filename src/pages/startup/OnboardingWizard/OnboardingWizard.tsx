import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useOnboardingStore from '../../../stores/OnboardingStore';
import './OnboardingWizard.css';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import routes from '@/routes/routes'
import { fetchIncubators } from '@/api/onboarding';


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

    const totalSteps = 2;

    // =============================================================================
    // Validation
    // =============================================================================
    const validateStep0 = (): { isValid: boolean; message?: string } => {
        const { company_name, industry } = useOnboardingStore.getState();

        // Validate company name
        if (!company_name || company_name.trim() === '') {
            return {
                isValid: false,
                message: t('please_enter_company_name')
            };
        }

        // Validate industry
        if (!industry || industry.trim() === '') {
            return {
                isValid: false,
                message: t('please_select_industry')
            };
        }

        return { isValid: true };
    };

    // =============================================================================
    // Navigation
    // =============================================================================
    const goToNextStep = () => {
        // Validate step 0 before proceeding
        if (currentStep === 0) {
            const validation = validateStep0();
            if (!validation.isValid) {
                // Validation will be shown in the UI
                return;
            }
        }

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
            navigate(`${routes.dashboardMiProgreso}`)

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

    // Check if current step is valid
    const isCurrentStepValid = () => {
        if (currentStep === 0) {
            return validateStep0().isValid;
        }
        return true;
    };

    const getCurrentStepValidation = () => {
        if (currentStep === 0) {
            return validateStep0();
        }
        return { isValid: true };
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return <Step0CompanyBasics />;
            case 1:
                return <Step2Incubators />;
            default:
                return <Step0CompanyBasics />;
        }
    };

    return (
        <div className="wizard-container" style={{ backgroundColor: 'var(--gray-400)' }}>
            <div className="wizard-card" style={{ backgroundColor: 'white' }}>
                <div className="wizard-progress">
                    <p className="text-black">
                        {t('Paso')} {currentStep + 1} {t('of')} {totalSteps}
                    </p>
                </div>

                <div className="wizard-content">
                    {renderCurrentStep()}

                    {/* Validation Warning - Only show on Step 0 */}
                    {currentStep === 0 && !getCurrentStepValidation().isValid && (
                        <div className="wizard-validation-warning">
                            <p className="text-black">⚠️ {getCurrentStepValidation().message}</p>
                        </div>
                    )}
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
                            disabled={!isCurrentStepValid()}
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



const Step2Incubators: React.FC = () => {
    const { t } = useTranslation('common');
    const {
        incubator_ids,
        setField,
    } = useOnboardingStore();
    const [incubators, setIncubators] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        const loadIncubators = async () => {
            setLoading(true);
            try {
                const data = await fetchIncubators();
                setIncubators(data);
            } catch (error) {
                console.error("Failed to fetch incubators", error);
            } finally {
                setLoading(false);
            }
        };
        loadIncubators();
    }, []);

    const toggleIncubator = (id: string) => {
        const currentIds = incubator_ids || [];
        if (currentIds.includes(id)) {
            setField('incubator_ids', currentIds.filter(i => i !== id));
        } else {
            setField('incubator_ids', [...currentIds, id]);
        }
    };

    return (
        <div className="wizard-step">
            <h2 className="text-black wizard-step-title">{t('onboarding_step2_title_incubator')}</h2>
            <p className="text-black wizard-step-description">{t('onboarding_step2_description_incubator')}</p>

            {loading ? (
                <div className="wizard-loading-content">
                    <Spinner variant="primary" size="md" />
                </div>
            ) : (
                <div className="wizard-form-group">
                    <label className="text-black wizard-label">{t('select_incubator')}</label>
                    <div className="wizard-grid-options">
                        {incubators.map(inc => {
                            const isSelected = (incubator_ids || []).includes(String(inc.id));
                            return (
                                <div
                                    key={inc.id}
                                    className={`wizard-selectable-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleIncubator(String(inc.id))}
                                >
                                    <div className="wizard-selectable-card-content">
                                        <span className="wizard-selectable-card-title">{inc.name}</span>
                                    </div>
                                    <div className="wizard-selectable-card-check"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingWizard;