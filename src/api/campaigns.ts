import axiosInstance from './axiosInstance';
import type { CampaignData, CampaignDataWithFinancialsDTO, FinancialsUpdateDTO } from '@/types/campaigns';


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

/**
 * Fetches the campaign data with detailed financials.
 */
export const fetchCampaignFinancials = async (): Promise<CampaignDataWithFinancialsDTO> => {
    const response = await axiosInstance.get<CampaignDataWithFinancialsDTO>(`${API_BASE_URL}/my-campaign/`);
    return response.data;
};

/**
 * Updates campaign financials data (PATCH).
 * @param campaignId - The ID of the campaign to update.
 * @param data - The financial data to update (FinancialsUpdateDTO).
 * @returns Updated campaign data.
 */
export const updateCampaignFinancials = async (
    campaignId: number,
    data: FinancialsUpdateDTO
): Promise<CampaignDataWithFinancialsDTO> => {
    const response = await axiosInstance.patch<CampaignDataWithFinancialsDTO>(
        `${API_BASE_URL}/${campaignId}/financials/`,
        data
    );
    return response.data;
};

/**
 * Fetches the campaign data with detailed financials for a specific startup.
 * Used by incubators to view startup financial data.
 * @param startupId - The ID of the startup.
 */
export const fetchStartupCampaignFinancials = async (startupId: number): Promise<CampaignDataWithFinancialsDTO> => {
    const response = await axiosInstance.get<CampaignDataWithFinancialsDTO>(
        `${API_BASE_URL}/startup/${startupId}/`
    );
    return response.data;
};
