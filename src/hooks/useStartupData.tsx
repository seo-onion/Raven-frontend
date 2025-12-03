import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { EVIDENCE_BASE_PATH } from '../api/axiosInstance'; // Import EVIDENCE_BASE_PATH
import type { StartupData, Evidence, FinancialData, InvestorPipeline } from '../types/startup';
import type { InvestmentRound, Investor } from '../types/campaigns';
import type { EvidenceData } from '../types/onboarding'; // Import EvidenceData for creation

// =============================================================================
// Fetch Functions
// =============================================================================

const fetchStartupData = async (): Promise<StartupData> => {
    const response = await axiosInstance.get('/api/users/startup/data/');
    return response.data;
};

const fetchEvidences = async (): Promise<Evidence[]> => {
    const response = await axiosInstance.get('/api/users/startup/evidences/');
    return response.data.results;
};

const fetchFinancialData = async (): Promise<FinancialData[]> => {
    const response = await axiosInstance.get('/api/users/startup/financial-data/');
    return response.data;
};

const fetchInvestors = async (): Promise<InvestorPipeline[]> => {
    const response = await axiosInstance.get('/api/users/startup/investors/');
    return response.data;
};

const fetchInvestmentRounds = async (): Promise<InvestmentRound[]> => {
    const response = await axiosInstance.get('/api/users/startup/rounds/');
    return response.data.results;
};

const createInvestmentRound = async (roundData: Partial<InvestmentRound>): Promise<InvestmentRound> => {
    const response = await axiosInstance.post('/api/users/startup/rounds/', roundData);
    return response.data;
};

const addInvestorToRound = async ({ roundId, investor }: { roundId: number, investor: Partial<Investor> }): Promise<Investor> => {
    const response = await axiosInstance.post(`/api/users/startup/rounds/${roundId}/investors/`, investor);
    return response.data;
};

// Evidence API functions
const createEvidence = async ({ evidenceData, evidenceId }: { evidenceData: Omit<EvidenceData, 'id'>, evidenceId?: number }): Promise<Evidence> => {
    if (evidenceId) {
        const response = await axiosInstance.put(`${EVIDENCE_BASE_PATH}${evidenceId}/`, evidenceData);
        return response.data;
    } else {
        const response = await axiosInstance.post(EVIDENCE_BASE_PATH, evidenceData);
        return response.data;
    }
};

const deleteEvidence = async (evidenceId: number): Promise<void> => {
    await axiosInstance.delete(`${EVIDENCE_BASE_PATH}${evidenceId}/`);
};


// =============================================================================
// React Query Hooks
// =============================================================================

/**
 * Hook to fetch startup basic data (company name, industry, etc.)
 */
export const useStartupData = () => {
    return useQuery({
        queryKey: ['startup-data'],
        queryFn: fetchStartupData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Hook to fetch all evidences (TRL/CRL data)
 */
export const useEvidences = () => {
    return useQuery({
        queryKey: ['evidences'],
        queryFn: fetchEvidences,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to fetch all financial data
 */
export const useFinancialData = () => {
    return useQuery({
        queryKey: ['financial-data'],
        queryFn: fetchFinancialData,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to fetch investor pipeline
 */
export const useInvestors = () => {
    return useQuery({
        queryKey: ['investors'],
        queryFn: fetchInvestors,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to fetch investment rounds
 */
export const useInvestmentRounds = () => {
    return useQuery({
        queryKey: ['investment-rounds'],
        queryFn: fetchInvestmentRounds,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Hook to create a new investment round
 */
export const useCreateInvestmentRound = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createInvestmentRound,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['investment-rounds'] });
        },
    });
};

/**
 * Hook to add a new investor to a round
 */
export const useAddInvestorToRound = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addInvestorToRound,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['investment-rounds'] });
        },
    });
};

/**
 * Hook to create/update an evidence
 */
export const useCreateEvidence = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ evidenceData, evidenceId }: { evidenceData: Omit<EvidenceData, 'id'>, evidenceId?: number }) => createEvidence({ evidenceData, evidenceId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evidences'] });
            queryClient.invalidateQueries({ queryKey: ['startup-data'] }); // Invalidate startup data to update TRL/CRL levels
        },
    });
};

/**
 * Hook to delete an evidence
 */
export const useDeleteEvidence = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEvidence,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evidences'] });
            queryClient.invalidateQueries({ queryKey: ['startup-data'] }); // Invalidate startup data to update TRL/CRL levels
        },
    });
};
