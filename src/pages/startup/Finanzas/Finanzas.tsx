import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import MetricCard from '../../../components/dashboard/MetricCard/MetricCard';
import CashFlowChart from '../../../components/dashboard/CashFlowChart/CashFlowChart';
import RevenueVsCostsChart from '../../../components/dashboard/RevenueVsCostsChart/RevenueVsCostsChart';
import SensitivityAnalysis from '../../../components/dashboard/SensitivityAnalysis/SensitivityAnalysis';
import FormulaGrid from '../../../components/dashboard/FormulaGrid/FormulaGrid';
import KPIPanel from '../../../components/dashboard/KPIPanel/KPIPanel';
import Button from '@/components/common/Button/Button';
import useStartupValidation from '@/hooks/useStartupValidation';
import { fetchCampaignFinancials, updateCampaignFinancials } from '@/api/campaigns';
import { applySensitivityAndCalculateQuarterlyMetrics, calculateAllKPIs } from '@/utils/financialMath';
import type { CampaignFinancials, FinancialsUpdateDTO, InvestmentRound, Investor } from '@/types/campaigns';
import './Finanzas.css';
import { FiDownload, FiSave, FiCpu } from "react-icons/fi";
import * as XLSX from 'xlsx';
import Spinner from '@/components/common/Spinner/Spinner';

// Demo financial projections for when no financials are configured
const defaultFinancialProjections = {
    q1: { revenue: 50000, cogs: 20000, opex: 15000 },
    q2: { revenue: 75000, cogs: 30000, opex: 18000 },
    q3: { revenue: 100000, cogs: 40000, opex: 22000 },
    q4: { revenue: 150000, cogs: 55000, opex: 28000 },
};

/**
 * Generate valid ISO date string for a given month index (0-11).
 * Uses current year as base.
 */
const getMonthDateString = (monthIndex: number): string => {
    const currentYear = new Date().getFullYear();
    // Month is 0-indexed in Date constructor
    const date = new Date(currentYear, monthIndex, 1);
    return date.toISOString();
};

/**
 * Interpolates quarterly data into 12 monthly data points.
 * Distributes each quarter's values uniformly across its 3 months.
 */
const interpolateToMonthly = (
    adjustedProjections: Record<string, any>,
    quarters: readonly string[]
): Array<{
    id: number;
    created: string;
    updated: string;
    period_date: string;
    revenue: number;
    costs: number;
    cash_balance: number;
    monthly_burn: number;
    net_cash_flow: number;
    notes: string;
}> => {
    const monthlyData: Array<{
        id: number;
        created: string;
        updated: string;
        period_date: string;
        revenue: number;
        costs: number;
        cash_balance: number;
        monthly_burn: number;
        net_cash_flow: number;
        notes: string;
    }> = [];

    quarters.forEach((q, quarterIndex) => {
        const proj = adjustedProjections[q];
        if (!proj) return;

        // Get quarterly totals
        const quarterlyRevenue = proj.adjustedRevenue || 0;
        const quarterlyCosts = proj.adjustedCogs || 0;
        const quarterlyFCF = proj.freeCashFlow || 0;

        // Distribute across 3 months (divide by 3)
        const monthlyRevenue = quarterlyRevenue / 3;
        const monthlyCosts = quarterlyCosts / 3;
        const monthlyFCF = quarterlyFCF / 3;

        // Create 3 monthly entries for this quarter
        for (let monthInQuarter = 0; monthInQuarter < 3; monthInQuarter++) {
            const monthIndex = quarterIndex * 3 + monthInQuarter;
            const now = new Date().toISOString();

            monthlyData.push({
                id: monthIndex,
                created: now,
                updated: now,
                period_date: getMonthDateString(monthIndex), // Valid ISO date
                revenue: monthlyRevenue,
                costs: monthlyCosts,
                cash_balance: 0,
                monthly_burn: 0,
                net_cash_flow: monthlyFCF,
                notes: `${q.toUpperCase()} - Mes ${monthInQuarter + 1}`
            });
        }
    });

    return monthlyData;
};

