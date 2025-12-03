
import type { CampaignFinancials } from "@/types/campaigns";

// --- Financial Constants ---
// These should ideally come from backend configuration or a more central place
const WACC_DEFAULT = 0.15; // Weighted Average Cost of Capital (15%)
const TAX_RATE_DEFAULT = 0.25; // Default Tax Rate (25%)

// --- Utility Types ---
export interface QuarterProjection {
    revenue: number;
    cogs: number; // Cost of Goods Sold
    opex: number; // Operating Expenses (Gastos Administrativos)
    adjustedRevenue?: number;
    adjustedCogs?: number;
    grossProfit?: number;
    ebitda?: number;
    netIncome?: number;
    freeCashFlow?: number;
}

export interface FinancialProjectionsAdjusted {
    q1: QuarterProjection;
    q2: QuarterProjection;
    q3: QuarterProjection;
    q4: QuarterProjection;
}

export interface CalculatedKPIs {
    grossProfit: number;
    ebitda: number;
    npv: number; // Net Present Value (VAN)
    irr: number; // Internal Rate of Return (TIR)
    // Add other KPIs as needed, e.g., breakeven point, ROE
}

// --- Core Financial Calculation Functions ---

/**
 * Applies sensitivity variations to revenue and COGS (cogs in financial_projections)
 * and calculates intermediate financial metrics for each quarter.
 * @param financials The original CampaignFinancials object.
 * @param revenueVariation Percentage change for revenue (e.g., 10 for +10%, -5 for -5%).
 * @param costVariation Percentage change for COGS (cogs in financial_projections).
 * @returns Adjusted financial projections with calculated grossProfit, ebitda, and freeCashFlow.
 */
export const applySensitivityAndCalculateQuarterlyMetrics = (
    financials: CampaignFinancials,
    revenueVariation: number, // 0-100 range
    costVariation: number // 0-100 range
): FinancialProjectionsAdjusted => {
    const adjustedProjections: FinancialProjectionsAdjusted = {
        q1: { ...financials.financial_projections.q1 },
        q2: { ...financials.financial_projections.q2 },
        q3: { ...financials.financial_projections.q3 },
        q4: { ...financials.financial_projections.q4 },
    };

    const quarters = ['q1', 'q2', 'q3', 'q4'] as const;

    quarters.forEach(q => {
        const quarter = adjustedProjections[q];

        // Apply sensitivity
        quarter.adjustedRevenue = quarter.revenue * (1 + revenueVariation / 100);
        quarter.adjustedCogs = quarter.cogs * (1 + costVariation / 100);

        // Calculate Gross Profit (Utilidad Bruta)
        quarter.grossProfit = quarter.adjustedRevenue - quarter.adjustedCogs;

        // Calculate EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization)
        // For simplicity, assuming OPEX includes D&A for now, or it's a separate line item if detailed.
        // If OPEX strictly means operating expenses excluding D&A, then D&A would be added back.
        // Given the prompt, OPEX is "Gastos Administrativos", so we treat it as an expense.
        quarter.ebitda = quarter.grossProfit - quarter.opex;

        // Calculate Net Income (simplified, assuming no interest/depreciation/amortization for now)
        // Net Income = EBITDA * (1 - Tax Rate) - (Interest + D&A if applicable)
        quarter.netIncome = quarter.ebitda * (1 - TAX_RATE_DEFAULT);


        // Calculate Free Cash Flow (Flujo de Caja Libre)
        // FCF = Net Income + D&A - Capital Expenditures - Change in Working Capital
        // Simplified for this context: FCF = Adjusted Revenue - Adjusted Costs - OPEX
        // The prompt specifically asks for: Flujo de Caja Libre = Ingresos Ajustados - Costos Ajustados - Gastos Administrativos
        quarter.freeCashFlow = quarter.adjustedRevenue - quarter.adjustedCogs - quarter.opex;
    });

    return adjustedProjections;
};

/**
 * Calculates Net Present Value (NPV / VAN).
 * @param cashFlows An array of free cash flows for each period.
 * @param discountRate The discount rate (WACC).
 * @param initialInvestment Optional initial investment (negative value).
 * @returns The NPV.
 */
export const calculateNPV = (
    cashFlows: number[],
    discountRate: number = WACC_DEFAULT,
    initialInvestment: number = 0
): number => {
    let npv = initialInvestment;
    cashFlows.forEach((cf, i) => {
        npv += cf / Math.pow(1 + discountRate, i + 1);
    });
    return npv;
};

/**
 * Calculates Internal Rate of Return (IRR / TIR).
 * Uses an iterative method to find the discount rate that makes NPV zero.
 * @param cashFlows An array of free cash flows. Assumes initial investment is the first (negative) cash flow.
 * @param guess Initial guess for IRR (default 0.1).
 * @returns The IRR as a decimal, or NaN if not found.
 */
