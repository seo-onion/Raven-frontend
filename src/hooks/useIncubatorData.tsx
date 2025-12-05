import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyIncubatorData, completeIncubatorOnboarding, fetchIncubatorInvestments, commitInvestment, fetchIncubatorMembers, createIncubatorMember, fetchChallenges, createChallenge, updateChallengeStatus, fetchChallengeApplications, fetchMentoringSessions, type IncubatorOnboardingDTO } from '@/api/incubator';
import useAuthStore from '@/stores/AuthStore';

// =============================================================================
// Query Keys
// =============================================================================
export const INCUBATOR_KEYS = {
    all: ['incubator'] as const,
    data: () => [...INCUBATOR_KEYS.all, 'data'] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch the authenticated incubator's data
 */
export const useIncubatorData = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: INCUBATOR_KEYS.data(),
        queryFn: fetchMyIncubatorData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        ...options
    });
};

/**
 * Hook to complete incubator onboarding
 */
export const useIncubatorOnboarding = () => {
    const queryClient = useQueryClient();
    const updateUser = useAuthStore((state) => state.updateUser);

    return useMutation({
        mutationFn: (data: IncubatorOnboardingDTO) => completeIncubatorOnboarding(data),
        onSuccess: (_data, variables) => {
            // Update AuthStore with new name and onboarding status
            updateUser({
                name: variables.name,
                onboarding_complete: true
            });

            // Invalidate incubator data to trigger a refetch
            queryClient.invalidateQueries({ queryKey: INCUBATOR_KEYS.data() });
        },
    });
};

/**
 * Hook to fetch incubator investments
 */
export const useIncubatorInvestments = () => {
    return useQuery({
        queryKey: ['incubator', 'investments'],
        queryFn: fetchIncubatorInvestments,
    });
};

/**
 * Hook to fetch incubator members
 */
export const useIncubatorMembers = () => {
    return useQuery({
        queryKey: ['incubator', 'members'],
        queryFn: fetchIncubatorMembers,
    });
};

/**
 * Hook to create a new incubator member
 */
export const useCreateIncubatorMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createIncubatorMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INCUBATOR_KEYS.data() });
        },
    });
};

/**
 * Hook to commit to an investment
 */
export const useCommitInvestment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commitInvestment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incubator', 'investments'] });
        },
    });
};
/**
 * Hook to fetch challenges
 */
export const useChallenges = () => {
    return useQuery({
        queryKey: ['challenges'],
        queryFn: fetchChallenges,
    });
};

/**
 * Hook to create a challenge
 */
export const useCreateChallenge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createChallenge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        },
    });
};

/**
 * Hook to update challenge status
 */
export const useUpdateChallengeStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: 'OPEN' | 'CONCLUDED' }) => updateChallengeStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        },
    });
};

/**
 * Hook to fetch challenge applications
 */
export const useChallengeApplications = () => {
    return useQuery({
        queryKey: ['challenge-applications'],
        queryFn: fetchChallengeApplications,
    });
};

/**
 * Hook to fetch mentoring sessions
 */
export const useMentoringSessions = () => {
    return useQuery({
        queryKey: ['mentoring-sessions'],
        queryFn: fetchMentoringSessions,
    });
};
