import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MetricCard from '../../../components/dashboard/MetricCard/MetricCard';
import CashFlowChart from '../../../components/dashboard/CashFlowChart/CashFlowChart';
import RevenueVsCostsChart from '../../../components/dashboard/RevenueVsCostsChart/RevenueVsCostsChart';
import SensitivityAnalysis from '../../../components/dashboard/SensitivityAnalysis/SensitivityAnalysis';
import CashFlowTable from '../../../components/dashboard/CashFlowTable/CashFlowTable';
import Button from '@/components/common/Button/Button';
import { useFinancialData } from '../../../hooks/useStartupData';
import './Finanzas.css';
import { FiDownload } from "react-icons/fi";
import * as XLSX from 'xlsx';

const mockMetrics = [
    { title: "Utilidad Bruta", value: "68%", secondaryValue: "$340K", trend: "up", },
    { title: "Utilidad Operativa", value: "45%", secondaryValue: "$120K", trend: "up", },
    { title: "Utilidad Neta", value: "32%", secondaryValue: "$50K", trend: "down", },
    { title: "Costos Fijos", value: "52%", secondaryValue: "$85K", trend: "up", },
    { title: "ARR (12 meses)", value: "$2.4M", secondaryValue: "vs PMG 17%", trend: "up", },
    { title: "Churn", value: "26%", secondaryValue: "10K usuarios", trend: "down", },
    { title: "Punto de Equilibrio", value: "18 meses", secondaryValue: "2.5M unidades", trend: "up", },
    { title: "ROE", value: "24 meses", secondaryValue: "Retorno accionistas", trend: "up", }
];

