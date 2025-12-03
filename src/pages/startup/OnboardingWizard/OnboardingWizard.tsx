import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useOnboardingStore from '../../../stores/OnboardingStore';
import type { InvestorStage } from '@/types/onboarding';
import './OnboardingWizard.css';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import Input from '@/components/forms/Input/Input';
import Select from '@/components/forms/Select/Select';
import routes from '@/routes/routes'


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
            navigate(`${routes.dashboard}`)

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
    const {
        target_funding_amount,
        financial_projections,
        financial_data,
        investors,
        setField,
        setFinancialProjection,
        addFinancialData,
        updateFinancialData,
        removeFinancialData,
        addInvestor,
        updateInvestor,
        removeInvestor,
    } = useOnboardingStore();

    const quarters = ['q1', 'q2', 'q3', 'q4'] as const;

    const investorStageOptions = [
        { value: 'CONTACTED', label: t('stage_contacted') },
        { value: 'PITCH_SENT', label: t('stage_pitch_sent') },
        { value: 'MEETING_SCHEDULED', label: t('stage_meeting_scheduled') },
        { value: 'DUE_DILIGENCE', label: t('stage_due_diligence') },
        { value: 'TERM_SHEET', label: t('stage_term_sheet') },
        { value: 'COMMITTED', label: t('stage_committed') },
        { value: 'DECLINED', label: t('stage_declined') },
    ];

    return (
        <div className="wizard-step">
            <h2 className="text-black wizard-step-title">{t('onboarding_step2_title')}</h2>
            <p className="text-black wizard-step-description">{t('onboarding_step2_description')}</p>

            {/* Target Funding Amount */}
            <h3 className="text-black wizard-subsection-title">{t('target_funding_amount')}</h3>
            <div className="wizard-financial-grid">
                <Input
                    name="target_funding_amount"
                    label={t('target_funding_amount')}
                    type="number"
                    value={String(target_funding_amount || 0)}
                    setValue={(value) => setField('target_funding_amount', Number(value))}
                    placeholder="0.00"
                    required
                />
            </div>

            {/* Financial Projections Grid */}
            <h3 className="text-black wizard-subsection-title">{t('financial_projections')}</h3>
            <p className="text-black wizard-hint">{t('financial_projections_hint')}</p>

            <div className="wizard-projections-grid">
                {/* Header Row */}
                <div className="wizard-projections-header-cell text-black">{t('concept')}</div>
                {quarters.map(quarter => (
                    <div key={quarter} className="wizard-projections-header-cell text-black">
                        {t(quarter)}
                    </div>
                ))}

                {/* Revenue Row */}
                <div className="wizard-projections-concept-cell text-black">{t('revenue')}</div>
                {quarters.map(quarter => (
                    <div key={`revenue-${quarter}`} className="wizard-projections-input-cell">
                        <input
                            type="number"
                            className="wizard-projections-input"
                            value={financial_projections?.[quarter]?.revenue || 0}
                            onChange={(e) => setFinancialProjection(quarter, 'revenue', Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>
                ))}

                {/* COGS Row */}
                <div className="wizard-projections-concept-cell text-black">{t('cogs')}</div>
                {quarters.map(quarter => (
                    <div key={`cogs-${quarter}`} className="wizard-projections-input-cell">
                        <input
                            type="number"
                            className="wizard-projections-input"
                            value={financial_projections?.[quarter]?.cogs || 0}
                            onChange={(e) => setFinancialProjection(quarter, 'cogs', Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>
                ))}

                {/* OPEX Row */}
                <div className="wizard-projections-concept-cell text-black">{t('opex')}</div>
                {quarters.map(quarter => (
                    <div key={`opex-${quarter}`} className="wizard-projections-input-cell">
                        <input
                            type="number"
                            className="wizard-projections-input"
                            value={financial_projections?.[quarter]?.opex || 0}
                            onChange={(e) => setFinancialProjection(quarter, 'opex', Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>
                ))}
            </div>

            {/* Financial Data History */}
            <h3 className="text-black wizard-subsection-title">{t('financial_data_history')}</h3>
            <p className="text-black wizard-hint">{t('financial_data_hint')}</p>

            {financial_data.map((data, index) => (
                <div key={index} className="wizard-investor-card">
                    <div className="wizard-investor-header">
                        <h4 className="text-black">{t('period')} {index + 1}</h4>
                        {financial_data.length > 1 && (
                            <button
                                type="button"
                                className="wizard-btn-remove"
                                onClick={() => removeFinancialData(index)}
                            >
                                {t('delete')}
                            </button>
                        )}
                    </div>
                    <div className="wizard-investor-fields">
                        <div className="wizard-form-group">
                            <Input
                                name={`period_date_${index}`}
                                label={t('period_date')}
                                type="date"
                                value={data.period_date}
                                setValue={(value) => updateFinancialData(index, { period_date: value })}
                                required
                            />
                        </div>
                        <div className="wizard-form-group">
                            <Input
                                name={`revenue_${index}`}
                                label={t('revenue')}
                                type="number"
                                value={String(data.revenue)}
                                setValue={(value) => updateFinancialData(index, { revenue: Number(value) })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="wizard-form-group">
                            <Input
                                name={`costs_${index}`}
                                label={t('costs')}
                                type="number"
                                value={String(data.costs)}
                                setValue={(value) => updateFinancialData(index, { costs: Number(value) })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="wizard-form-group">
                            <Input
                                name={`cash_balance_${index}`}
                                label={t('cash_balance')}
                                type="number"
                                value={String(data.cash_balance)}
                                setValue={(value) => updateFinancialData(index, { cash_balance: Number(value) })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="wizard-form-group">
                            <Input
                                name={`monthly_burn_${index}`}
                                label={t('monthly_burn')}
                                type="number"
                                value={String(data.monthly_burn)}
                                setValue={(value) => updateFinancialData(index, { monthly_burn: Number(value) })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                    <div className="wizard-form-group">
                        <label className="text-black wizard-label">
                            {t('notes')}
                        </label>
                        <textarea
                            className="wizard-textarea"
                            rows={2}
                            value={data.notes || ''}
                            onChange={(e) => updateFinancialData(index, { notes: e.target.value })}
                            placeholder={t('financial_notes_placeholder')}
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                className="wizard-btn-add"
                onClick={addFinancialData}
            >
                + {t('add_financial_period')}
            </button>

            {/* Investor Pipeline */}
            <h3 className="text-black wizard-subsection-title">{t('investor_pipeline')}</h3>
            <p className="text-black wizard-hint">{t('add_potential_investors')}</p>

            {investors.map((investor, index) => (
                <div key={index} className="wizard-investor-card">
                    <div className="wizard-investor-header">
                        <h4 className="text-black">{t('investor')} {index + 1}</h4>
                        {investors.length > 1 && (
                            <button
                                type="button"
                                className="wizard-btn-remove"
                                onClick={() => removeInvestor(index)}
                            >
                                {t('delete')}
                            </button>
                        )}
                    </div>
                    <div className="wizard-investor-fields">
                        <div className="wizard-form-group">
                            <Input
                                name={`investor_name_${index}`}
                                label={t('investor_name')}
                                type="text"
                                value={investor.investor_name}
                                setValue={(value) => updateInvestor(index, { investor_name: value })}
                                placeholder={t('enter_investor_name')}
                                required
                            />
                        </div>
                        <div className="wizard-form-group">
                            <Input
                                name={`investor_email_${index}`}
                                label={t('investor_email')}
                                type="email"
                                value={investor.investor_email || ''}
                                setValue={(value) => updateInvestor(index, { investor_email: value })}
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="wizard-form-group">
                            <Select
                                label={t('stage')}
                                value={investor.stage}
                                onChange={(e) => updateInvestor(index, { stage: e.target.value as InvestorStage })}
                                options={investorStageOptions}
                                required
                            />
                        </div>
                        <div className="wizard-form-group">
                            <Input
                                name={`ticket_size_${index}`}
                                label={t('ticket_size')}
                                type="number"
                                value={String(investor.ticket_size || 0)}
                                setValue={(value) => updateInvestor(index, { ticket_size: Number(value) })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="wizard-form-group">
                        <label className="text-black wizard-label">
                            {t('notes')}
                        </label>
                        <textarea
                            className="wizard-textarea"
                            rows={2}
                            value={investor.notes || ''}
                            onChange={(e) => updateInvestor(index, { notes: e.target.value })}
                            placeholder={t('investor_notes_placeholder')}
                        />
                    </div>
                    <div className="wizard-form-group">
                        <Input
                            name={`next_action_date_${index}`}
                            label={t('next_action_date')}
                            type="date"
                            value={investor.next_action_date || ''}
                            setValue={(value) => updateInvestor(index, { next_action_date: value })}
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                className="wizard-btn-add"
                onClick={addInvestor}
            >
                + {t('add_investor')}
            </button>
        </div>
    );
};

export default OnboardingWizard;