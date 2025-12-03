import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import type { StartupData, Evidence, FinancialData, InvestorPipeline } from '../types/startup';
import type { InvestmentRound, Investor } from '../types/campaigns';

// =============================================================================
// Fetch Functions
// =============================================================================

const fetchStartupData = async (): Promise<StartupData> => {
    const response = await axiosInstance.get('/startup/data/');
    return response.data;
};

const fetchEvidences = async (): Promise<Evidence[]> => {
    const response = await axiosInstance.get('/startup/evidences/');
    return response.data;
};

const fetchFinancialData = async (): Promise<FinancialData[]> => {
    const response = await axiosInstance.get('/startup/financial-data/');
    return response.data;
};

const fetchInvestors = async (): Promise<InvestorPipeline[]> => {
    const response = await axiosInstance.get('/startup/investors/');
    return response.data;
};

const fetchInvestmentRounds = async (): Promise<InvestmentRound[]> => {
    const response = await axiosInstance.get('/startup/rounds/');
    return response.data;
};

const createInvestmentRound = async (roundData: Partial<InvestmentRound>): Promise<InvestmentRound> => {
    const response = await axiosInstance.post('/startup/rounds/', roundData);
    return response.data;
};

const addInvestorToRound = async ({ roundId, investor }: { roundId: number, investor: Partial<Investor> }): Promise<Investor> => {
    const response = await axiosInstance.post(`/startup/rounds/${roundId}/investors/`, investor);
    return response.data;
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
