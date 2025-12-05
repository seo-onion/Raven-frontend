import axiosInstance, {
    INCUBATOR_DATA_PATH,
    INCUBATOR_ONBOARDING_PATH,
    INCUBATOR_MEMBERS_PATH,
    CHALLENGES_PATH,
    CHALLENGE_APPLICATIONS_PATH,
    INCUBATOR_INVESTMENTS_PATH,
    INCUBATOR_PORTFOLIO_CAMPAIGNS_PATH,
    INCUBATOR_PORTFOLIO_EVIDENCES_PATH,
    MENTORING_SESSIONS_PATH
} from './axiosInstance';

// =============================================================================
// Interfaces
// =============================================================================

import { type StartupData } from '../types/startup';

export interface InvestmentDTO {
    id: number;
    round: number;
    round_name: string;
    startup_id: number;
    startup_name: string;
    logo_url: string | null;
    amount: number;
    status: 'CONTACTED' | 'COMMITTED' | 'REJECTED' | 'NEGOTIATING' | 'MEETING_SCHEDULED';
    created: string;
    updated: string;
}

export interface IncubatorMemberDTO {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    role: 'INVESTOR' | 'MENTOR' | 'BOTH';
    created: string;
    updated: string;
}

export interface IncubatorOnboardingDTO {
    name: string;
    description?: string;
    logo_url?: string;
}

export interface IncubatorDTO {
    id: number;
    name: string;
    description: string;
    logo_url?: string;
    profile_complete: boolean;
    members: IncubatorMemberDTO[];
    startups: any[]; // Legacy field, might be removed later
    portfolio_startups: StartupData[];
    created: string;
    updated: string;
}

export interface ChallengeDTO {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    budget?: string | number;
    deadline?: string;
    required_technologies: string;
    status: 'OPEN' | 'CONCLUDED';
    applicant_count: number;
    created: string;
    updated: string;
}

// =============================================================================
// API Functions
// =============================================================================

export interface MentoringSessionDTO {
    id: number;
    title: string;
    mentor_name: string;
    start_time: string; // ISO string
    end_time: string; // ISO string
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    meeting_link?: string;
}

/**
 * Fetch data for the authenticated incubator
 */
export const fetchMyIncubatorData = async (): Promise<IncubatorDTO> => {
    const response = await axiosInstance.get<IncubatorDTO>(INCUBATOR_DATA_PATH);
    return response.data;
};

/**
 * Complete onboarding for an incubator
 */
export const completeIncubatorOnboarding = async (data: IncubatorOnboardingDTO): Promise<{ detail: string; incubator: IncubatorDTO }> => {
    const response = await axiosInstance.post<{ detail: string; incubator: IncubatorDTO }>(INCUBATOR_ONBOARDING_PATH, data);
    return response.data;
};

/**
 * Get list of members for the authenticated incubator
 */
export const fetchIncubatorMembers = async (): Promise<IncubatorMemberDTO[]> => {
    const response = await axiosInstance.get<IncubatorMemberDTO[]>(INCUBATOR_MEMBERS_PATH);
    return response.data;
};

/**
 * Create a new incubator member
 */
export const createIncubatorMember = async (data: Partial<IncubatorMemberDTO>): Promise<IncubatorMemberDTO> => {
    const response = await axiosInstance.post<IncubatorMemberDTO>(INCUBATOR_MEMBERS_PATH, data);
    return response.data;
};

/**
 * Get list of challenges
 */
export const fetchChallenges = async (): Promise<ChallengeDTO[]> => {
    const response = await axiosInstance.get<any>(CHALLENGES_PATH);
    return response.data.results || response.data;
};

/**
 * Create a new challenge (Incubator only)
 */
export const createChallenge = async (data: Partial<ChallengeDTO>): Promise<ChallengeDTO> => {
    const response = await axiosInstance.post<ChallengeDTO>(CHALLENGES_PATH, data);
    return response.data;
};

/**
 * Update challenge status
 */
