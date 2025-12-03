import axiosInstance from './axiosInstance';
import type {
    OnboardingWizardPayload,
    OnboardingWizardResponse
} from '@/types/onboarding';

const API_BASE_URL = '/api/users';

/**
 * Submits the complete onboarding wizard data.
 * This endpoint replaces all mock data with real startup information.
 *
 * @param payload - Complete onboarding wizard data
 * @returns Response with confirmation and counts
 */
export const completeOnboarding = async (
    payload: OnboardingWizardPayload
): Promise<OnboardingWizardResponse> => {
    const response = await axiosInstance.post<OnboardingWizardResponse>(
        `${API_BASE_URL}/startup/complete-onboarding/`,
        payload
    );
    return response.data;
};
