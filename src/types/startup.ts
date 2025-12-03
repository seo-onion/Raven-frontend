/**
 * TypeScript Interfaces for Startup Data
 * These interfaces match the Django backend serializers
 */

// =============================================================================
// Startup Basic Data
// =============================================================================

export interface StartupData {
    id: number;
    company_name: string;
    industry: string;
    logo_url?: string;
    is_mock_data: boolean;
    onboarding_completed: boolean;
    created: string;
    updated: string;
}

// =============================================================================
// Evidence Data (TRL/CRL)
// =============================================================================

export type EvidenceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Evidence {
    id: number;
    type: 'TRL' | 'CRL'; // New field to indicate evidence type
    level: number; // Combined TRL/CRL level based on 'type'
    description: string;
    file?: string;
    file_url?: string;
    status: EvidenceStatus;
    reviewer_notes?: string;
    created: string;
    updated: string;
}

// =============================================================================
// Financial Data
// =============================================================================

export interface FinancialData {
    id: number;
    period_date: string; // ISO date format
    revenue: number;
    costs: number;
    cash_balance: number;
    monthly_burn: number;
    net_cash_flow: number; // Calculated field
    notes?: string;
    created: string;
    updated: string;
}

// =============================================================================
// Investor Pipeline
// =============================================================================

export type InvestorStage =
    | 'CONTACTED'
    | 'PITCH_SENT'
    | 'MEETING_SCHEDULED'
    | 'DUE_DILIGENCE'
    | 'TERM_SHEET'
    | 'COMMITTED'
    | 'DECLINED';

export interface InvestorPipeline {
    id: number;
    investor_name: string;
    investor_email?: string;
    stage: InvestorStage;
    ticket_size?: number;
    notes?: string;
    next_action_date?: string; // ISO date format
    created: string;
    updated: string;
}
