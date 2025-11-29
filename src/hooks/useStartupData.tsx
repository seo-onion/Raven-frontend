import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import type { StartupData, Evidence, FinancialData, InvestorPipeline } from '../types/startup';

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
