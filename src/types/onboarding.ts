/**
 * TypeScript Interfaces for Onboarding Wizard - Phase 2
 * These interfaces match the Django backend serializers exactly
 */

// =============================================================================
// Evidence Data (Step 1: TRL/CRL)
// =============================================================================

export interface EvidenceData {
    trl_level: number; // 1-9
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
    current_trl: number; // 1-9

    // Step 2: Finances
    target_funding_amount: number;

    // Data arrays
    evidences: EvidenceData[];
    financial_data: FinancialData[];
    investors: InvestorData[];
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
    evidences: EvidenceData[];

    // Step 2: Finances
    financial_data: FinancialData[];

    // Step 3: Investors
    target_funding_amount: number;
    investors: InvestorData[];
}

// Initial empty state
export const initialOnboardingState: OnboardingFormState = {
    company_name: '',
    industry: '',
    current_trl: 1,
    evidences: [
        {
            trl_level: 1,
            description: '',
            file_url: '',
        },
    ],
    financial_data: [
        {
            period_date: '',
            revenue: 0,
            costs: 0,
            cash_balance: 0,
            monthly_burn: 0,
            notes: '',
        },
    ],
    target_funding_amount: 0,
    investors: [
        {
            investor_name: '',
            investor_email: '',
            stage: 'CONTACTED',
            ticket_size: 0,
            notes: '',
        },
    ],
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
