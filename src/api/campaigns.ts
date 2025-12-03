import axiosInstance from './axiosInstance';
import type { CampaignData } from '@/types/campaigns';


const API_BASE_URL = '/api/campaigns';

/**
 * Fetches the campaign data for the logged-in user's startup.
 */
export const fetchMyCampaign = async (): Promise<CampaignData> => {
    const response = await axiosInstance.get<CampaignData>(`${API_BASE_URL}/my-campaign/`);
    return response.data;
};

/**
 * Updates a campaign (partial updates are allowed).
 * @param campaignId - The ID of the campaign to update.
 * @param data - The data to update.
 */
export const updateCampaign = async (campaignId: number, data: Partial<CampaignData>): Promise<CampaignData> => {
    const response = await axiosInstance.patch<CampaignData>(`${API_BASE_URL}/${campaignId}/`, data);
    return response.data;
};

/**
 * Submits the campaign for review.
 * @param campaignId - The ID of the campaign to submit.
 */
export const submitCampaign = async (campaignId: number): Promise<CampaignData> => {
    const response = await axiosInstance.post<CampaignData>(`${API_BASE_URL}/${campaignId}/submit/`);
    return response.data;
};
