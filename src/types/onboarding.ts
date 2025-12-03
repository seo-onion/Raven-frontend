import type { CampaignFinancials } from "./campaigns";

/**
 * TypeScript Interfaces for Onboarding Wizard - Phase 2
 * These interfaces match the Django backend serializers exactly
 */

// =============================================================================
// Evidence Data (Step 1: TRL/CRL)
// =============================================================================

export interface EvidenceData {
    type: 'TRL' | 'CRL'; // New field to indicate evidence type
    level: number; // Combined TRL/CRL level based on 'type'
    description: string;
    file?: File; // For file upload
    file_url?: string; // For cloud storage URL
}

export interface EvidenceResponse extends EvidenceData {
    id: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created: string;
}

// =============================================================================
// Financial Data (Step 2: Finances)
// =============================================================================

export interface FinancialData {
    period_date: string; // ISO date format: "2024-01-31"
    revenue: number;
    costs: number;
    cash_balance: number;
    monthly_burn: number;
    notes?: string;
}

export interface FinancialDataResponse extends FinancialData {
    id: number;
    net_cash_flow: number;
    created: string;
}

// =============================================================================
// Investor Data (Step 3: Investors)
// =============================================================================

export type InvestorStage =
    | 'CONTACTED'
    | 'PITCH_SENT'
    | 'MEETING_SCHEDULED'
    | 'DUE_DILIGENCE'
    | 'TERM_SHEET'
    | 'COMMITTED'
    | 'DECLINED';

export interface InvestorData {
    investor_name: string;
    investor_email?: string;
    stage: InvestorStage;
    ticket_size?: number;
    notes?: string;
    next_action_date?: string; // ISO date format
}

export interface InvestorDataResponse extends InvestorData {
    id: number;
    created: string;
}

// =============================================================================
// Complete Onboarding Wizard Payload
// =============================================================================

export interface OnboardingWizardPayload {
    // Step 0: Company basics
    company_name: string;
    industry: string;

    // Step 1: TRL/CRL
    current_trl: number;
    current_crl: number | null;

    // Data arrays
    evidences: EvidenceData[];
    financials: CampaignFinancials | null;
}

// =============================================================================
// Onboarding Wizard Response
// =============================================================================

export interface OnboardingWizardResponse {
    detail: string;
    startup_id: number;
    is_mock_data: boolean;
    current_trl: number;
    target_funding_amount: string;
    evidences_count: number;
    financial_periods_count: number;
    investors_count: number;
}

// =============================================================================
// Form State Management (for React component)
// =============================================================================

export interface OnboardingFormState {
    // Step 0: Company basics
    company_name: string;
    industry: string;

    // Step 1: TRL/CRL
    current_trl: number;
    current_crl: number | null;
    evidences: EvidenceData[];

    // Step 2: Finances
    financials: CampaignFinancials | null;
}

// Initial empty state
export const initialOnboardingState: OnboardingFormState = {
    company_name: '',
    industry: '',
    current_trl: 1,
    current_crl: null,
    evidences: [
        {
            type: 'TRL', // Default to TRL
            level: 1,
            description: '',
            file_url: '',
        },
    ],
    financials: null,
};

// =============================================================================
// Validation Errors
// =============================================================================

export interface OnboardingValidationError {
    current_trl?: string[];
    target_funding_amount?: string[];
    evidences?: string[] | Record<string, string[]>[];
    financial_data?: string[] | Record<string, string[]>[];
    investors?: string[] | Record<string, string[]>[];
    non_field_errors?: string[];
}