export const updateChallengeStatus = async (id: number, status: 'OPEN' | 'CONCLUDED'): Promise<ChallengeDTO> => {
    const response = await axiosInstance.patch<ChallengeDTO>(`${CHALLENGES_PATH}${id}/`, { status });
    return response.data;
};

export interface ChallengeApplicationDTO {
    id: number;
    challenge: number;
    startup: number;
    startup_name: string;
    text_solution: string;
    created: string;
    updated: string;
}

export const fetchChallengeApplications = async (): Promise<ChallengeApplicationDTO[]> => {
    const response = await axiosInstance.get<any>(CHALLENGE_APPLICATIONS_PATH);
    return response.data.results || response.data;
};

export const applyToChallenge = async (data: Partial<ChallengeApplicationDTO>): Promise<ChallengeApplicationDTO> => {
    const response = await axiosInstance.post<ChallengeApplicationDTO>(CHALLENGE_APPLICATIONS_PATH, data);
    return response.data;
};

/**
 * Fetch incubator investments
 */
export const fetchIncubatorInvestments = async (): Promise<InvestmentDTO[]> => {
    const response = await axiosInstance.get<any>(INCUBATOR_INVESTMENTS_PATH);
    return response.data.results || response.data;
};

/**
 * Commit to an investment
 */
export const commitInvestment = async (id: number): Promise<InvestmentDTO> => {
    const response = await axiosInstance.post<InvestmentDTO>(`${INCUBATOR_INVESTMENTS_PATH}${id}/commit/`);
    return response.data;
};

/**
 * Fetch mentoring sessions
 */
export const fetchMentoringSessions = async (): Promise<MentoringSessionDTO[]> => {
    const response = await axiosInstance.get<any>(MENTORING_SESSIONS_PATH);
    return response.data.results || response.data;
};

// =============================================================================
// Portfolio Campaigns (for Metrics Page)
// =============================================================================

export interface PortfolioCampaignFinancials {
    funding_goal: number | null;
    total_capital_injection: number | null;
    monthly_burn_rate: number | null;
    current_cash_balance: number | null;
    pre_money_valuation: number | null;
}

export interface PortfolioCampaignDTO {
    id: number;
    startup_id: number;
    startup_name: string;
    logo_url: string | null;
    industry: string;
    trl_level: number | null;
    crl_level: number | null;
    campaign: {
        id: number;
        status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
        financials: PortfolioCampaignFinancials | null;
    } | null;
    created: string;
    updated: string;
}

/**
 * Fetch portfolio campaigns for the authenticated incubator (for Metrics page)
 */
export const fetchPortfolioCampaigns = async (): Promise<PortfolioCampaignDTO[]> => {
    const response = await axiosInstance.get<any>(INCUBATOR_PORTFOLIO_CAMPAIGNS_PATH);
    return response.data.results || response.data;
};

// =============================================================================
// Portfolio Evidences (for TRL/CRL Review Page)
// =============================================================================

export interface PortfolioEvidenceDTO {
    id: number;
    startup_id: number;
    startup_name: string;
    logo_url: string | null;
    type: 'TRL' | 'CRL';
    level: number;
    description?: string;
    file_url?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewer_notes?: string;
    created: string;
    updated: string;
}

export interface ReviewEvidenceRequest {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewer_notes?: string;
}

/**
 * Fetch all evidences from portfolio startups (for Incubator TRL/CRL Review page)
 */
export const fetchPortfolioEvidences = async (): Promise<PortfolioEvidenceDTO[]> => {
    const response = await axiosInstance.get<any>(INCUBATOR_PORTFOLIO_EVIDENCES_PATH);
    return response.data.results || response.data;
};

/**
 * Review (approve/reject) an evidence
 * @param evidenceId - The ID of the evidence to review
 * @param data - Status and optional reviewer notes
 */
export const reviewEvidence = async (
    evidenceId: number,
    data: ReviewEvidenceRequest
): Promise<PortfolioEvidenceDTO> => {
    const response = await axiosInstance.post<PortfolioEvidenceDTO>(
        `${INCUBATOR_PORTFOLIO_EVIDENCES_PATH}${evidenceId}/review/`,
        data
    );
    return response.data;
};
