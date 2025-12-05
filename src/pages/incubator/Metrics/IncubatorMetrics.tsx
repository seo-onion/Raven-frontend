import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import MetricCard from '../../../components/incubator/MetricCard/MetricCard';
import Spinner from '@/components/common/Spinner/Spinner';
import Button from '@/components/common/Button/Button';
import { fetchPortfolioCampaigns, type PortfolioCampaignDTO } from '@/api/incubator';
import { fetchStartupCampaignFinancials } from '@/api/campaigns';
import { applySensitivityAndCalculateQuarterlyMetrics, calculateAllKPIs } from '@/utils/financialMath';
import type { CampaignFinancials, InvestmentRound, Investor } from '@/types/campaigns';
import DashboardMetricCard from '@/components/dashboard/MetricCard/MetricCard';
import CashFlowChart from '@/components/dashboard/CashFlowChart/CashFlowChart';
import RevenueVsCostsChart from '@/components/dashboard/RevenueVsCostsChart/RevenueVsCostsChart';
import KPIPanel from '@/components/dashboard/KPIPanel/KPIPanel';
import { FiEye, FiTrendingUp, FiDollarSign, FiTarget, FiActivity, FiArrowLeft } from 'react-icons/fi';
import './IncubatorMetrics.css';

// Demo financial projections
const defaultFinancialProjections = {
    q1: { revenue: 50000, cogs: 20000, opex: 15000 },
    q2: { revenue: 75000, cogs: 30000, opex: 18000 },
    q3: { revenue: 100000, cogs: 40000, opex: 22000 },
    q4: { revenue: 150000, cogs: 55000, opex: 28000 },
};

const getMonthDateString = (monthIndex: number): string => {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, monthIndex, 1);
    return date.toISOString();
};

