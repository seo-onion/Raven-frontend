import React, { useMemo } from 'react';
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

    // Calculate real metrics from financial data
    const realMetrics = useMemo(() => {
        if (!financialData || financialData.length === 0) return null;

        const latest = financialData[0]; // Most recent data

        return [
            {
                title: t('revenue'),
                value: `$${Number(latest.revenue).toLocaleString()}`,
                secondaryValue: t('latest_period'),
                trend: "up" as const
            },
            {
                title: t('costs'),
                value: `$${Number(latest.costs).toLocaleString()}`,
                secondaryValue: t('latest_period'),
                trend: "down" as const
            },
            {
                title: t('net_cash_flow'),
                value: `$${Number(latest.net_cash_flow).toLocaleString()}`,
                secondaryValue: t('latest_period'),
                trend: latest.net_cash_flow >= 0 ? "up" as const : "down" as const
            },
            {
                title: t('cash_balance'),
                value: `$${Number(latest.cash_balance).toLocaleString()}`,
                secondaryValue: t('current'),
                trend: "up" as const
            },
            {
                title: t('monthly_burn_rate'),
                value: `$${Number(latest.monthly_burn).toLocaleString()}`,
                secondaryValue: t('monthly'),
                trend: "down" as const
            },
        ];
    }, [financialData, t]);

    const metricsToShow = realMetrics || mockMetrics;

    // Manejador de clic para descargar el archivo de Excel
    const handleDownloadExcel = () => {
        // Define la URL del archivo de Excel que quieres descargar
        // Este es un ejemplo público de un archivo de Excel de prueba. 
        // Reemplázalo con la URL real de tu archivo.
        const excelUrl = 'go.microsoft.com';

        // Crea un enlace temporal
        const link = document.createElement('a');
        link.href = excelUrl;
        // Asigna un nombre de archivo sugerido para la descarga
        link.setAttribute('download', 'Reporte_Finanzas.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                <CashFlowChart />
                <RevenueVsCostsChart />
            </div>

            {/* Sensitivity Analysis */}
            <SensitivityAnalysis />

            {/* Cash Flow Table */}
            <CashFlowTable />
        </div>
    );
};

export default Finanzas;