const Finanzas: React.FC = () => {
    const { t } = useTranslation('common');
    const queryClient = useQueryClient();

    // Validate startup has company_name, redirect to wizard if not
    useStartupValidation();

    // State for sensitivity analysis multipliers
    const [revenueMultiplier, setRevenueMultiplier] = useState<number>(1); // 1 = 100% (no change)
    const [costMultiplier, setCostMultiplier] = useState<number>(1); // 1 = 100% (no change)
    // Auto-enable demo projections when no real data exists
    const [useDemoProjections, _setUseDemoProjections] = useState(true);

    // State for editable financial inputs
    const [editableCashBalance, setEditableCashBalance] = useState<number | null>(null);
    const [editableBurnRate, setEditableBurnRate] = useState<number | null>(null);
    const [sheetData, setSheetData] = useState<Record<string, any> | null>(null);

    // Fetch campaign financials
    const { data: campaignData, isLoading, error } = useQuery({
        queryKey: ['campaign-financials'],
        queryFn: fetchCampaignFinancials,
    });

    // TASK 3: Initialize editable state from backend data when it becomes available
    useEffect(() => {
        if (campaignData?.financials) {
            // Only set if not already edited by user (null = not edited yet)
            if (editableCashBalance === null && campaignData.financials.current_cash_balance != null) {
                setEditableCashBalance(campaignData.financials.current_cash_balance);
            }
            if (editableBurnRate === null && campaignData.financials.monthly_burn_rate != null) {
                setEditableBurnRate(campaignData.financials.monthly_burn_rate);
            }
        }
    }, [campaignData?.financials, editableCashBalance, editableBurnRate]);

    // Mutation for updating financials
    const updateFinancialsMutation = useMutation({
        mutationFn: (data: FinancialsUpdateDTO) => {
            if (!campaignData?.id) throw new Error('Campaign ID not found');
            return updateCampaignFinancials(campaignData.id, data);
        },
        onSuccess: () => {
            toast.success(t('financial_data_updated') || 'Datos financieros actualizados correctamente');
            queryClient.invalidateQueries({ queryKey: ['campaign-financials'] });
        },
        onError: (error) => {
            console.error('Error updating financials:', error);
            toast.error(t('error_updating_financials') || 'Error al actualizar los datos financieros');
        }
    });

    // Calculate total capital injection from rounds (sum of all COMMITTED investors)
    const totalCapitalInjection = useMemo(() => {
        if (!campaignData?.rounds) return 0;

        return campaignData.rounds.reduce((total: number, round: InvestmentRound) => {
            // Use total_committed_amount if available, otherwise sum investors
            if (round.total_committed_amount !== undefined) {
                return total + round.total_committed_amount;
            }
            // Fallback: sum committed investors
            const roundTotal = (round.investors || [])
                .filter((inv: Investor) => inv.status === 'COMMITTED')
                .reduce((sum: number, inv: Investor) => sum + parseFloat(inv.amount?.toString() || '0'), 0);
            return total + roundTotal;
        }, 0);
    }, [campaignData]);

    // Get current round info
    const currentRound = useMemo(() => {
        if (!campaignData?.rounds) return null;
        return campaignData.rounds.find((r: InvestmentRound) => r.is_current) || campaignData.rounds[0] || null;
    }, [campaignData]);

    /**
     * Helper function to check if financial projections object has valid data.
     * Treats null, undefined, and empty objects {} as invalid.
     */
    const isValidProjections = (data: any): boolean => {
        if (data == null) return false;
        if (typeof data !== 'object') return false;
        // Check if object has at least one quarter with data
        const quarters = ['q1', 'q2', 'q3', 'q4'];
        return quarters.some(q => {
            const quarter = data[q];
            return quarter && typeof quarter === 'object' &&
                (quarter.revenue !== undefined || quarter.cogs !== undefined || quarter.opex !== undefined);
        });
    };

    // TASK 1 & 2: Prioritize financial_sheet.sheet_data as the primary data source
    // Treat empty objects {} as falsy (no data)
    const financialSheetData = campaignData?.financial_sheet?.sheet_data;
    const legacyProjections = campaignData?.financials?.financial_projections;

    const hasSheetData = isValidProjections(financialSheetData);
    const hasLegacyProjections = isValidProjections(legacyProjections);
    const hasRealProjections = hasSheetData || hasLegacyProjections;

    const financialProjections = useMemo(() => {
        // Priority 1: Use financial_sheet.sheet_data if available and valid
        if (hasSheetData && financialSheetData) {
            console.log('[Finanzas] Using financial_sheet.sheet_data:', financialSheetData);
            return financialSheetData;
        }
        // Priority 2: Fall back to legacy financials.financial_projections if valid
        if (hasLegacyProjections && legacyProjections) {
            console.log('[Finanzas] Using legacy financials.financial_projections:', legacyProjections);
            return legacyProjections;
        }
        // Priority 3: Use demo data if user opted in
        if (useDemoProjections) {
            console.log('[Finanzas] Using demo projections');
            return defaultFinancialProjections;
        }
        // No valid data available
        console.log('[Finanzas] No valid projections found');
        return null;
    }, [hasSheetData, financialSheetData, hasLegacyProjections, legacyProjections, useDemoProjections]);

    // Build active financials object for calculations
    const activeFinancials = useMemo(() => {
        if (!financialProjections) return null;

        const cashBalance = editableCashBalance ?? campaignData?.financials?.current_cash_balance ?? 0;
        const burnRate = editableBurnRate ?? campaignData?.financials?.monthly_burn_rate ?? 0;

        // TASK 3: Convert string values to numbers for valuation fields
        const preMoneyVal = currentRound?.pre_money_valuation || campaignData?.financials?.pre_money_valuation;
        const fundingGoal = campaignData?.financials?.funding_goal || currentRound?.target_amount;
        const valuationVal = campaignData?.financials?.valuation;

        return {
            id: campaignData?.financials?.id || campaignData?.financial_sheet?.id || 0,
            total_capital_injection: totalCapitalInjection,
            financial_projections: financialProjections,
            // Convert to numbers to prevent type errors in calculations
            pre_money_valuation: typeof preMoneyVal === 'string' ? parseFloat(preMoneyVal) || 0 : (preMoneyVal || 0),
            funding_goal: typeof fundingGoal === 'string' ? parseFloat(fundingGoal) || 0 : (fundingGoal || 0),
            valuation: typeof valuationVal === 'string' ? parseFloat(valuationVal) || 0 : (valuationVal || 0),
            usage_of_funds: campaignData?.financials?.usage_of_funds || '',
            revenue_history: campaignData?.financials?.revenue_history || {},
            current_cash_balance: typeof cashBalance === 'string' ? parseFloat(cashBalance) || 0 : cashBalance,
            monthly_burn_rate: typeof burnRate === 'string' ? parseFloat(burnRate) || 0 : burnRate,
            rounds: campaignData?.rounds || [],
            // Track the data source for debugging
            _dataSource: hasSheetData ? 'financial_sheet' : (hasLegacyProjections ? 'financials' : 'demo')
        };
    }, [financialProjections, totalCapitalInjection, currentRound, campaignData, editableCashBalance, editableBurnRate, hasSheetData, hasLegacyProjections]);

    // Calculate adjusted financials and KPIs with 12-month interpolation
    const { adjustedProjections, kpis, chartData } = useMemo(() => {
        if (!activeFinancials || !activeFinancials.financial_projections) {
            return { adjustedProjections: null, kpis: { npv: 0, irr: 0, ebitda: 0, grossProfit: 0 }, chartData: [] };
        }

        // 1. Apply sensitivity - Note: sensitivity is applied in chart components, not here
        // We pass raw data and let charts apply the multipliers
        const adjusted = applySensitivityAndCalculateQuarterlyMetrics(
            activeFinancials as CampaignFinancials,
            0, // No sensitivity applied here - charts will apply it
            0
        );

        // 2. Calculate KPIs using total_capital_injection as initial investment
        const calculatedKpis = calculateAllKPIs(
            adjusted,
            activeFinancials.total_capital_injection || 0
        );

        // 3. TASK 2: Interpolate quarterly data to 12 monthly data points with valid dates
        const quarters = ['q1', 'q2', 'q3', 'q4'] as const;
        const monthlyChartData = interpolateToMonthly(adjusted, quarters);

        return { adjustedProjections: adjusted, kpis: calculatedKpis, chartData: monthlyChartData };
    }, [activeFinancials]);

    // Handler for generating dynamic financials (first time)
    const handleGenerateFinancials = useCallback(async () => {
        if (!campaignData?.id) return;

        // Use default projections as the "dynamic" initial data
        // In a real scenario, this could be randomized or calculated based on industry
        const payload: FinancialsUpdateDTO = {
            current_cash_balance: 10000,
            monthly_burn_rate: 5000,
            financial_projections: defaultFinancialProjections
        };

        try {
            await updateFinancialsMutation.mutateAsync(payload);
            toast.success(t('financials_generated') || 'Finanzas generadas correctamente');
        } catch (error) {
            console.error('Error generating financials:', error);
            toast.error(t('error_generating_financials') || 'Error al generar finanzas');
        }
    }, [campaignData?.id, updateFinancialsMutation, t]);

    // Handler for updating financial data
    const handleUpdateDatos = useCallback(async () => {
        if (!activeFinancials || !campaignData?.id) {
            toast.error(t('no_data_to_save') || 'No hay datos para guardar');
            return;
        }

        // Build the update payload
        const payload: FinancialsUpdateDTO = {
            current_cash_balance: activeFinancials.current_cash_balance as number,
            monthly_burn_rate: activeFinancials.monthly_burn_rate as number,
        };

        // Only include projections if they're real (not demo)
        if (hasRealProjections && adjustedProjections) {
            const quarters = ['q1', 'q2', 'q3', 'q4'] as const;
            payload.financial_projections = {} as FinancialsUpdateDTO['financial_projections'];

            quarters.forEach(q => {
                const proj = activeFinancials.financial_projections[q];
                if (proj && payload.financial_projections) {
                    payload.financial_projections[q] = {
                        revenue: proj.revenue || 0,
                        cogs: proj.cogs || 0,
                        opex: proj.opex || 0
                    };
                }
            });
        }

        // Include sheet data if available (from FormulaGrid)
        if (sheetData) {
            payload.financial_sheet = {
                data: sheetData,
                metadata: {
                    last_updated: new Date().toISOString(),
                    version: 1
                }
            };
        }

        // Execute the mutation
        updateFinancialsMutation.mutate(payload);
    }, [activeFinancials, campaignData?.id, hasRealProjections, adjustedProjections, sheetData, updateFinancialsMutation, t]);

    // Handler for FormulaGrid data changes
    const handleFormulaGridUpdate = useCallback((data: Record<string, any>) => {
        setSheetData(data);
    }, []);

    // Manejador de clic para descargar el archivo de Excel
    const handleDownloadExcel = async () => {
        if (!adjustedProjections || !kpis) return;

        try {
            const wb = XLSX.utils.book_new();

            // 1. KPI Sheet
            const kpiData = [
                { 'KPI': 'NPV (VAN)', 'Valor': kpis.npv },
                { 'KPI': 'IRR (TIR)', 'Valor': (kpis.irr * 100).toFixed(2) + '%' },
                { 'KPI': 'EBITDA Total', 'Valor': kpis.ebitda },
                { 'KPI': 'Utilidad Bruta Total', 'Valor': kpis.grossProfit },
                { 'KPI': 'Capital Comprometido', 'Valor': totalCapitalInjection },
            ];
            const wsKPI = XLSX.utils.json_to_sheet(kpiData);
            XLSX.utils.book_append_sheet(wb, wsKPI, 'KPIs');

            // 2. Monthly Projections Sheet (12 months)
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const monthlyProjData = chartData.map((month, idx) => ({
                'Mes': monthNames[idx],
                'Ingresos': month.revenue,
                'Costos': month.costs,
                'Flujo de Caja Neto': month.net_cash_flow,
            }));
            const wsMonthly = XLSX.utils.json_to_sheet(monthlyProjData);
            XLSX.utils.book_append_sheet(wb, wsMonthly, 'Proyecciones Mensuales');

            // 3. Quarterly Projections Sheet
            const quarters = ['q1', 'q2', 'q3', 'q4'] as const;
            const projData = quarters.map(q => ({
                'Trimestre': q.toUpperCase(),
                'Revenue': adjustedProjections[q].adjustedRevenue,
                'COGS': adjustedProjections[q].adjustedCogs,
                'Gross Profit': adjustedProjections[q].grossProfit,
                'EBITDA': adjustedProjections[q].ebitda,
                'Free Cash Flow': adjustedProjections[q].freeCashFlow
            }));
            const wsProj = XLSX.utils.json_to_sheet(projData);
            XLSX.utils.book_append_sheet(wb, wsProj, 'Proyecciones Trimestrales');

            // 4. Rounds Sheet
            if (campaignData?.rounds) {
                const roundsData = campaignData.rounds.map((r: InvestmentRound) => ({
                    'Ronda': r.name,
                    'Meta': r.target_amount,
                    'Valoración Pre-Money': r.pre_money_valuation,
                    'Estado': r.status,
                    'Comprometido': r.total_committed_amount || 0,
                    'Fecha Lanzamiento': r.launch_date,
                    'Fecha Cierre Objetivo': r.target_close_date,
                }));
                const wsRounds = XLSX.utils.json_to_sheet(roundsData);
                XLSX.utils.book_append_sheet(wb, wsRounds, 'Rondas');
            }

            // Write file
            XLSX.writeFile(wb, `Financial_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error exporting Excel:', error);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner variant="primary" size="lg" /></div>;
    }

    if (error) {
        return (
            <div className="finanzas-container">
                <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200">
                    <h2 className="text-xl font-bold text-red-800 mb-4">{t('error_loading_data')}</h2>
                    <p className="text-red-600">{t('try_again_later')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="finanzas-container">
            {/* Data source indicator */}

            {!hasSheetData && hasLegacyProjections && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                    <strong>ℹ️ Datos Legados:</strong> Las proyecciones se están cargando desde el formato anterior (financials).
                </div>
            )}


            <div className='finanzas-header-container'>
                <div>
                    <h1 className="finanzas-main-title">{t('financial_dashboard')}</h1>
                    <p className="finanzas-subtitle">{t('manage_financial_projections')}</p>
                </div>

                <div className='button-container'>
                    {!hasRealProjections && (activeFinancials?.funding_goal || 0) > 0 && (
                        <Button
                            variant={'primary'}
                            size="lg"
                            onClick={handleGenerateFinancials}
                            disabled={updateFinancialsMutation.isPending}
                            className="typeselectioncard-button mr-2"
                        >
                            {updateFinancialsMutation.isPending ? (
                                <>
                                    <Spinner variant="secondary" size="sm" /> {t('saving') || 'Guardando...'}
                                </>
                            ) : (
                                <>
                                    <FiCpu size={16} /> {t('generate_financials') || 'Generar Finanzas'}
                                </>
                            )}
                        </Button>
                    )}

                    <Button
                        variant={'primary'}
                        size="lg"
                        onClick={handleUpdateDatos}
                        disabled={updateFinancialsMutation.isPending}
                        className="typeselectioncard-button mr-2"
                    >
                        {updateFinancialsMutation.isPending ? (
                            <>
                                <Spinner variant="secondary" size="sm" /> {t('saving') || 'Guardando...'}
                            </>
                        ) : (
                            <>
                                <FiSave size={16} /> {t('update_data') || 'Actualizar Datos'}
                            </>
                        )}
                    </Button>
                    <Button
                        variant={'secondary'}
                        size="lg"
                        onClick={handleDownloadExcel}
                        className="typeselectioncard-button"
                    >
                        <FiDownload size={16} /> Exportar Excel
                    </Button>
                </div>
            </div>

            {/* Data source indicator */}
            <div className="incubatormetrics_demobanner">
                <strong>⚠️ Modo Demo:</strong> Esta startup no tiene proyecciones financieras configuradas.
            </div>
            {/* Metrics Grid - Using Real KPIs */}
            <div className="finanzas-metrics-grid">
                <MetricCard
                    title="VAN (NPV)"
                    value={`$${kpis.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    secondaryValue={`Capital: $${totalCapitalInjection.toLocaleString()}`}
                    trend={kpis.npv > 0 ? 'up' : 'down'}
                />
                <MetricCard
                    title="TIR (IRR)"
                    value={isNaN(kpis.irr) ? '$100' : `${(kpis.irr * 100).toFixed(2)}%`}
                    secondaryValue="Retorno esperado"
                    trend={kpis.irr > 0.15 ? 'up' : 'neutral'}
                />
                <MetricCard
                    title="EBITDA Total"
                    value={`$${kpis.ebitda.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    secondaryValue="4 Quarters"
                    trend={kpis.ebitda > 0 ? 'up' : 'down'}
                />
                <MetricCard
                    title="Utilidad Bruta"
                    value={`$${kpis.grossProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    secondaryValue="4 Quarters"
                    trend="up"
                />
            </div>

            {/* Campaign Funding Progress */}
            {currentRound && (
                <div className="finanzas-metrics-grid mt-4">
                    <MetricCard
                        title={`Ronda: ${currentRound.name}`}
                        value={`$${totalCapitalInjection.toLocaleString()}`}
                        secondaryValue={`de $${Number(currentRound.target_amount).toLocaleString()} (${((totalCapitalInjection / Number(currentRound.target_amount)) * 100).toFixed(1)}%)`}
                        trend={totalCapitalInjection >= Number(currentRound.target_amount) ? 'up' : 'neutral'}
                    />
                    <MetricCard
                        title="Valoración Pre-Money"
                        value={`$${Number(currentRound.pre_money_valuation).toLocaleString()}`}
                        secondaryValue={currentRound.status}
                        trend="neutral"
                    />
                    <MetricCard
                        title="Inversores Comprometidos"
                        value={currentRound.investors?.filter((i: Investor) => i.status === 'COMMITTED').length.toString() || '0'}
                        secondaryValue="COMMITTED"
                        trend="up"
                    />
                    <MetricCard
                        title="Fecha Cierre"
                        value={currentRound.target_close_date || 'N/A'}
                        secondaryValue={currentRound.status === 'OPEN' ? 'Ronda abierta' : currentRound.status}
                        trend="neutral"
                    />
                </div>
            )}

            {/* TASK 1: Charts Grid - Use actual slider values (revenueMultiplier, costMultiplier) */}
            <div className="finanzas-charts-grid">
                <CashFlowChart
                    financialData={chartData as any}
                    revenueMultiplier={revenueMultiplier}
                    costMultiplier={costMultiplier}
                />
                <RevenueVsCostsChart
                    financialData={chartData as any}
                    revenueMultiplier={revenueMultiplier}
                    costMultiplier={costMultiplier}
                />
            </div>

            {/* Sensitivity Analysis */}
            <SensitivityAnalysis
                revenueMultiplier={revenueMultiplier}
                setRevenueMultiplier={setRevenueMultiplier}
                costMultiplier={costMultiplier}
                setCostMultiplier={setCostMultiplier}
            />

            {/* Formula Grid - Pass the update handler */}
            <FormulaGrid onKPIUpdate={handleFormulaGridUpdate} />

            {/* KPI Panel */}
            <KPIPanel kpis={kpis} />
        </div>
    );
};

export default Finanzas;
