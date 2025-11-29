import React from 'react';
import { useTranslation } from 'react-i18next';
import './CashFlowTable.css';

interface QuarterData {
    quarter: string;
    revenue: number;
    costs: number;
    netCashFlow: number;
}

const CashFlowTable: React.FC = () => {
    const { t } = useTranslation('common');

    const cashFlowData: QuarterData[] = [
        { quarter: 'Q1 2024', revenue: 125000, costs: 95000, netCashFlow: 30000 },
        { quarter: 'Q2 2024', revenue: 145000, costs: 105000, netCashFlow: 40000 },
        { quarter: 'Q3 2024', revenue: 165000, costs: 115000, netCashFlow: 50000 },
        { quarter: 'Q4 2024', revenue: 185000, costs: 125000, netCashFlow: 60000 },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const totals = cashFlowData.reduce(
        (acc, curr) => ({
            revenue: acc.revenue + curr.revenue,
            costs: acc.costs + curr.costs,
            netCashFlow: acc.netCashFlow + curr.netCashFlow,
        }),
        { revenue: 0, costs: 0, netCashFlow: 0 }
    );

    return (
        <div className="cashflowtable-container">
            <h3 className="cashflowtable-title">{t('detailed_cash_flow')}</h3>
            <div className="cashflowtable-wrapper">
                <table className="cashflowtable-table">
                    <thead>
                        <tr>
                            <th>{t('period')}</th>
                            <th>{t('revenue')}</th>
                            <th>{t('costs')}</th>
                            <th>{t('net_cash_flow')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cashFlowData.map((data, index) => (
                            <tr key={index}>
                                <td className="cashflowtable-quarter">{data.quarter}</td>
                                <td className="cashflowtable-revenue">
                                    {formatCurrency(data.revenue)}
                                </td>
                                <td className="cashflowtable-costs">
                                    {formatCurrency(data.costs)}
                                </td>
                                <td className="cashflowtable-netflow">
                                    {formatCurrency(data.netCashFlow)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="cashflowtable-total-label">{t('total')}</td>
                            <td className="cashflowtable-total-value">
                                {formatCurrency(totals.revenue)}
                            </td>
                            <td className="cashflowtable-total-value">
                                {formatCurrency(totals.costs)}
                            </td>
                            <td className="cashflowtable-total-value cashflowtable-total-highlight">
                                {formatCurrency(totals.netCashFlow)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default CashFlowTable;
