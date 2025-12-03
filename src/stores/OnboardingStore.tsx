import { create } from 'zustand';
import { produce } from 'immer';
import toast from 'react-hot-toast';
import type {
    OnboardingFormState,
    EvidenceData,
    OnboardingWizardPayload
} from '@/types/onboarding';
import type { CampaignFinancials, InvestmentRound, Investor } from '../types/campaigns';
import { completeOnboarding } from '@/api/onboarding';
import { fetchMyCampaign } from '@/api/campaigns';

interface OnboardingState extends OnboardingFormState {
    currentStep: number;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    financials: CampaignFinancials | null;
}

interface OnboardingActions {
    loadCampaign: () => Promise<void>;
    setField: <K extends keyof OnboardingFormState>(field: K, value: OnboardingFormState[K]) => void;
    setFinancialsField: <K extends keyof CampaignFinancials>(field: K, value: CampaignFinancials[K]) => void;
    setFinancialProjectionField: (quarter: 'q1' | 'q2' | 'q3' | 'q4', field: 'revenue' | 'cogs' | 'opex', value: number) => void;

    // Evidence actions
    addEvidence: (type: 'TRL' | 'CRL') => void;
    updateEvidence: (index: number, evidence: Partial<EvidenceData>) => void;
    removeEvidence: (index: number) => void;

    // Round actions
    addRound: () => void;
    updateRound: (roundIndex: number, round: Partial<InvestmentRound>) => void;
    removeRound: (roundIndex: number) => void;

    // Investor actions
    addInvestorToRound: (roundIndex: number) => void;
    updateInvestorInRound: (roundIndex: number, investorIndex: number, investor: Partial<Investor>) => void;
    removeInvestorFromRound: (roundIndex: number, investorIndex: number) => void;

    // Navigation
    setCurrentStep: (step: number) => void;

    // Submit
    submitOnboarding: () => Promise<boolean>;
}

const initialFinancials: CampaignFinancials = {
    funding_goal: 0,
    valuation: 0,
    usage_of_funds: '',
    revenue_history: {},
    pre_money_valuation: 0,
    current_cash_balance: 0,
    monthly_burn_rate: 0,
    financial_projections: {
        q1: { revenue: 0, cogs: 0, opex: 0 },
        q2: { revenue: 0, cogs: 0, opex: 0 },
        q3: { revenue: 0, cogs: 0, opex: 0 },
        q4: { revenue: 0, cogs: 0, opex: 0 },
    },
    rounds: [{ name: 'Current Round', target: 0, valuation: 0, investors: [] }],
};

const initialState: OnboardingState = {
    // Company basics (from campaign)
    company_name: '',
    industry: '',

    // TRL/CRL
    current_trl: 1,
    current_crl: null,
    evidences: [],

    // Financials
    financials: initialFinancials,

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
            const data = await fetchMyCampaign();
            set(produce((state: OnboardingState) => {
                state.company_name = data.problem || '';
                state.industry = data.solution || '';
                state.financials = data.financials ? { ...initialFinancials, ...data.financials } : initialFinancials;
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
        }));
    },

    setFinancialsField: (field, value) => {
        set(produce((state: OnboardingState) => {
            if (state.financials) {
                state.financials[field] = value;
            }
        }));
    },

    setFinancialProjectionField: (quarter, field, value) => {
        set(produce((state: OnboardingState) => {
            if (state.financials) {
                state.financials.financial_projections[quarter][field] = value;
            }
        }));
    },

    // Evidence actions
    addEvidence: (type) => {
        set(produce((state: OnboardingState) => {
            state.evidences.push({
                type: type,
                level: 1,
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

    // Round actions
    addRound: () => {
        set(produce((state: OnboardingState) => {
            state.financials?.rounds.push({
                name: 'New Round',
                target: 0,
                valuation: 0,
                investors: [],
            });
        }));
    },

    updateRound: (roundIndex, round) => {
        set(produce((state: OnboardingState) => {
            if (state.financials?.rounds[roundIndex]) {
                state.financials.rounds[roundIndex] = {
                    ...state.financials.rounds[roundIndex],
                    ...round,
                };
            }
        }));
    },

    removeRound: (roundIndex) => {
        set(produce((state: OnboardingState) => {
            state.financials?.rounds.splice(roundIndex, 1);
        }));
    },

    // Investor actions
    addInvestorToRound: (roundIndex) => {
        set(produce((state: OnboardingState) => {
            state.financials?.rounds[roundIndex].investors.push({
                name: '',
                email: '',
                amount: 0,
                status: 'CONTACTED',
            });
        }));
    },

    updateInvestorInRound: (roundIndex, investorIndex, investor) => {
        set(produce((state: OnboardingState) => {
            if (state.financials?.rounds[roundIndex]?.investors[investorIndex]) {
                state.financials.rounds[roundIndex].investors[investorIndex] = {
                    ...state.financials.rounds[roundIndex].investors[investorIndex],
                    ...investor,
                };
            }
        }));
    },

    removeInvestorFromRound: (roundIndex, investorIndex) => {
        set(produce((state: OnboardingState) => {
            state.financials?.rounds[roundIndex].investors.splice(investorIndex, 1);
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
            // Build payload according to backend expectations
            const payload: OnboardingWizardPayload = {
                company_name: state.company_name,
                industry: state.industry,
                current_trl: state.current_trl,
                current_crl: state.current_crl,
                evidences: state.evidences.filter(e => e.description.trim() !== ''),
                financials: state.financials,
            };

            const response = await completeOnboarding(payload);

            set({ isSaving: false });
            toast.success('Onboarding completed successfully!');
            console.log('Onboarding response:', response);
            return true;
        } catch (error: any) {
            console.error("Failed to submit onboarding:", error);
            set({ isSaving: false });

            // Handle validation errors
            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'object') {
                    Object.keys(errorData).forEach(key => {
                        const messages = errorData[key];
                        if (Array.isArray(messages)) {
                            messages.forEach(msg => toast.error(`${key}: ${msg}`));
                        }
                    });
                } else {
                    toast.error('Failed to submit onboarding.');
                }
            }
            else {
                toast.error('Failed to submit onboarding.');
            }

            return false;
        }
    },
}));

export default useOnboardingStore;
