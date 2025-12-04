import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { EVIDENCE_BASE_PATH, READINESS_LEVEL_BASE_PATH } from '../api/axiosInstance'; // Import EVIDENCE_BASE_PATH and READINESS_LEVEL_BASE_PATH
import type { StartupData, Evidence, FinancialData, Incubator, ReadinessLevel, IncubatorMember } from '../types/startup';
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

const fetchInvestors = async (): Promise<Incubator[]> => {
    const response = await axiosInstance.get('/api/users/startup/associate-incubator/');
    return response.data;
};

const fetchInvestmentRounds = async (): Promise<InvestmentRound[]> => {
    const response = await axiosInstance.get('/api/users/startup/rounds/');
    return response.data.results;
};

const fetchAssociatedIncubators = async (): Promise<Incubator[]> => {
    try {
        // Try to fetch from the startup data endpoint first
        // The startup data includes associated incubators via the ManyToMany relationship
        const response = await axiosInstance.get('/api/users/startup/data/');
        if (response.data.incubators && Array.isArray(response.data.incubators)) {
            return response.data.incubators;
        }
        // If not available in startup data, return empty array
        // Backend can implement a dedicated endpoint if needed
        return [];
    } catch (error) {
        console.error('Error fetching associated incubators:', error);
        return [];
    }
};

const fetchAvailableIncubators = async (): Promise<Incubator[]> => {
    const response = await axiosInstance.get('/api/users/incubators/list_all/');
    return response.data.results || response.data;
};

const associateIncubatoWithStartup = async (incubatorIds: number[]): Promise<void> => {
    const response = await axiosInstance.post('/api/users/startup/associate-incubator/associate/', {
        incubator_ids: incubatorIds
    });
    return response.data;
};

import { createRound } from '../api/rounds';
import { applyToChallenge } from '../api/incubator';
import type { RoundCreateDTO } from '../types/campaigns';

const createInvestmentRound = async (roundData: RoundCreateDTO): Promise<InvestmentRound> => {
    return createRound(roundData);
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

// Readiness Level API functions
const fetchReadinessLevels = async (): Promise<ReadinessLevel[]> => {
    const response = await axiosInstance.get(READINESS_LEVEL_BASE_PATH);
    return response.data.results || response.data;
};

const createReadinessLevel = async (levelData: Omit<ReadinessLevel, 'id' | 'created' | 'updated'>): Promise<ReadinessLevel> => {
    const response = await axiosInstance.post(READINESS_LEVEL_BASE_PATH, levelData);
    return response.data;
};

const updateReadinessLevel = async (readinessLevelId: number, levelData: Partial<ReadinessLevel>): Promise<ReadinessLevel> => {
    const response = await axiosInstance.put(`${READINESS_LEVEL_BASE_PATH}${readinessLevelId}/`, levelData);
    return response.data;
};

const deleteReadinessLevel = async (readinessLevelId: number): Promise<void> => {
    await axiosInstance.delete(`${READINESS_LEVEL_BASE_PATH}${readinessLevelId}/`);
};

// Mentor API functions
const fetchMentors = async (): Promise<IncubatorMember[]> => {
    try {
        const incubatorsResponse = await axiosInstance.get('/api/users/startup/data/');
        const incubators = incubatorsResponse.data.incubators || [];

        // Collect all mentors from associated incubators
        const mentors: IncubatorMember[] = [];
        const seenMentorIds = new Set<number>();

        for (const incubator of incubators) {
            if (incubator.members) {
                for (const member of incubator.members) {
                    // Only include mentors (role is MENTOR or BOTH) and avoid duplicates
                    if ((member.role === 'MENTOR' || member.role === 'BOTH') && !seenMentorIds.has(member.id)) {
                        mentors.push(member);
                        seenMentorIds.add(member.id);
                    }
                }
            }
        }

        return mentors;
    } catch (error) {
        console.error('Error fetching mentors:', error);
        return [];
    }
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
 * Hook to fetch associated incubators for the startup
 */
export const useAssociatedIncubators = () => {
    return useQuery({
        queryKey: ['associated-incubators'],
        queryFn: fetchAssociatedIncubators,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to fetch all available incubators for selection
 */
export const useAvailableIncubators = () => {
    return useQuery({
        queryKey: ['available-incubators'],
        queryFn: fetchAvailableIncubators,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to associate incubators with the startup
 */
export const useAssociateIncubator = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: associateIncubatoWithStartup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['associated-incubators'] });
            queryClient.invalidateQueries({ queryKey: ['investors'] });
        },
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

/**
 * Hook to fetch readiness levels (TRL/CRL definitions)
 */
export const useReadinessLevels = () => {
    return useQuery({
        queryKey: ['readiness-levels'],
        queryFn: fetchReadinessLevels,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to create a new readiness level
 */
export const useCreateReadinessLevel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createReadinessLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['readiness-levels'] });
        },
    });
};

/**
 * Hook to update a readiness level
 */
export const useUpdateReadinessLevel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ readinessLevelId, levelData }: { readinessLevelId: number; levelData: Partial<ReadinessLevel> }) =>
            updateReadinessLevel(readinessLevelId, levelData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['readiness-levels'] });
        },
    });
};

/**
 * Hook to delete a readiness level
 */
export const useDeleteReadinessLevel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReadinessLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['readiness-levels'] });
            queryClient.invalidateQueries({ queryKey: ['evidences'] });
        },
    });
};

/**
 * Hook to fetch mentors from associated incubators
 */
export const useMentors = () => {
    return useQuery({
        queryKey: ['mentors'],
        queryFn: fetchMentors,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to apply to a challenge
 */
export const useApplyToChallenge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: applyToChallenge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenge-applications'] });
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        },
    });
};
