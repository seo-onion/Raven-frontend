export interface InvestorCommitment {
    incubator_id: number;
    investor_name?: string; // For display purposes
    investor_email?: string;
    amount: number;
    status: 'CONTACTED' | 'PITCH_SENT' | 'MEETING_SCHEDULED' | 'DUE_DILIGENCE' | 'TERM_SHEET' | 'COMMITTED';
}

export interface RoundCommitPayload {
    name: string;
    target_amount: number;
    pre_money_valuation: number;
    status: 'PLANNED' | 'OPEN' | 'CLOSED';
    investors: InvestorCommitment[];
}