export const calculateIRR = (cashFlows: number[], guess: number = 0.1): number => {
    // Requires at least one positive and one negative cash flow for a valid IRR
    const hasPositive = cashFlows.some(cf => cf > 0);
    const hasNegative = cashFlows.some(cf => cf < 0);

    if (!hasPositive || !hasNegative) {
        return NaN; // IRR cannot be calculated without both positive and negative cash flows
    }

    const MAX_ITERATIONS = 1000;
    const PRECISION = 1e-7;

    let irr = guess;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        let npv = 0;
        for (let j = 0; j < cashFlows.length; j++) {
            npv += cashFlows[j] / Math.pow(1 + irr, j);
        }

        let derivative = 0;
        for (let j = 0; j < cashFlows.length; j++) {
            derivative -= j * cashFlows[j] / Math.pow(1 + irr, j + 1);
        }

        if (Math.abs(derivative) < PRECISION) { // Avoid division by zero
            return NaN;
        }

        const nextIrr = irr - npv / derivative;

        if (Math.abs(nextIrr - irr) < PRECISION) {
            return nextIrr;
        }
        irr = nextIrr;
    }
    return NaN; // IRR not found within max iterations
};

// --- KPI Calculation Function ---
/**
 * Calculates all aggregated KPIs based on adjusted quarterly projections.
 * @param adjustedProjections The adjusted financial projections.
 * @returns An object containing all calculated KPIs.
 */
export const calculateAllKPIs = (adjustedProjections: FinancialProjectionsAdjusted): CalculatedKPIs => {
    const qValues = Object.values(adjustedProjections);

    const totalGrossProfit = qValues.reduce((sum, q) => sum + (q.grossProfit || 0), 0);
    const totalEBITDA = qValues.reduce((sum, q) => sum + (q.ebitda || 0), 0);

    const freeCashFlows = qValues.map(q => q.freeCashFlow || 0);

    // Assuming an initial investment of 0 for NPV and IRR based on the prompt's context
    // If there's an initial investment, it should be passed here or pre-pended to cashFlows
    const npv = calculateNPV(freeCashFlows);
    const irr = calculateIRR([0, ...freeCashFlows]); // IRR usually includes an initial (negative) cash flow at period 0.
    // Here, assuming current state is period 0 with 0 cash flow, then future quarters.

    return {
        grossProfit: totalGrossProfit,
        ebitda: totalEBITDA,
        npv: npv,
        irr: irr,
        // ... add other KPIs here
    };
};

// --- Helper for Excel Export ---
export const formatFinancialDataForExcel = (
    originalFinancials: CampaignFinancials,
    adjustedProjections: FinancialProjectionsAdjusted,
    kpis: CalculatedKPIs,
    revenueVariation: number,
    costVariation: number
) => {
    const data = [];

    // Summary Section
    data.push(['Financial Dashboard Summary']);
    data.push(['Metric', 'Value']);
    data.push(['Funding Goal', originalFinancials.funding_goal || 'N/A']);
    data.push(['Valuation', originalFinancials.valuation || 'N/A']);
    data.push(['Usage of Funds', originalFinancials.usage_of_funds]);
    data.push(['Pre-Money Valuation', originalFinancials.pre_money_valuation || 'N/A']);
    data.push(['Current Cash Balance', originalFinancials.current_cash_balance || 'N/A']);
    data.push(['Monthly Burn Rate', originalFinancials.monthly_burn_rate || 'N/A']);
    data.push([]); // Empty row for spacing

    // Sensitivity Analysis Parameters
    data.push(['Sensitivity Analysis Parameters']);
    data.push(['Parameter', 'Value (%)']);
    data.push(['Revenue Variation', revenueVariation]);
    data.push(['Cost Variation', costVariation]);
    data.push([]); // Empty row for spacing

    // Calculated KPIs
    data.push(['Calculated KPIs']);
    data.push(['KPI', 'Value']);
    data.push(['Total Gross Profit', kpis.grossProfit]);
    data.push(['Total EBITDA', kpis.ebitda]);
    data.push(['NPV (VAN)', kpis.npv]);
    data.push(['IRR (TIR)', kpis.irr]);
    data.push([]); // Empty row for spacing

    // Detailed Quarterly Projections
    data.push(['Detailed Quarterly Projections']);
    data.push([
        'Quarter',
        'Original Revenue', 'Original COGS', 'Original OPEX',
        'Adjusted Revenue', 'Adjusted COGS', 'Gross Profit', 'EBITDA', 'Net Income', 'Free Cash Flow'
    ]);

    const quarters = ['q1', 'q2', 'q3', 'q4'] as const;
    quarters.forEach(q => {
        const original = originalFinancials.financial_projections[q];
        const adjusted = adjustedProjections[q];
        data.push([
            q.toUpperCase(),
            original.revenue,
            original.cogs,
            original.opex,
            adjusted.adjustedRevenue || 'N/A',
            adjusted.adjustedCogs || 'N/A',
            adjusted.grossProfit || 'N/A',
            adjusted.ebitda || 'N/A',
            adjusted.netIncome || 'N/A',
            adjusted.freeCashFlow || 'N/A'
        ]);
    });

    return data;
};