const Finanzas: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: financialData } = useFinancialData();

    // State for sensitivity analysis multipliers
    const [revenueMultiplier, setRevenueMultiplier] = useState<number>(1);
    const [costMultiplier, setCostMultiplier] = useState<number>(1);

    // Sort financial data by date (most recent first)
    const sortedFinancialData = useMemo(() => {
        if (!financialData || financialData.length === 0) return [];

        return [...financialData].sort((a, b) => new Date(b.period_date).getTime() - new Date(a.period_date).getTime());
    }, [financialData]);

    // Calculate real metrics from financial data
    const realMetrics = useMemo(() => {
        if (!sortedFinancialData || sortedFinancialData.length === 0) return null;

        const latest = sortedFinancialData[0]; // Most recent data
        const previous = sortedFinancialData[1]; // Previous period for comparison

        // Apply sensitivity multipliers
        const adjustedRevenue = latest.revenue * revenueMultiplier;
        const adjustedCosts = latest.costs * costMultiplier;
        const adjustedNetCashFlow = adjustedRevenue - adjustedCosts;

        // Helper function to determine trend based on value sign and comparison
        const getTrend = (current: number, prev: number | undefined, lowerIsBetter: boolean = false): 'up' | 'down' => {
            if (!prev) {
                // If no previous data, use simple logic based on whether lower is better
                if (lowerIsBetter) {
                    // For costs and burn rate: positive values show red
                    return current > 0 ? 'down' : 'up';
                }
                // For revenue and cash flow: positive values show green
                return current >= 0 ? 'up' : 'down';
            }

            // Compare with previous period
            const isIncreasing = current > prev;

            if (lowerIsBetter) {
                // For costs/burn: decreasing is good (green), increasing is bad (red)
                return isIncreasing ? 'down' : 'up';
            }
            // For revenue/cash: increasing is good (green), decreasing is bad (red)
            return isIncreasing ? 'up' : 'down';
        };

        return [
            {
                title: t('revenue'),
                value: `$${Number(adjustedRevenue).toLocaleString()}`,
                secondaryValue: t('latest_period'),
                trend: getTrend(adjustedRevenue, previous ? previous.revenue * revenueMultiplier : undefined, false)
            },
            {
                title: t('costs'),
                value: `$${Number(adjustedCosts).toLocaleString()}`,
                secondaryValue: t('latest_period'),
                trend: getTrend(adjustedCosts, previous ? previous.costs * costMultiplier : undefined, true)
            },
            {
                title: t('net_cash_flow'),
                value: `$${Number(adjustedNetCashFlow).toLocaleString()}`,
                secondaryValue: t('latest_period'),
                trend: getTrend(adjustedNetCashFlow, previous ? (previous.revenue * revenueMultiplier - previous.costs * costMultiplier) : undefined, false)
            },
            {
                title: t('cash_balance'),
                value: `$${Number(latest.cash_balance).toLocaleString()}`,
                secondaryValue: t('current'),
                trend: getTrend(latest.cash_balance, previous?.cash_balance, false)
            },
            {
                title: t('monthly_burn_rate'),
                value: `$${Number(latest.monthly_burn).toLocaleString()}`,
                secondaryValue: t('monthly'),
                trend: getTrend(latest.monthly_burn, previous?.monthly_burn, true)
            },
            {
                title: t('runway'),
                value: latest.cash_balance > 0 && latest.monthly_burn > 0
                    ? `${Math.floor(latest.cash_balance / latest.monthly_burn)} ${t('months')}`
                    : t('not_available'),
                secondaryValue: t('time_remaining'),
                trend: 'neutral' as const
            },
        ];
    }, [sortedFinancialData, revenueMultiplier, costMultiplier, t]);

    const metricsToShow = realMetrics || mockMetrics;

    // Manejador de clic para descargar el archivo de Excel
    const handleDownloadExcel = async () => {
        try {
            // Create workbook
            const wb = XLSX.utils.book_new();

            // 1. Create metrics sheet
            const metricsData = metricsToShow.map(metric => ({
                'Métrica': metric.title,
                'Valor': metric.value,
                'Descripción': metric.secondaryValue,
                'Tendencia': metric.trend === 'up' ? '↑ Positivo' : metric.trend === 'down' ? '↓ Negativo' : '→ Neutral'
            }));
            const wsMetrics = XLSX.utils.json_to_sheet(metricsData);
            XLSX.utils.book_append_sheet(wb, wsMetrics, 'Métricas');

            // 2. Create financial data sheet
            if (sortedFinancialData && sortedFinancialData.length > 0) {
                const financialDataFormatted = sortedFinancialData.map(data => ({
                    'Fecha': new Date(data.period_date).toLocaleDateString('es-ES'),
                    'Ingresos': data.revenue,
                    'Costos': data.costs,
                    'Flujo de Caja Neto': data.revenue - data.costs,
                    'Balance de Efectivo': data.cash_balance,
                    'Tasa de Quema Mensual': data.monthly_burn,
                    'Notas': data.notes || ''
                }));
                const wsFinancial = XLSX.utils.json_to_sheet(financialDataFormatted);
                XLSX.utils.book_append_sheet(wb, wsFinancial, 'Datos Financieros');

                // 3. Create chart data sheet for Cash Flow
                const cashFlowChartData = sortedFinancialData.map(data => ({
                    'Periodo': new Date(data.period_date).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
                    'Flujo de Caja Neto': (data.revenue * revenueMultiplier) - (data.costs * costMultiplier)
                }));
                const wsCashFlow = XLSX.utils.json_to_sheet(cashFlowChartData);
                XLSX.utils.book_append_sheet(wb, wsCashFlow, 'Gráfica Flujo de Caja');

                // 4. Create chart data sheet for Revenue vs Costs
                const revenueVsCostsData = sortedFinancialData.map(data => ({
                    'Periodo': new Date(data.period_date).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
                    'Ingresos': data.revenue * revenueMultiplier,
                    'Costos': data.costs * costMultiplier
                }));
                const wsRevenueCosts = XLSX.utils.json_to_sheet(revenueVsCostsData);
                XLSX.utils.book_append_sheet(wb, wsRevenueCosts, 'Gráfica Ingresos vs Costos');

                // 5. Create sensitivity analysis sheet
                const sensitivityData = [
                    {
                        'Análisis': 'Multiplicador de Ingresos',
                        'Valor': revenueMultiplier,
                        'Descripción': 'Factor aplicado a los ingresos'
                    },
                    {
                        'Análisis': 'Multiplicador de Costos',
                        'Valor': costMultiplier,
                        'Descripción': 'Factor aplicado a los costos'
                    },
                    {
                        'Análisis': 'Ingresos Ajustados (Último Periodo)',
                        'Valor': sortedFinancialData[0].revenue * revenueMultiplier,
                        'Descripción': 'Ingresos con multiplicador aplicado'
                    },
                    {
                        'Análisis': 'Costos Ajustados (Último Periodo)',
                        'Valor': sortedFinancialData[0].costs * costMultiplier,
                        'Descripción': 'Costos con multiplicador aplicado'
                    },
                    {
                        'Análisis': 'Flujo de Caja Neto Ajustado',
                        'Valor': (sortedFinancialData[0].revenue * revenueMultiplier) - (sortedFinancialData[0].costs * costMultiplier),
                        'Descripción': 'Flujo neto con análisis de sensibilidad'
                    }
                ];
                const wsSensitivity = XLSX.utils.json_to_sheet(sensitivityData);
                XLSX.utils.book_append_sheet(wb, wsSensitivity, 'Análisis de Sensibilidad');
            }

            // Generate filename with current date
            const today = new Date();
            const filename = `Reporte_Financiero_${today.getFullYear()}_${String(today.getMonth() + 1).padStart(2, '0')}_${String(today.getDate()).padStart(2, '0')}.xlsx`;

            // Write file
            XLSX.writeFile(wb, filename);

        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            alert('Error al generar el archivo Excel');
        }
    };

    return (
        <div className="finanzas-container">
            <div className='finanzas-header-container'>
                <div>
                    <h1 className="finanzas-main-title">
                        {t('financial_dashboard')}
                    </h1>
                    <p className="finanzas-subtitle">
                        {t('manage_financial_projections')}
                    </p>
                </div>


                <div className='button-container'>
                    <Button
                        variant={'secondary'}
                        size="lg"
                        // Llama a la función handleDownloadExcel en el evento onClick
                        onClick={handleDownloadExcel}
                        className="typeselectioncard-button"
                    >
                        <FiDownload size={20} /> Exportar Excel
                    </Button>

                </div>
            </div>


            {/* Metrics Grid */}
            <div className="finanzas-metrics-grid">

                {metricsToShow.map((metric, index) => (
                    <MetricCard
                        key={index}
                        title={metric.title}
                        value={metric.value}
                        secondaryValue={metric.secondaryValue}
                        trend={metric.trend as 'up' | 'down' | 'neutral'} // Casting para asegurar el tipo
                    />
                ))}
            </div>

            {/* Charts Grid */}
            <div className="finanzas-charts-grid">
                <CashFlowChart
                    financialData={sortedFinancialData}
                    revenueMultiplier={revenueMultiplier}
                    costMultiplier={costMultiplier}
                />
                <RevenueVsCostsChart
                    financialData={sortedFinancialData}
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

            {/* Cash Flow Table */}
            <CashFlowTable />
        </div>
    );
};

export default Finanzas;

