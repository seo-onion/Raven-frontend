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
    name: string;
    email: string;
    amount: number;
    status: string;
}

export interface InvestmentRound {
    id?: number;
    name: string;
    target: number;
    valuation: number;
    investors: Investor[];
}

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
}