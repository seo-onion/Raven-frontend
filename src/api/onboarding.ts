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

/**
 * Fetches the list of available incubators.
 */
export const fetchIncubators = async (): Promise<any[]> => {
    // Note: The endpoint is /api/users/incubators/ based on MODEL.md if it's under users app,
    // but MODEL.md says /incubators/ is a router.
    // If it's a top level router, it might be /api/incubators/ or /api/users/incubators/.
    // MODEL.md section 2.1 lists /incubators/ under Users App urls.
    // So it should be accessible via the same base URL structure or relative to API root.
    // Assuming standard DRF router structure under /api/users/ or just /api/.
    // Let's assume /api/users/incubators/ if it's in users app urls.
    // Updated to use the list_all action as per MODEL.md
    const response = await axiosInstance.get(`${API_BASE_URL}/incubators/list_all/`);
    return response.data;
};
