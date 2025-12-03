import { create } from 'zustand';
import { produce } from 'immer';
import toast from 'react-hot-toast';
import type { CampaignData, CampaignTeamMember, CampaignTraction } from '@/types/campaigns';
import { fetchMyCampaign, updateCampaign, submitCampaign } from '@/api/campaigns';

interface CampaignState {
    campaignData: CampaignData | null;
    currentStep: number;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
}

interface CampaignActions {
    loadCampaign: () => Promise<void>;
    setField: <K extends keyof CampaignData>(field: K, value: CampaignData[K]) => void;
    setNestedField: <T extends 'financials' | 'legal', K extends keyof NonNullable<CampaignData[T]>>(
        nestedKey: T,
        field: K,
        value: NonNullable<CampaignData[T]>[K]
    ) => void;
    addTeamMember: (member: CampaignTeamMember) => void;
    updateTeamMember: (index: number, member: Partial<CampaignTeamMember>) => void;
    removeTeamMember: (index: number) => void;
    addTraction: (traction: CampaignTraction) => void;
    updateTraction: (index: number, traction: Partial<CampaignTraction>) => void;
    removeTraction: (index: number) => void;
    setFileUrl: (
        model: 'financials' | 'legal' | 'team' | 'traction',
        field: string,
        url: string,
        index?: number
    ) => void;
    saveDraft: () => Promise<boolean>;
    submitApplication: () => Promise<boolean>;
    setCurrentStep: (step: number) => void;
}

const initialState: CampaignState = {
    campaignData: null,
    currentStep: 0,
    isLoading: true,
    isSaving: false,
    error: null,
};

const useCampaignStore = create<CampaignState & CampaignActions>()((set, get) => ({
    ...initialState,

    loadCampaign: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchMyCampaign();
            set({ campaignData: data, isLoading: false });
        } catch (error) {
            console.error("Failed to load campaign data:", error);
            set({ isLoading: false, error: 'Failed to load campaign data.' });
            toast.error('Failed to load campaign data.');
        }
    },

    setField: (field, value) => {
        set(produce((state: CampaignState) => {
            if (state.campaignData) {
                state.campaignData[field] = value;
            }
        }));
    },

    setNestedField: (nestedKey, field, value) => {
        set(produce((state: CampaignState) => {
            if (state.campaignData && state.campaignData[nestedKey]) {
                (state.campaignData[nestedKey] as any)[field] = value;
            }
        }));
    },

    addTeamMember: (member) => {
        set(produce((state: CampaignState) => {
            state.campaignData?.team_members.push(member);
        }));
    },

    updateTeamMember: (index, member) => {
        set(produce((state: CampaignState) => {
            if (state.campaignData?.team_members[index]) {
                state.campaignData.team_members[index] = {
                    ...state.campaignData.team_members[index],
                    ...member
                };
            }
        }));
    },

    removeTeamMember: (index) => {
        set(produce((state: CampaignState) => {
            state.campaignData?.team_members.splice(index, 1);
        }));
    },

    addTraction: (traction) => {
        set(produce((state: CampaignState) => {
            state.campaignData?.tractions.push(traction);
        }));
    },

    updateTraction: (index, traction) => {
        set(produce((state: CampaignState) => {
            if (state.campaignData?.tractions[index]) {
                state.campaignData.tractions[index] = {
                    ...state.campaignData.tractions[index],
                    ...traction,
                };
            }
        }));
    },

    removeTraction: (index) => {
        set(produce((state: CampaignState) => {
            state.campaignData?.tractions.splice(index, 1);
        }));
    },

    setFileUrl: (model, field, url, index) => {
        set(produce((state: CampaignState) => {
            if (!state.campaignData) return;

            if (model === 'team' && index !== undefined && state.campaignData.team_members[index]) {
                (state.campaignData.team_members[index] as any)[field] = url;
            } else if (model === 'traction' && index !== undefined && state.campaignData.tractions[index]) {
                (state.campaignData.tractions[index] as any)[field] = url;
            } else if (model === 'legal' && state.campaignData.legal) {
                (state.campaignData.legal as any)[field] = url;
            }
        }));
    },

    saveDraft: async () => {
        const { campaignData } = get();
        if (!campaignData || !campaignData.id) return false;

        set({ isSaving: true });
        try {
            await updateCampaign(campaignData.id, campaignData);
            set({ isSaving: false });
            toast.success('Progress saved!');
            return true;
        } catch (error) {
            console.error("Failed to save draft:", error);
            set({ isSaving: false });
            toast.error('Failed to save draft.');
            return false;
        }
    },

    submitApplication: async () => {
        const { campaignData } = get();
        if (!campaignData || !campaignData.id) return false;

        set({ isSaving: true });
        try {
            await submitCampaign(campaignData.id);
            set(produce((state: CampaignState) => {
                if (state.campaignData) {
                    state.campaignData.status = 'SUBMITTED';
                }
            }));
            set({ isSaving: false });
            toast.success('Application submitted successfully!');
            return true;
        } catch (error) {
            console.error("Failed to submit application:", error);
            set({ isSaving: false });
            toast.error('Failed to submit application.');
            return false;
        }
    },

    setCurrentStep: (step) => {
        set({ currentStep: step });
    },
}));

export default useCampaignStore;
