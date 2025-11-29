import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';
import type {
    OnboardingFormState,
    OnboardingWizardPayload,
    OnboardingWizardResponse,
    OnboardingValidationError,
} from '../../../types/onboarding';
import { initialOnboardingState } from '../../../types/onboarding';
import './OnboardingWizard.css';

const OnboardingWizard: React.FC = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    // Wizard state
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<OnboardingFormState>(initialOnboardingState);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<OnboardingValidationError>({});

    const totalSteps = 4;

    // =============================================================================
    // STEP NAVIGATION
    // =============================================================================

    const goToNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            setErrors({});
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    // =============================================================================
    // FORM HANDLERS
    // =============================================================================

    const handleTRLChange = (value: number) => {
        setFormData(prev => ({
            ...prev,
            current_trl: value,
            evidences: prev.evidences.map((evidence, index) =>
                index === 0 ? { ...evidence, trl_level: value } : evidence
            ),
        }));
    };

    const handleEvidenceChange = (index: number, field: string, value: string) => {
        const updatedEvidences = [...formData.evidences];
        updatedEvidences[index] = {
            ...updatedEvidences[index],
            [field]: value,
        };
        setFormData(prev => ({
            ...prev,
            evidences: updatedEvidences,
        }));
    };

    const handleFinancialChange = (index: number, field: string, value: string | number) => {
        const updatedFinancial = [...formData.financial_data];
        updatedFinancial[index] = {
            ...updatedFinancial[index],
            [field]: value,
        };
        setFormData(prev => ({
            ...prev,
            financial_data: updatedFinancial,
        }));
    };

    const handleInvestorChange = (index: number, field: string, value: string | number) => {
        const updatedInvestors = [...formData.investors];
        updatedInvestors[index] = {
            ...updatedInvestors[index],
            [field]: value,
        };
        setFormData(prev => ({
            ...prev,
            investors: updatedInvestors,
        }));
    };

    const addInvestor = () => {
        setFormData(prev => ({
            ...prev,
            investors: [
                ...prev.investors,
                {
                    investor_name: '',
                    investor_email: '',
                    stage: 'CONTACTED',
                    ticket_size: 0,
                    notes: '',
                },
            ],
        }));
    };

    const removeInvestor = (index: number) => {
        if (formData.investors.length > 1) {
            setFormData(prev => ({
                ...prev,
                investors: prev.investors.filter((_, i) => i !== index),
            }));
        }
    };

    // =============================================================================
    // FORM SUBMISSION
    // =============================================================================

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setErrors({});

        try {
            // Build the payload matching the backend serializer structure
            const payload: OnboardingWizardPayload = {
                company_name: formData.company_name,
                industry: formData.industry,
                current_trl: formData.current_trl,
                target_funding_amount: formData.target_funding_amount,
                evidences: formData.evidences.map(evidence => ({
                    trl_level: evidence.trl_level,
                    description: evidence.description,
                    file_url: evidence.file_url || '',
                })),
                financial_data: formData.financial_data.map(financial => ({
                    period_date: financial.period_date,
                    revenue: Number(financial.revenue),
                    costs: Number(financial.costs),
                    cash_balance: Number(financial.cash_balance),
                    monthly_burn: Number(financial.monthly_burn),
                    notes: financial.notes,
                })),
                investors: formData.investors.map(investor => ({
                    investor_name: investor.investor_name,
                    investor_email: investor.investor_email,
                    stage: investor.stage,
                    ticket_size: investor.ticket_size ? Number(investor.ticket_size) : undefined,
                    notes: investor.notes,
                })),
            };

            // Send to backend
            const response = await axiosInstance.post<OnboardingWizardResponse>(
                '/startup/complete-onboarding/',
                payload
            );

            // Update user details in localStorage to mark onboarding as complete
            const updatedUserResponse = await axiosInstance.get('/auth/user/');
            const updatedUser = updatedUserResponse.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Success!
            toast.success(t('onboarding_wizard_success'));

            // Navigate to dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error: any) {
            console.error('Onboarding wizard error:', error);

            if (error.response?.data) {
                setErrors(error.response.data);
                toast.error(t('onboarding_wizard_error'));
            } else {
                toast.error(t('error'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // =============================================================================
    // STEP RENDERERS
    // =============================================================================

    const renderStep0 = () => (
        <div className="wizard-step">
            <h2 className="wizard-step-title text-black">{t('onboarding_step0_title')}</h2>
            <p className="wizard-step-description text-black">{t('onboarding_step0_description')}</p>

            <div className="wizard-form-group">
                <label htmlFor="company_name" className="wizard-label text-black">
                    {t('company_name')} *
                </label>
                <input
                    type="text"
                    id="company_name"
                    className="wizard-input"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder={t('enter_company_name')}
                />
            </div>

            <div className="wizard-form-group">
                <label htmlFor="industry" className="wizard-label text-black">
                    {t('industry')} *
                </label>
                <select
                    id="industry"
                    className="wizard-select"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                >
                    <option value="">{t('select_industry')}</option>
                    <option value="technology">Technology</option>
                    <option value="fintech">FinTech</option>
                    <option value="healthtech">HealthTech</option>
                    <option value="edtech">EdTech</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="saas">SaaS</option>
                    <option value="ai_ml">AI/ML</option>
                    <option value="blockchain">Blockchain</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="other">{t('other')}</option>
                </select>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="wizard-step">
            <h2 className="wizard-step-title text-black">{t('onboarding_step1_title')}</h2>
            <p className="wizard-step-description text-black">{t('onboarding_step1_description')}</p>

            <div className="wizard-form-group">
                <label htmlFor="current_trl" className="wizard-label text-black">
                    {t('current_trl_level')} *
                </label>
                <select
                    id="current_trl"
                    className="wizard-select"
                    value={formData.current_trl}
                    onChange={(e) => handleTRLChange(Number(e.target.value))}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                        <option key={level} value={level}>
                            TRL {level}
                        </option>
                    ))}
                </select>
            </div>

            <div className="wizard-form-group">
                <label htmlFor="evidence_description" className="wizard-label text-black">
                    {t('evidence_description')} *
                </label>
                <textarea
                    id="evidence_description"
                    className="wizard-textarea"
                    rows={4}
                    value={formData.evidences[0]?.description || ''}
                    onChange={(e) => handleEvidenceChange(0, 'description', e.target.value)}
                    placeholder={t('evidence_description_placeholder')}
                />
                {errors.evidences && (
                    <span className="wizard-error text-black">{String(errors.evidences)}</span>
                )}
            </div>

            <div className="wizard-form-group">
                <label htmlFor="evidence_file_url" className="wizard-label text-black">
                    {t('evidence_file_url')} *
                </label>
                <input
                    type="url"
                    id="evidence_file_url"
                    className="wizard-input"
                    value={formData.evidences[0]?.file_url || ''}
                    onChange={(e) => handleEvidenceChange(0, 'file_url', e.target.value)}
                    placeholder="https://storage.example.com/evidence.pdf"
                />
                <small className="wizard-hint text-black">{t('evidence_file_url_hint')}</small>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="wizard-step">
            <h2 className="wizard-step-title text-black">{t('onboarding_step2_title')}</h2>
            <p className="wizard-step-description text-black">{t('onboarding_step2_description')}</p>

            <div className="wizard-financial-grid">
                <div className="wizard-form-group">
                    <label htmlFor="period_date" className="wizard-label text-black">
                        {t('period_date')} *
                    </label>
                    <input
                        type="date"
                        id="period_date"
                        className="wizard-input"
                        value={formData.financial_data[0]?.period_date || ''}
                        onChange={(e) => handleFinancialChange(0, 'period_date', e.target.value)}
                    />
                </div>

                <div className="wizard-form-group">
                    <label htmlFor="revenue" className="wizard-label text-black">
                        {t('revenue')} (USD) *
                    </label>
                    <input
                        type="number"
                        id="revenue"
                        className="wizard-input"
                        value={formData.financial_data[0]?.revenue || 0}
                        onChange={(e) => handleFinancialChange(0, 'revenue', Number(e.target.value))}
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="wizard-form-group">
                    <label htmlFor="costs" className="wizard-label text-black">
                        {t('costs')} (USD) *
                    </label>
                    <input
                        type="number"
                        id="costs"
                        className="wizard-input"
                        value={formData.financial_data[0]?.costs || 0}
                        onChange={(e) => handleFinancialChange(0, 'costs', Number(e.target.value))}
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="wizard-form-group">
                    <label htmlFor="cash_balance" className="wizard-label text-black">
                        {t('cash_balance')} (USD) *
                    </label>
                    <input
                        type="number"
                        id="cash_balance"
                        className="wizard-input"
                        value={formData.financial_data[0]?.cash_balance || 0}
                        onChange={(e) => handleFinancialChange(0, 'cash_balance', Number(e.target.value))}
                        step="0.01"
                    />
                </div>

                <div className="wizard-form-group">
                    <label htmlFor="monthly_burn" className="wizard-label text-black">
                        {t('monthly_burn_rate')} (USD) *
                    </label>
                    <input
                        type="number"
                        id="monthly_burn"
                        className="wizard-input"
                        value={formData.financial_data[0]?.monthly_burn || 0}
                        onChange={(e) => handleFinancialChange(0, 'monthly_burn', Number(e.target.value))}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            {errors.financial_data && (
                <span className="wizard-error text-black">{String(errors.financial_data)}</span>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="wizard-step">
            <h2 className="wizard-step-title text-black">{t('onboarding_step3_title')}</h2>
            <p className="wizard-step-description text-black">{t('onboarding_step3_description')}</p>

            <div className="wizard-form-group">
                <label htmlFor="target_funding" className="wizard-label text-black">
                    {t('target_funding_amount')} (USD) *
                </label>
                <input
                    type="number"
                    id="target_funding"
                    className="wizard-input"
                    value={formData.target_funding_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_funding_amount: Number(e.target.value) }))}
                    min="0"
                    step="1000"
                    placeholder="150000"
                />
            </div>

            <h3 className="wizard-subsection-title text-black">{t('add_investors')}</h3>

            {formData.investors.map((investor, index) => (
                <div key={index} className="wizard-investor-card">
                    <div className="wizard-investor-header">
                        <h4 className="text-black">{t('investor')} {index + 1}</h4>
                        {formData.investors.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeInvestor(index)}
                                className="wizard-btn-remove"
                            >
                                {t('remove')}
                            </button>
                        )}
                    </div>

                    <div className="wizard-investor-fields">
                        <div className="wizard-form-group">
                            <label className="wizard-label text-black">{t('investor_name')} *</label>
                            <input
                                type="text"
                                className="wizard-input"
                                value={investor.investor_name}
                                onChange={(e) => handleInvestorChange(index, 'investor_name', e.target.value)}
                                placeholder="Angel Investor 1"
                            />
                        </div>

                        <div className="wizard-form-group">
                            <label className="wizard-label text-black">{t('investor_email')}</label>
                            <input
                                type="email"
                                className="wizard-input"
                                value={investor.investor_email || ''}
                                onChange={(e) => handleInvestorChange(index, 'investor_email', e.target.value)}
                                placeholder="investor@example.com"
                            />
                        </div>

                        <div className="wizard-form-group">
                            <label className="wizard-label text-black">{t('stage')} *</label>
                            <select
                                className="wizard-select"
                                value={investor.stage}
                                onChange={(e) => handleInvestorChange(index, 'stage', e.target.value)}
                            >
                                <option value="CONTACTED">{t('stage_contacted')}</option>
                                <option value="PITCH_SENT">{t('stage_pitch_sent')}</option>
                                <option value="MEETING_SCHEDULED">{t('stage_meeting_scheduled')}</option>
                                <option value="DUE_DILIGENCE">{t('stage_due_diligence')}</option>
                                <option value="TERM_SHEET">{t('stage_term_sheet')}</option>
                                <option value="COMMITTED">{t('stage_committed')}</option>
                            </select>
                        </div>

                        <div className="wizard-form-group">
                            <label className="wizard-label text-black">{t('ticket_size')} (USD)</label>
                            <input
                                type="number"
                                className="wizard-input"
                                value={investor.ticket_size || 0}
                                onChange={(e) => handleInvestorChange(index, 'ticket_size', Number(e.target.value))}
                                min="0"
                                step="1000"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button type="button" onClick={addInvestor} className="wizard-btn-add">
                + {t('add_another_investor')}
            </button>

            {errors.investors && (
                <span className="wizard-error text-black">{String(errors.investors)}</span>
            )}
        </div>
    );

    // =============================================================================
    // MAIN RENDER
    // =============================================================================

    return (
        <div className="wizard-container">
            <div className="wizard-card">
                {/* Progress Bar */}
                <div className="wizard-progress">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`wizard-progress-step ${
                                currentStep === step ? 'active' : ''
                            } ${currentStep > step ? 'completed' : ''}`}
                        >
                            <div className="wizard-progress-circle">{step}</div>
                            <span className="wizard-progress-label text-black">
                                {t(`wizard_step_${step}`)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="wizard-content">
                    {currentStep === 1 && renderStep0()}
                    {currentStep === 2 && renderStep1()}
                    {currentStep === 3 && renderStep2()}
                    {currentStep === 4 && renderStep3()}
                </div>

                {/* Navigation Buttons */}
                <div className="wizard-actions">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={goToPreviousStep}
                            className="wizard-btn-secondary"
                            disabled={isSubmitting}
                        >
                            {t('previous')}
                        </button>
                    )}

                    {currentStep < totalSteps ? (
                        <button
                            type="button"
                            onClick={goToNextStep}
                            className="wizard-btn-primary"
                        >
                            {t('next')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="wizard-btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('submitting') : t('complete_onboarding')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;