const interpolateToMonthly = (
    adjustedProjections: Record<string, any>,
    quarters: readonly string[]
): Array<any> => {
    const monthlyData: Array<any> = [];

    quarters.forEach((q, quarterIndex) => {
        const proj = adjustedProjections[q];
        if (!proj) return;

        const quarterlyRevenue = proj.adjustedRevenue || 0;
        const quarterlyCosts = proj.adjustedCogs || 0;
        const quarterlyFCF = proj.freeCashFlow || 0;

        const monthlyRevenue = quarterlyRevenue / 3;
        const monthlyCosts = quarterlyCosts / 3;
        const monthlyFCF = quarterlyFCF / 3;

        for (let monthInQuarter = 0; monthInQuarter < 3; monthInQuarter++) {
            const monthIndex = quarterIndex * 3 + monthInQuarter;
            const now = new Date().toISOString();

            monthlyData.push({
                id: monthIndex,
                created: now,
                updated: now,
                period_date: getMonthDateString(monthIndex),
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

// ============================================================================
// Startup Financial Detail View Component
// ============================================================================
interface StartupFinancialViewProps {
    startupId: number;
    startupName: string;
    onBack: () => void;
}

const StartupFinancialView: React.FC<StartupFinancialViewProps> = ({ startupId, startupName, onBack }) => {
    const { t } = useTranslation('common');

    const { data: campaignData, isLoading, error } = useQuery({
        queryKey: ['startup-campaign-financials', startupId],
        queryFn: () => fetchStartupCampaignFinancials(startupId),
    });

    const totalCapitalInjection = useMemo(() => {
        if (!campaignData?.rounds) return 0;
        return campaignData.rounds.reduce((total: number, round: InvestmentRound) => {
            if (round.total_committed_amount !== undefined) {
                return total + round.total_committed_amount;
            }
            const roundTotal = (round.investors || [])
                .filter((inv: Investor) => inv.status === 'COMMITTED')
                .reduce((sum: number, inv: Investor) => sum + parseFloat(inv.amount?.toString() || '0'), 0);
            return total + roundTotal;
        }, 0);
    }, [campaignData]);

    const currentRound = useMemo(() => {
        if (!campaignData?.rounds) return null;
        return campaignData.rounds.find((r: InvestmentRound) => r.is_current) || campaignData.rounds[0] || null;
    }, [campaignData]);

    const isValidProjections = (data: any): boolean => {
        if (data == null) return false;
        if (typeof data !== 'object') return false;
        const quarters = ['q1', 'q2', 'q3', 'q4'];
        return quarters.some(q => {
            const quarter = data[q];
            return quarter && typeof quarter === 'object' &&
                (quarter.revenue !== undefined || quarter.cogs !== undefined || quarter.opex !== undefined);
        });
    };

    const financialSheetData = campaignData?.financial_sheet?.sheet_data;
    const legacyProjections = campaignData?.financials?.financial_projections;
    const hasSheetData = isValidProjections(financialSheetData);
    const hasLegacyProjections = isValidProjections(legacyProjections);

    const financialProjections = useMemo(() => {
        if (hasSheetData && financialSheetData) return financialSheetData;
        if (hasLegacyProjections && legacyProjections) return legacyProjections;
        return defaultFinancialProjections;
    }, [hasSheetData, financialSheetData, hasLegacyProjections, legacyProjections]);

    const activeFinancials = useMemo(() => {
        if (!financialProjections) return null;

        const cashBalance = campaignData?.financials?.current_cash_balance ?? 0;
        const burnRate = campaignData?.financials?.monthly_burn_rate ?? 0;
        const preMoneyVal = currentRound?.pre_money_valuation || campaignData?.financials?.pre_money_valuation;
        const fundingGoal = campaignData?.financials?.funding_goal || currentRound?.target_amount;
        const valuationVal = campaignData?.financials?.valuation;

        return {
            id: campaignData?.financials?.id || 0,
            total_capital_injection: totalCapitalInjection,
            financial_projections: financialProjections,
            pre_money_valuation: typeof preMoneyVal === 'string' ? parseFloat(preMoneyVal) || 0 : (preMoneyVal || 0),
            funding_goal: typeof fundingGoal === 'string' ? parseFloat(fundingGoal) || 0 : (fundingGoal || 0),
            valuation: typeof valuationVal === 'string' ? parseFloat(valuationVal) || 0 : (valuationVal || 0),
            usage_of_funds: campaignData?.financials?.usage_of_funds || '',
            revenue_history: campaignData?.financials?.revenue_history || {},
            current_cash_balance: typeof cashBalance === 'string' ? parseFloat(cashBalance) || 0 : cashBalance,
            monthly_burn_rate: typeof burnRate === 'string' ? parseFloat(burnRate) || 0 : burnRate,
            rounds: campaignData?.rounds || [],
        };
    }, [financialProjections, totalCapitalInjection, currentRound, campaignData]);

    const { kpis, chartData } = useMemo(() => {
        if (!activeFinancials || !activeFinancials.financial_projections) {
            return { kpis: { npv: 0, irr: 0, ebitda: 0, grossProfit: 0 }, chartData: [] };
        }

        const adjusted = applySensitivityAndCalculateQuarterlyMetrics(
            activeFinancials as CampaignFinancials,
            0,
            0
        );

        const calculatedKpis = calculateAllKPIs(
            adjusted,
            activeFinancials.total_capital_injection || 0
        );

        const quarters = ['q1', 'q2', 'q3', 'q4'] as const;
        const monthlyChartData = interpolateToMonthly(adjusted, quarters);

        return { kpis: calculatedKpis, chartData: monthlyChartData };
    }, [activeFinancials]);

    if (isLoading) {
        return (
            <div className="incubatormetrics_container">
                <div className="incubatormetrics_detailheader">
                    <Button variant="secondary" size="sm" onClick={onBack} className="incubatormetrics_backbtn">
                        <FiArrowLeft size={18} />
                        {t('back') || 'Volver'}
                    </Button>
                    <h1 className="incubatormetrics_title">{startupName}</h1>
                </div>
                <div className="incubatormetrics_loading">
                    <Spinner variant="primary" size="lg" />
                    <p>{t('loading') || 'Cargando datos financieros...'}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="incubatormetrics_container">
                <div className="incubatormetrics_detailheader">
                    <Button variant="secondary" size="sm" onClick={onBack} className="incubatormetrics_backbtn">
                        <FiArrowLeft size={18} />
                        {t('back') || 'Volver'}
                    </Button>
                    <h1 className="incubatormetrics_title">{startupName}</h1>
                </div>
                <div className="incubatormetrics_error">
                    <h3>{t('error_loading_data') || 'Error al cargar datos'}</h3>
                    <p>{t('startup_no_campaign') || 'Esta startup no tiene datos de campaña disponibles.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="incubatormetrics_container">
            {/* Header with Back Button */}
            <div className="incubatormetrics_detailheader">
                <Button variant="secondary" size="sm" onClick={onBack} className="incubatormetrics_backbtn">
                    <FiArrowLeft size={18} />
                    {t('back') || 'Volver'}
                </Button>
                <div>
                    <h1 className="incubatormetrics_title">{startupName}</h1>
                    <p className="incubatormetrics_subtitle">{t('financial_dashboard') || 'Dashboard Financiero'}</p>
                </div>
            </div>

            {/* Data source indicator */}
            <div className="incubatormetrics_demobanner">
                <strong>⚠️ Modo Demo:</strong> Esta startup no tiene proyecciones financieras configuradas.
            </div>

            {/* KPI Metrics Grid */}
            <div className="incubatormetrics_financegrid">
                <DashboardMetricCard
                    title="VAN (NPV)"
                    value={`$${kpis.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    secondaryValue={`Capital: $${totalCapitalInjection.toLocaleString()}`}
                    trend={kpis.npv > 0 ? 'up' : 'down'}
                />
                <DashboardMetricCard
                    title="TIR (IRR)"
                    value={isNaN(kpis.irr) ? 'N/A' : `${(kpis.irr * 100).toFixed(2)}%`}
                    secondaryValue="Retorno esperado"
                    trend={kpis.irr > 0.15 ? 'up' : 'neutral'}
                />
                <DashboardMetricCard
                    title="EBITDA Total"
                    value={`$${kpis.ebitda.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    secondaryValue="4 Quarters"
                    trend={kpis.ebitda > 0 ? 'up' : 'down'}
                />
                <DashboardMetricCard
                    title="Utilidad Bruta"
                    value={`$${kpis.grossProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    secondaryValue="4 Quarters"
                    trend="up"
                />
            </div>

            {/* Campaign Funding Progress */}
            {currentRound && (
                <div className="incubatormetrics_financegrid incubatormetrics_financegrid_secondary">
                    <DashboardMetricCard
                        title={`Ronda: ${currentRound.name}`}
                        value={`$${totalCapitalInjection.toLocaleString()}`}
                        secondaryValue={`de $${Number(currentRound.target_amount).toLocaleString()} (${((totalCapitalInjection / Number(currentRound.target_amount)) * 100).toFixed(1)}%)`}
                        trend={totalCapitalInjection >= Number(currentRound.target_amount) ? 'up' : 'neutral'}
                    />
                    <DashboardMetricCard
                        title="Valoración Pre-Money"
                        value={`$${Number(currentRound.pre_money_valuation).toLocaleString()}`}
                        secondaryValue={currentRound.status}
                        trend="neutral"
                    />
                    <DashboardMetricCard
                        title="Inversores"
                        value={currentRound.investors?.filter((i: Investor) => i.status === 'COMMITTED').length.toString() || '0'}
                        secondaryValue="COMMITTED"
                        trend="up"
                    />
                    <DashboardMetricCard
                        title="Fecha Cierre"
                        value={currentRound.target_close_date || 'N/A'}
                        secondaryValue={currentRound.status === 'OPEN' ? 'Ronda abierta' : currentRound.status}
                        trend="neutral"
                    />
                </div>
            )}

            {/* Charts */}
            <div className="incubatormetrics_chartsgrid">
                <CashFlowChart
                    financialData={chartData as any}
                    revenueMultiplier={1}
                    costMultiplier={1}
                />
                <RevenueVsCostsChart
                    financialData={chartData as any}
                    revenueMultiplier={1}
                    costMultiplier={1}
                />
            </div>

            {/* KPI Panel */}
            <KPIPanel kpis={kpis} />
        </div>
    );
};

// ============================================================================
// Main Incubator Metrics Component
// ============================================================================
interface SelectedStartup {
    id: number;
    name: string;
}

const IncubatorMetrics: React.FC = () => {
    const { t } = useTranslation('common');
    const [selectedStartup, setSelectedStartup] = useState<SelectedStartup | null>(null);

    // Fetch portfolio campaigns data
    const { data: portfolioCampaigns, isLoading, error } = useQuery({
        queryKey: ['incubator-portfolio-campaigns'],
        queryFn: fetchPortfolioCampaigns,
    });

    // Calculate aggregated KPIs
    const kpis = useMemo(() => {
        if (!portfolioCampaigns || portfolioCampaigns.length === 0) {
            return {
                totalCapitalTarget: 0,
                totalCapitalCommitted: 0,
                averageTRL: 0,
                averageCRL: 0,
                totalStartups: 0,
                startupsWithCampaigns: 0,
            };
        }

        let totalFundingGoal = 0;
        let totalCommitted = 0;
        let trlSum = 0;
        let trlCount = 0;
        let crlSum = 0;
        let crlCount = 0;
        let startupsWithCampaigns = 0;

        portfolioCampaigns.forEach((startup: PortfolioCampaignDTO) => {
            if (startup.trl_level !== null) {
                trlSum += startup.trl_level;
                trlCount++;
            }
            if (startup.crl_level !== null) {
                crlSum += startup.crl_level;
                crlCount++;
            }

            if (startup.campaign?.financials) {
                startupsWithCampaigns++;
                const financials = startup.campaign.financials;
                totalFundingGoal += financials.funding_goal || 0;
                totalCommitted += financials.total_capital_injection || 0;
            }
        });

        return {
            totalCapitalTarget: totalFundingGoal,
            totalCapitalCommitted: totalCommitted,
            averageTRL: trlCount > 0 ? trlSum / trlCount : 0,
            averageCRL: crlCount > 0 ? crlSum / crlCount : 0,
            totalStartups: portfolioCampaigns.length,
            startupsWithCampaigns,
        };
    }, [portfolioCampaigns]);

    const formatCurrency = (value: number): string => {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`;
        }
        return `$${value.toLocaleString()}`;
    };

    const handleViewFinances = (startupId: number, startupName: string) => {
        setSelectedStartup({ id: startupId, name: startupName });
    };

    const handleBack = () => {
        setSelectedStartup(null);
    };

    // If viewing a specific startup, show the financial detail view
    if (selectedStartup) {
        return (
            <StartupFinancialView
                startupId={selectedStartup.id}
                startupName={selectedStartup.name}
                onBack={handleBack}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="incubatormetrics_container">
                <div className="incubatormetrics_loading">
                    <Spinner variant="primary" size="lg" />
                    <p>{t('loading') || 'Cargando métricas...'}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="incubatormetrics_container">
                <div className="incubatormetrics_error">
                    <h2>{t('error_loading_data') || 'Error al cargar datos'}</h2>
                    <p>{t('try_again_later') || 'Intenta de nuevo más tarde'}</p>
                </div>
            </div>
        );
    }

    const portfolio = portfolioCampaigns || [];

    return (
        <div className="incubatormetrics_container">
            {/* Header */}
            <div className="incubatormetrics_header">
                <div>
                    <h1 className="incubatormetrics_title">
                        {t('portfolio_metrics') || 'Métricas del Portafolio'}
                    </h1>
                    <p className="incubatormetrics_subtitle">
                        {t('portfolio_metrics_description') || 'Visión agregada del desempeño financiero de tu ecosistema'}
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="incubatormetrics_kpigrid">
                <MetricCard
                    title={t('total_capital_target') || 'Capital Buscado (Target)'}
                    value={formatCurrency(kpis.totalCapitalTarget)}
                    detail={`${kpis.startupsWithCampaigns} startups con campaña activa`}
                    icon="🎯"
                    type="capital"
                />
                <MetricCard
                    title={t('total_capital_committed') || 'Capital Comprometido'}
                    value={formatCurrency(kpis.totalCapitalCommitted)}
                    detail={kpis.totalCapitalTarget > 0
                        ? `${((kpis.totalCapitalCommitted / kpis.totalCapitalTarget) * 100).toFixed(1)}% del objetivo`
                        : 'Sin objetivo definido'}
                    icon="💰"
                    type="revenue"
                />
                <MetricCard
                    title={t('average_trl') || 'Promedio TRL'}
                    value={kpis.averageTRL.toFixed(1)}
                    detail={`De ${kpis.totalStartups} startups`}
                    icon="🔬"
                    type="startup"
                />
                <MetricCard
                    title={t('average_crl') || 'Promedio CRL'}
                    value={kpis.averageCRL.toFixed(1)}
                    detail={`De ${kpis.totalStartups} startups`}
                    icon="📈"
                    type="success"
                />
            </div>

            {/* Portfolio Table */}
            <div className="incubatormetrics_tablecard">
                <div className="incubatormetrics_tableheader">
                    <h2>{t('portfolio_detail') || 'Detalle del Portafolio'}</h2>
                    <span className="incubatormetrics_count">
                        {portfolio.length} {t('startups') || 'startups'}
                    </span>
                </div>

                <div className="incubatormetrics_tablecontainer">
                    <table className="incubatormetrics_table">
                        <thead>
                            <tr>
                                <th>{t('startup') || 'Startup'}</th>
                                <th>{t('industry') || 'Industria'}</th>
                                <th>TRL</th>
                                <th>CRL</th>
                                <th>{t('funding_goal') || 'Capital Buscado'}</th>
                                <th>{t('capital_committed') || 'Capital Comprometido'}</th>
                                <th>{t('burn_rate') || 'Burn Rate'}</th>
                                <th>{t('actions') || 'Acciones'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="incubatormetrics_empty">
                                        {t('no_startups_in_portfolio') || 'No hay startups en el portafolio'}
                                    </td>
                                </tr>
                            ) : (
                                portfolio.map((startup: PortfolioCampaignDTO) => {
                                    const hasCampaign = startup.campaign !== null;
                                    const financials = startup.campaign?.financials;

                                    return (
                                        <tr key={startup.id}>
                                            <td>
                                                <div className="incubatormetrics_startup">
                                                    <div className="incubatormetrics_logo">
                                                        {startup.logo_url ? (
                                                            <img
                                                                src={startup.logo_url}
                                                                alt={startup.startup_name}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '';
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="incubatormetrics_logo_placeholder">
                                                                {startup.startup_name.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="incubatormetrics_startupname">
                                                        {startup.startup_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="incubatormetrics_industry">
                                                    {startup.industry || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`incubatormetrics_level ${startup.trl_level !== null ? 'active' : 'inactive'}`}>
                                                    {startup.trl_level !== null ? startup.trl_level : 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`incubatormetrics_level ${startup.crl_level !== null ? 'active' : 'inactive'}`}>
                                                    {startup.crl_level !== null ? startup.crl_level : 'N/A'}
                                                </span>
                                            </td>
                                            <td className={!hasCampaign ? 'incubatormetrics_na' : ''}>
                                                {hasCampaign && financials?.funding_goal
                                                    ? formatCurrency(financials.funding_goal)
                                                    : <span className="incubatormetrics_natext">N/A</span>
                                                }
                                            </td>
                                            <td className={!hasCampaign ? 'incubatormetrics_na' : ''}>
                                                {hasCampaign && financials && financials.total_capital_injection !== null
                                                    ? formatCurrency(financials.total_capital_injection ?? 0)
                                                    : <span className="incubatormetrics_natext">N/A</span>
                                                }
                                            </td>
                                            <td className={!hasCampaign ? 'incubatormetrics_na' : ''}>
                                                {hasCampaign && financials?.monthly_burn_rate
                                                    ? `${formatCurrency(financials.monthly_burn_rate)}/mes`
                                                    : <span className="incubatormetrics_natext">N/A</span>
                                                }
                                            </td>
                                            <td>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleViewFinances(startup.startup_id, startup.startup_name)}
                                                    disabled={!hasCampaign}
                                                    className="incubatormetrics_actionbtn"
                                                >
                                                    <FiEye size={14} />
                                                    {t('view_finances') || 'Ver Finanzas'}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="incubatormetrics_summary">
                <div className="incubatormetrics_summaryitem">
                    <FiTrendingUp className="incubatormetrics_summaryicon" />
                    <div>
                        <span className="incubatormetrics_summarylabel">
                            {t('funding_progress') || 'Progreso de Financiamiento'}
                        </span>
                        <span className="incubatormetrics_summaryvalue">
                            {kpis.totalCapitalTarget > 0
                                ? `${((kpis.totalCapitalCommitted / kpis.totalCapitalTarget) * 100).toFixed(1)}%`
                                : '0%'}
                        </span>
                    </div>
                </div>
                <div className="incubatormetrics_summaryitem">
                    <FiActivity className="incubatormetrics_summaryicon" />
                    <div>
                        <span className="incubatormetrics_summarylabel">
                            {t('active_campaigns') || 'Campañas Activas'}
                        </span>
                        <span className="incubatormetrics_summaryvalue">
                            {kpis.startupsWithCampaigns} / {kpis.totalStartups}
                        </span>
                    </div>
                </div>
                <div className="incubatormetrics_summaryitem">
                    <FiDollarSign className="incubatormetrics_summaryicon" />
                    <div>
                        <span className="incubatormetrics_summarylabel">
                            {t('capital_gap') || 'Brecha de Capital'}
                        </span>
                        <span className="incubatormetrics_summaryvalue">
                            {formatCurrency(Math.max(0, kpis.totalCapitalTarget - kpis.totalCapitalCommitted))}
                        </span>
                    </div>
                </div>
                <div className="incubatormetrics_summaryitem">
                    <FiTarget className="incubatormetrics_summaryicon" />
                    <div>
                        <span className="incubatormetrics_summarylabel">
                            {t('readiness_score') || 'Score de Madurez'}
                        </span>
                        <span className="incubatormetrics_summaryvalue">
                            {((kpis.averageTRL + kpis.averageCRL) / 2).toFixed(1)} / 9
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncubatorMetrics;
