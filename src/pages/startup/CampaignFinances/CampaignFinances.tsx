
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

import Button from '@/components/common/Button/Button';
import Input from '@/components/forms/Input/Input'; // Assuming a range input component exists or will be created
import type { CampaignFinancials } from '@/types/campaigns';
import {
    applySensitivityAndCalculateQuarterlyMetrics,
    calculateAllKPIs,
    formatFinancialDataForExcel,
} from '@/utils/financialMath';


import axiosInstance from '@/api/axiosInstance';
import * as XLSX from 'xlsx'; // For Excel export

import './CampaignFinances.css';

// Mock component for chart (replace with actual chart library components)
const FinancialChart = ({ title, data, type = 'bar' }: { title: string; data: number[]; type?: string }) => (
    <div className="finanzas-dashboard_chart-placeholder">
        <h4>{title}</h4>
        <p>Chart of type {type} goes here</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
);

const CampaignFinances: React.FC = () => {
    const { t } = useTranslation('common');
    const { id } = useParams<{ id: string }>(); // Campaign ID from URL

    // --- TAREA 1: DATA FETCHING Y ESTADO ---
    // 1. Data Fetch: useQuery para obtener CampaignFinancials
    const { data: campaignFinancials, isLoading, error } = useQuery<CampaignFinancials>({
        queryKey: ['campaignFinancials', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/campaigns/${id}/financials/`);
            return response.data;
        },
        enabled: !!id, // Only run query if ID is available
    });

    // 2. Estado Local (Sliders): revenueVariation y costVariation
    const [revenueVariation, setRevenueVariation] = useState<number>(0); // -100 to 100
    const [costVariation, setCostVariation] = useState<number>(0);     // -100 to 100

    // --- TAREA 2: LÓGICA DE CÁLCULO (useMemo) ---
    // adjustedFinancialData como FUENTE ÚNICA de verdad
    const { adjustedProjections, calculatedKPIs } = useMemo(() => {
        if (!campaignFinancials?.financial_projections) {
            return { adjustedProjections: null, calculatedKPIs: null };
        }

        const currentAdjustedProjections = applySensitivityAndCalculateQuarterlyMetrics(
            campaignFinancials,
            revenueVariation,
            costVariation
        );

        const currentCalculatedKPIs = calculateAllKPIs(currentAdjustedProjections);

        return {
            adjustedProjections: currentAdjustedProjections,
            calculatedKPIs: currentCalculatedKPIs,
        };
    }, [campaignFinancials, revenueVariation, costVariation]);

    if (isLoading) {
        return <div className="finanzas-dashboard_loading">{t('loading')}...</div>;
    }

    if (error) {
        return <div className="finanzas-dashboard_error">{t('error_fetching_data')}: {error.message}</div>;
    }

    if (!campaignFinancials) {
        return <div className="finanzas-dashboard_no-data">{t('no_financial_data_available')}</div>;
    }

    const quarters = ['q1', 'q2', 'q3', 'q4'] as const;

    // --- Helper function for Excel Export ---
    const handleDownloadExcel = () => {
        if (!campaignFinancials || !adjustedProjections || !calculatedKPIs) {
            toast.error(t('excel_download_data_missing'));
            return;
        }

        try {
            const excelData = formatFinancialDataForExcel(
                campaignFinancials,
                adjustedProjections,
                calculatedKPIs,
                revenueVariation,
                costVariation
            );

            const ws = XLSX.utils.aoa_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Financial Dashboard");
            XLSX.writeFile(wb, `Financial_Dashboard_Campaign_${id}.xlsx`);
            toast.success(t('excel_download_success'));
        } catch (exportError: any) {
            toast.error(`${t('excel_download_error')}: ${exportError.message}`);
            console.error('Excel export error:', exportError);
        }
    };


    // --- TAREA 3: RENDERING DE COMPONENTES (UI) ---
    return (
        <div className="finanzas-dashboard_container">
            <h1 className="finanzas-dashboard_title">{t('financial_dashboard_title')}</h1>

            <div className="finanzas-dashboard_actions">
                <Button onClick={handleDownloadExcel} variant="primary">
                    {t('download_excel')}
                </Button>
            </div>

            {/* KPI Cards (Header) */}
            <section className="finanzas-dashboard_kpi-grid">
                {/* Dynamically render KPI cards based on calculatedKPIs */}
                <div className="finanzas-dashboard_kpi-card">
                    <span className="finanzas-dashboard_kpi-label">{t('gross_profit')}</span>
                    <span className="finanzas-dashboard_kpi-value">{calculatedKPIs?.grossProfit?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="finanzas-dashboard_kpi-card">
                    <span className="finanzas-dashboard_kpi-label">{t('ebitda')}</span>
                    <span className="finanzas-dashboard_kpi-value">{calculatedKPIs?.ebitda?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="finanzas-dashboard_kpi-card">
                    <span className="finanzas-dashboard_kpi-label">{t('npv_van')}</span>
                    <span className="finanzas-dashboard_kpi-value">{calculatedKPIs?.npv?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="finanzas-dashboard_kpi-card">
                    <span className="finanzas-dashboard_kpi-label">{t('irr_tir')}</span>
                    <span className="finanzas-dashboard_kpi-value">{(calculatedKPIs?.irr && !isNaN(calculatedKPIs.irr) ? (calculatedKPIs.irr * 100).toFixed(2) + '%' : 'N/A')}</span>
                </div>
                {/* TODO: Add Breakeven Point, ROE, and other relevant KPIs */}
            </section>

            {/* Charts */}
            <section className="finanzas-dashboard_charts">
                <FinancialChart
                    title={t('cash_flow_projection')}
                    data={quarters.map(q => adjustedProjections?.[q]?.freeCashFlow || 0)}
                    type="line"
                />
                <FinancialChart
                    title={t('revenue_vs_costs')}
                    data={
                        [
                            ...quarters.map(q => adjustedProjections?.[q]?.adjustedRevenue || 0),
                            ...quarters.map(q => (adjustedProjections?.[q]?.adjustedCogs || 0) + (adjustedProjections?.[q]?.opex || 0)) // Total Costs
                        ]
                    }
                    type="bar"
                />
            </section>

            {/* Sensitivity Analysis: Sliders and Detailed Cash Flow Table */}
            <section className="finanzas-dashboard_sensitivity-analysis">
                <h3>{t('sensitivity_analysis')}</h3>

                <div className="finanzas-dashboard_sliders">
                    <div className="finanzas-dashboard_slider-group">
                        <label htmlFor="revenue-slider">{t('revenue_variation')}: {revenueVariation}%</label>
                        <Input
                            type="range"
                            name="revenue-slider"
                            min="-50"
                            max="50"
                            value={String(revenueVariation)}
                            setValue={(val: string) => setRevenueVariation(Number(val))}
                            classNames="finanzas-dashboard_range-input"
                        />
                    </div>
                    <div className="finanzas-dashboard_slider-group">
                        <label htmlFor="cost-slider">{t('cost_variation')}: {costVariation}%</label>
                        <Input
                            type="range"
                            name="cost-slider"
                            min="-50"
                            max="50"
                            value={String(costVariation)}
                            setValue={(val: string) => setCostVariation(Number(val))}
                            classNames="finanzas-dashboard_range-input"
                        />
                    </div>
                </div>

                <h4>{t('detailed_cash_flow')}</h4>
                <div className="finanzas-dashboard_table-container">
                    <table className="finanzas-dashboard_table">
                        <thead>
                            <tr>
                                <th>{t('metric')}</th>
                                {quarters.map(q => <th key={q}>{t(`quarter_${q.toUpperCase()}`)}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{t('original_revenue')}</td>
                                {quarters.map(q => <td key={q}>{campaignFinancials.financial_projections[q].revenue?.toFixed(2) || 'N/A'}</td>)}
                            </tr>
                            <tr>
                                <td>{t('adjusted_revenue')}</td>
                                {quarters.map(q => <td key={q}>{adjustedProjections?.[q]?.adjustedRevenue?.toFixed(2) || 'N/A'}</td>)}
                            </tr>
                            <tr>
                                <td>{t('original_cogs')}</td>
                                {quarters.map(q => <td key={q}>{campaignFinancials.financial_projections[q].cogs?.toFixed(2) || 'N/A'}</td>)}
                            </tr>
                            <tr>
                                <td>{t('adjusted_cogs')}</td>
                                {quarters.map(q => <td key={q}>{adjustedProjections?.[q]?.adjustedCogs?.toFixed(2) || 'N/A'}</td>)}
                            </tr>
                            <tr>
                                <td>{t('original_opex')}</td>
                                {quarters.map(q => <td key={q}>{campaignFinancials.financial_projections[q].opex?.toFixed(2) || 'N/A'}</td>)}
                            </tr>
                            <tr className="finanzas-dashboard_table-highlight">
                                <td>{t('gross_profit')}</td>
                                {quarters.map(q => <td key={q}>{adjustedProjections?.[q]?.grossProfit?.toFixed(2) || 'N/A'}</td>)}
                            </tr>
                            <tr className="finanzas-dashboard_table-highlight">
                                <td>{t('ebitda')}</td>
                                {quarters.map(q => <td key={q}>{adjustedProjections?.[q]?.ebitda?.toFixed(2) || 'N/A'}</td>)}
                            </tr>
                            <tr className="finanzas-dashboard_table-highlight">
                                <td>{t('free_cash_flow')}</td>
                                {quarters.map(q => <td key={q}>{adjustedProjections?.[q]?.freeCashFlow?.toFixed(2) || 'N/A'}</td>)}
                            </tr>
                            {/* TODO: Add more detailed metrics as needed (e.g., net income, tax, etc.) */}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default CampaignFinances;
