/**
 * Campaign Type Definitions
 * Interfaces for campaign data structures
 */

export interface CampaignTeamMember {
    id?: number;
    name: string;
    role: string;
    linkedin: string;
    avatar_url: string;
}

export interface Investor {
    id?: number;
    incubator_id?: number; // Write-only (for creating/updating)
    incubator_details?: {  // Read-only
        id: number;
        name: string;
    };
    amount: string;
    status: 'CONTACTED' | 'PITCH_SENT' | 'MEETING_SCHEDULED' | 'DUE_DILIGENCE' | 'TERM_SHEET' | 'COMMITTED';
}

export type InvestorDTO = Investor;

export interface InvestmentRound {
    id: number;
    name: string;
    target_amount: string;
    pre_money_valuation?: string;
    status: 'PLANNED' | 'OPEN' | 'CLOSED';
    is_current: boolean;
    launch_date?: string;
    target_close_date?: string;
    actual_close_date?: string;
    investors?: Investor[];
    total_committed_amount?: number;
    created: string;
    updated: string;
}

export type InvestmentRoundDTO = InvestmentRound;

export interface CampaignFinancials {
    id?: number;
    funding_goal: number | null;
    valuation: number | null;
    usage_of_funds: string;
    revenue_history: Record<string, any>;
    pre_money_valuation: number | null;
    current_cash_balance: number | null;
    monthly_burn_rate: number | null;
    financial_projections: {
        q1: { revenue: number; cogs: number; opex: number };
        q2: { revenue: number; cogs: number; opex: number };
        q3: { revenue: number; cogs: number; opex: number };
        q4: { revenue: number; cogs: number; opex: number };
    };
    rounds: InvestmentRound[];
}

export interface CampaignTraction {
    id?: number;
    metrics: Record<string, any>;
    proof_doc_url: string;
}

export interface CampaignLegal {
    id?: number;
    constitution_url: string;
    whitepaper_url: string;
    cap_table_url: string;
}

export interface CampaignData {
    id: number | null;
    startup: number | null;
    problem: string;
    solution: string;
    business_model: string;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    team_members: CampaignTeamMember[];
    financials: CampaignFinancials | null;
    tractions: CampaignTraction[];
    legal: CampaignLegal | null;
    // Financial sheet with quarterly projections data
    financial_sheet?: {
        id?: number;
        sheet_data?: {
            q1?: { revenue: number; cogs: number; opex: number };
            q2?: { revenue: number; cogs: number; opex: number };
            q3?: { revenue: number; cogs: number; opex: number };
            q4?: { revenue: number; cogs: number; opex: number };
        } | null;
        metadata?: {
            last_updated?: string;
            version?: number;
        };
    } | null;
}

export interface RoundNestedUpdateDTO {
    name?: string;
    target_amount?: string;
    pre_money_valuation?: string;
    status?: 'PLANNED' | 'OPEN' | 'CLOSED';
    is_current?: boolean;
    launch_date?: string;
    target_close_date?: string;
    actual_close_date?: string;
    investors?: Investor[];
}

export interface RoundCreateDTO {
    name: string;
    target_amount: string; // decimal string
    pre_money_valuation?: string;
    status?: 'PLANNED' | 'OPEN' | 'CLOSED';
    is_current?: boolean;
    launch_date?: string; // YYYY-MM-DD
    target_close_date?: string;
    actual_close_date?: string;
    investors?: InvestorDTO[];
}

export interface CampaignFinancialsBackendDTO {
    total_capital_injection: number;
    financial_projections: Record<string, any>;
    pre_money_valuation: string;
    // ... other fields
}

export interface CampaignDataWithFinancialsDTO extends CampaignData {
    financials: CampaignFinancialsBackendDTO & CampaignFinancials;
    rounds: InvestmentRound[];
}

/**
 * DTO for updating campaign financials via PATCH
 */
export interface FinancialsUpdateDTO {
    current_cash_balance?: number;
    monthly_burn_rate?: number;
    funding_goal?: number;
    valuation?: number;
    usage_of_funds?: string;
    pre_money_valuation?: number;
    financial_projections?: {
        q1?: { revenue: number; cogs: number; opex: number };
        q2?: { revenue: number; cogs: number; opex: number };
        q3?: { revenue: number; cogs: number; opex: number };
        q4?: { revenue: number; cogs: number; opex: number };
    };
    revenue_history?: Record<string, any>;
    // For the spreadsheet/financial sheet data
    financial_sheet?: {
        data: Record<string, any>;
        metadata?: {
            last_updated: string;
            version: number;
        };
    };
}