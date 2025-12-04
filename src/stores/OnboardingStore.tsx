import { create } from 'zustand';
import { produce } from 'immer';
import toast from 'react-hot-toast';
import type {
    OnboardingFormState,
    EvidenceData,
    OnboardingWizardPayload,
    FinancialData,
    InvestorData,
} from '@/types/onboarding';
import { completeOnboarding } from '@/api/onboarding';
import useAuthStore from '@/stores/AuthStore'; // Add this import

interface OnboardingState extends OnboardingFormState {
    currentStep: number;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
}

interface OnboardingActions {
    loadCampaign: () => Promise<void>;
    setField: <K extends keyof OnboardingFormState>(field: K, value: OnboardingFormState[K]) => void;
    setFinancialProjection: (quarter: 'q1' | 'q2' | 'q3' | 'q4', field: 'revenue' | 'cogs' | 'opex', value: number) => void;

    // Evidence actions
    addEvidence: (type: 'TRL' | 'CRL') => void;
    updateEvidence: (index: number, evidence: Partial<EvidenceData>) => void;
    removeEvidence: (index: number) => void;

    // Financial Data actions
    addFinancialData: () => void;
    updateFinancialData: (index: number, data: Partial<FinancialData>) => void;
    removeFinancialData: (index: number) => void;

    // Investor actions
    addInvestor: () => void;
    updateInvestor: (index: number, investor: Partial<InvestorData>) => void;
    removeInvestor: (index: number) => void;


    // Navigation
    setCurrentStep: (step: number) => void;

    // Submit
    submitOnboarding: () => Promise<boolean>;
}

const initialState: OnboardingState = {
    // Company basics (from campaign)
    company_name: '',
    industry: '',

    // TRL/CRL
    current_trl: 1,
    current_crl: null,
    evidences: [],

    // Financials
    target_funding_amount: 0,
    financial_projections: {
        q1: { revenue: 0, cogs: 0, opex: 0 },
        q2: { revenue: 0, cogs: 0, opex: 0 },
        q3: { revenue: 0, cogs: 0, opex: 0 },
        q4: { revenue: 0, cogs: 0, opex: 0 },
    },
    financial_data: [],

    // Investors
    investors: [],

    // Incubators
    incubator_ids: [],

    // UI State
    currentStep: 0,
    isLoading: true,
    isSaving: false,
    error: null,
};

const useOnboardingStore = create<OnboardingState & OnboardingActions>()((set, get) => ({
    ...initialState,

    loadCampaign: async () => {
        set({ isLoading: true, error: null });
        try {
            // For now, we initialize with default data to pass backend validation
            set(produce((state: OnboardingState) => {
                if (!state.evidences) {
                    state.evidences = [];
                }
                if (!state.financial_data || state.financial_data.length === 0) {
                    state.financial_data = [{
                        period_date: new Date().toISOString().split('T')[0],
                        revenue: 0,
                        costs: 0,
                        cash_balance: 0,
                        monthly_burn: 0,
                    }];
                }
                if (!state.investors || state.investors.length === 0) {
                    state.investors = [{
                        investor_name: '',
                        investor_email: '',
                        stage: 'CONTACTED',
                        ticket_size: 0,
                    }];
                }
                state.isLoading = false;
            }));
        } catch (error) {
            console.error("Failed to load campaign data:", error);
            set({ isLoading: false, error: 'Failed to load campaign data.' });
            toast.error('Failed to load campaign data.');
        }
    },

    setField: <K extends keyof OnboardingFormState>(field: K, value: OnboardingFormState[K]) => {
        set(produce((state: OnboardingState) => {
            state[field] = value as OnboardingState[K];

            // If current_trl or current_crl are changed, ensure at least one evidence matches the new level
            if (field === 'current_trl' && typeof value === 'number') {
                const currentTrlValue = value as number;
                const hasMatchingTrlEvidence = state.evidences.some(e => e.type === 'TRL' && e.level <= currentTrlValue);

                if (!hasMatchingTrlEvidence && currentTrlValue > 0) {
                    // Update an existing TRL evidence or add a new one
                    const existingTrlIndex = state.evidences.findIndex(e => e.type === 'TRL');
                    if (existingTrlIndex !== -1) {
                        state.evidences[existingTrlIndex].level = currentTrlValue;
                    } else {
                        state.evidences.push({
                            type: 'TRL',
                            level: currentTrlValue,
                            description: '',
                            file_url: '',
                        });
                    }
                }
            } else if (field === 'current_crl' && typeof value === 'number') {
                const currentCrlValue = value as number;
                const hasMatchingCrlEvidence = state.evidences.some(e => e.type === 'CRL' && e.level <= currentCrlValue);

                if (!hasMatchingCrlEvidence && currentCrlValue > 0) {
                    // Update an existing CRL evidence or add a new one
                    const existingCrlIndex = state.evidences.findIndex(e => e.type === 'CRL');
                    if (existingCrlIndex !== -1) {
                        state.evidences[existingCrlIndex].level = currentCrlValue;
                    } else {
                        state.evidences.push({
                            type: 'CRL',
                            level: currentCrlValue,
                            description: '',
                            file_url: '',
                        });
                    }
                }
            }
        }));
    },

    setFinancialProjection: (quarter, field, value) => {
        set(produce((state: OnboardingState) => {
            if (!state.financial_projections) {
                state.financial_projections = {
                    q1: { revenue: 0, cogs: 0, opex: 0 },
                    q2: { revenue: 0, cogs: 0, opex: 0 },
                    q3: { revenue: 0, cogs: 0, opex: 0 },
                    q4: { revenue: 0, cogs: 0, opex: 0 },
                };
            }
            state.financial_projections[quarter][field] = value;
        }));
    },

    // Evidence actions
    addEvidence: (type) => {
        set(produce((state: OnboardingState) => {
            const level = type === 'TRL' ? state.current_trl : state.current_crl || 1;
            state.evidences.push({
                type: type,
                level: level,
                description: '',
                file_url: '',
            });
        }));
    },

    updateEvidence: (index, evidence) => {
        set(produce((state: OnboardingState) => {
            if (state.evidences[index]) {
                state.evidences[index] = {
                    ...state.evidences[index],
                    ...evidence
                };
            }
        }));
    },

    removeEvidence: (index) => {
        set(produce((state: OnboardingState) => {
            state.evidences.splice(index, 1);
        }));
    },

    // Financial Data actions
    addFinancialData: () => {
        set(produce((state: OnboardingState) => {
            state.financial_data.push({
                period_date: new Date().toISOString().split('T')[0], // Default to current date
                revenue: 0,
                costs: 0,
                cash_balance: 0,
                monthly_burn: 0,
            });
        }));
    },
    updateFinancialData: (index, data) => {
        set(produce((state: OnboardingState) => {
            if (state.financial_data[index]) {
                state.financial_data[index] = {
                    ...state.financial_data[index],
                    ...data,
                };
            }
        }));
    },
    removeFinancialData: (index) => {
        set(produce((state: OnboardingState) => {
            state.financial_data.splice(index, 1);
        }));
    },

    // Investor actions
    addInvestor: () => {
        set(produce((state: OnboardingState) => {
            state.investors.push({
                investor_name: '',
                investor_email: '',
                stage: 'CONTACTED',
                ticket_size: 0,
            });
        }));
    },
    updateInvestor: (index, investor) => {
        set(produce((state: OnboardingState) => {
            if (state.investors[index]) {
                state.investors[index] = {
                    ...state.investors[index],
                    ...investor,
                };
            }
        }));
    },
    removeInvestor: (index) => {
        set(produce((state: OnboardingState) => {
            state.investors.splice(index, 1);
        }));
    },

    // Navigation
    setCurrentStep: (step) => {
        set({ currentStep: step });
    },

    // Submit onboarding
    submitOnboarding: async () => {
        const state = get();
        set({ isSaving: true });

        try {
            // Build payload with only non-empty/relevant data
            const payload: any = {
                // Step 0: Company basics (always required)
                company_name: state.company_name,
                industry: state.industry,

                // Step 1: TRL/CRL (always required)
                current_trl: state.current_trl,
                current_crl: state.current_crl,
            };

            // Transform evidences into readiness_levels
            if (state.evidences && state.evidences.length > 0) {
                const readinessLevelsMap = new Map<string, any>();

                state.evidences.forEach(evidence => {
                    const key = `${evidence.type}-${evidence.level}`;
                    if (!readinessLevelsMap.has(key)) {
                        readinessLevelsMap.set(key, {
                            type: evidence.type,
                            level: evidence.level,
                            title: evidence.title || `${evidence.type} Level ${evidence.level}`,
                            subtitle: evidence.subtitle || '',
                            evidences: []
                        });
                    }

                    const levelObj = readinessLevelsMap.get(key);
                    levelObj.evidences.push({
                        description: evidence.description,
                        file_url: evidence.file_url
                    });
                });

                payload.readiness_levels = Array.from(readinessLevelsMap.values());
            }

            // Only include incubator_ids if they exist
            if (state.incubator_ids && state.incubator_ids.length > 0) {
                // Convert to numbers as the backend likely expects IDs
                payload.incubator_ids = state.incubator_ids.map(id => Number(id));
            }

            console.log('Submitting onboarding payload:', JSON.stringify(payload, null, 2));

            const response = await completeOnboarding(payload as OnboardingWizardPayload);

            set({ isSaving: false });
            toast.success('Onboarding completed successfully!');
            console.log('Onboarding response:', response);

            // Update AuthStore to reflect onboarding completion
            const { setOnboardingComplete } = useAuthStore.getState(); // Get method from AuthStore
            setOnboardingComplete(true); // Set onboarding_complete to true

            return true;
        } catch (error: any) {
            console.error("Failed to submit onboarding:", error);
            set({ isSaving: false });

            const displayValidationErrors = (errors: any) => {
                if (typeof errors === 'object') {
                    for (const key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            const messages = errors[key];
                            if (Array.isArray(messages)) {
                                messages.forEach((msg: any) => {
                                    if (typeof msg === 'object' && msg.string) { // For ErrorDetail objects
                                        toast.error(`${key}: ${msg.string}`);
                                    } else if (typeof msg === 'string') { // For simple string messages
                                        toast.error(`${key}: ${msg}`);
                                    } else { // For nested errors
                                        displayValidationErrors(msg);
                                    }
                                });
                            } else if (typeof messages === 'object' && messages.string) {
                                toast.error(`${key}: ${messages.string}`);
                            } else if (typeof messages === 'object') { // Handle non-array nested objects
                                displayValidationErrors(messages);
                            } else if (typeof messages === 'string') {
                                toast.error(`${key}: ${messages}`);
                            }
                        }
                    }
                }
            };

            // Handle validation errors
            if (error.response?.data) {
                const errorData = error.response.data;
                displayValidationErrors(errorData);
            } else {
                toast.error('Failed to submit onboarding.');
            }

            return false;
        }
    },
}));

export default useOnboardingStore;
