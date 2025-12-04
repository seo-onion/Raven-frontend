import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { RowData, KPIData } from '@/types/formulaGrid';
import { recalculateGrid, toCellReference } from '@/utils/formulaEngine';
import Button from '@/components/common/Button/Button';
import './FormulaGrid.css';

interface FormulaGridProps {
    initialRows?: RowData[];
    initialColumns?: string[];
    onKPIUpdate?: (kpis: KPIData) => void;
}

const FormulaGrid: React.FC<FormulaGridProps> = ({
    initialRows,
    initialColumns,
    onKPIUpdate
}) => {
    const { t } = useTranslation('common');

    // Default initial data if none provided
    const defaultColumns = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    const defaultRows: RowData[] = [
        {
            rowName: 'Ingresos Recurrentes',
            cells: [
                { value: 125000 },
                { value: 145000 },
                { value: 165000 },
                { value: 185000 }
            ]
        },
        {
            rowName: 'Costos Operativos',
            cells: [
                { value: 95000 },
                { value: 105000 },
                { value: 115000 },
                { value: 125000 }
            ]
        },
        {
            rowName: 'Flujo de Caja Neto',
            cells: [
                { value: 30000, formula: '=A1-A2' },
                { value: 40000, formula: '=B1-B2' },
                { value: 50000, formula: '=C1-C2' },
                { value: 60000, formula: '=D1-D2' }
            ]
        },
        {
            rowName: 'EBITDA',
            cells: [
                { value: 30000, formula: '=A3' },
                { value: 40000, formula: '=B3' },
                { value: 50000, formula: '=C3' },
                { value: 60000, formula: '=D3' }
            ]
        },
        {
            rowName: 'Total Anual',
            cells: [
                { value: 180000, formula: '=SUM(A4:D4)' },
                { value: 0 },
                { value: 0 },
                { value: 0 }
            ]
        }
    ];

    const [columns, setColumns] = useState<string[]>(initialColumns || defaultColumns);
    const [rows, setRows] = useState<RowData[]>(initialRows || defaultRows);
    const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
    const [editingRowName, setEditingRowName] = useState<number | null>(null);
    const [tempValue, setTempValue] = useState<string>('');

    // Calculate KPIs whenever the grid changes
    useEffect(() => {
        if (onKPIUpdate && rows.length > 0) {
            const kpis = calculateKPIs(rows);
            onKPIUpdate(kpis);
        }
    }, [rows, onKPIUpdate]);

    const calculateKPIs = (gridRows: RowData[]): KPIData => {
        // Find key rows for KPI calculation
        const netCashFlowRow = gridRows.find(r => r.rowName.toLowerCase().includes('flujo de caja neto'));
        const ebitdaRow = gridRows.find(r => r.rowName.toLowerCase().includes('ebitda'));

        // Calculate NPV (simplified - assuming 10% discount rate)
        let npv = 0;
        if (netCashFlowRow) {
            netCashFlowRow.cells.forEach((cell, idx) => {
                npv += cell.value / Math.pow(1.1, idx + 1);
            });
        }

        // Calculate IRR (simplified approximation)
        const irr = calculateIRR(netCashFlowRow?.cells.map(c => c.value) || []);

        // Calculate EBITDA (sum of EBITDA row or use total if available)
        let ebitda = 0;
        if (ebitdaRow) {
            ebitda = ebitdaRow.cells.reduce((sum, cell) => sum + cell.value, 0);
        }

        return { npv, irr, ebitda };
    };

    // Simplified IRR calculation (Newton-Raphson method)
    const calculateIRR = (cashFlows: number[]): number => {
        if (cashFlows.length === 0) return 0;

        let irr = 0.1; // Initial guess
        const tolerance = 0.0001;
        const maxIterations = 100;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let dnpv = 0;

            cashFlows.forEach((cf, period) => {
                npv += cf / Math.pow(1 + irr, period + 1);
                dnpv -= (period + 1) * cf / Math.pow(1 + irr, period + 2);
            });

            if (Math.abs(npv) < tolerance) break;

            irr = irr - npv / dnpv;
        }

        return irr * 100; // Convert to percentage
    };

    const handleCellClick = (rowIdx: number, colIdx: number) => {
        const cell = rows[rowIdx].cells[colIdx];
        setEditingCell({ row: rowIdx, col: colIdx });
        setTempValue(cell.formula || String(cell.value || ''));
    };

    const handleCellBlur = () => {
        if (editingCell) {
            saveCellValue(editingCell.row, editingCell.col, tempValue);
            setEditingCell(null);
            setTempValue('');
        }
    };

    const handleCellKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCellBlur();
        } else if (e.key === 'Escape') {
            setEditingCell(null);
            setTempValue('');
        }
    };

    const saveCellValue = (rowIdx: number, colIdx: number, value: string) => {
        const newRows = [...rows];
        const cell = newRows[rowIdx].cells[colIdx];

        if (value.startsWith('=')) {
            // It's a formula
            cell.formula = value;
            cell.value = 0; // Will be calculated
        } else {
            // It's a direct value
            const numValue = parseFloat(value);
            cell.value = isNaN(numValue) ? 0 : numValue;
            delete cell.formula; // Remove formula if it exists
        }

        setRows(newRows);
    };

    const handleRowNameClick = (rowIdx: number) => {
        setEditingRowName(rowIdx);
        setTempValue(rows[rowIdx].rowName);
    };

    const handleRowNameBlur = () => {
        if (editingRowName !== null) {
            const newRows = [...rows];
            newRows[editingRowName].rowName = tempValue;
            setRows(newRows);
            setEditingRowName(null);
            setTempValue('');
        }
    };

    const handleRowNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRowNameBlur();
        } else if (e.key === 'Escape') {
            setEditingRowName(null);
            setTempValue('');
        }
    };

    const handleCalculate = () => {
        const recalculatedRows = recalculateGrid(rows);
        setRows(recalculatedRows);
    };

    const handleAddRow = () => {
        const newRow: RowData = {
            rowName: `${t('new_metric')} ${rows.length + 1}`,
            cells: columns.map(() => ({ value: 0 }))
        };
        setRows([...rows, newRow]);
    };

    const handleAddColumn = () => {
        const newColumnName = `Q${columns.length + 1} 2024`;
        setColumns([...columns, newColumnName]);

        const newRows = rows.map(row => ({
            ...row,
            cells: [...row.cells, { value: 0 }]
        }));
        setRows(newRows);
    };

    const handleDeleteRow = (rowIdx: number) => {
        if (rows.length <= 1) return; // Keep at least one row
        const newRows = rows.filter((_, idx) => idx !== rowIdx);
        setRows(newRows);
    };

    const handleDeleteColumn = (colIdx: number) => {
        if (columns.length <= 1) return; // Keep at least one column
        const newColumns = columns.filter((_, idx) => idx !== colIdx);
        setColumns(newColumns);

        const newRows = rows.map(row => ({
            ...row,
            cells: row.cells.filter((_, idx) => idx !== colIdx)
        }));
        setRows(newRows);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="formulagrid-container">
            <div className="formulagrid-header">
                <h3 className="text-black formulagrid-title">{t('formula_editor')}</h3>
                <div className="formulagrid-actions">
                    <Button variant="secondary" onClick={handleAddRow}>
                        + {t('add_row')}
                    </Button>
                    <Button variant="secondary" onClick={handleAddColumn}>
                        + {t('add_column')}
                    </Button>
                    <Button variant="primary" onClick={handleCalculate}>
                        {t('calculate')}
                    </Button>
                </div>
            </div>

            <div className="formulagrid-hint">
                <p className="text-black">
                    💡 {t('formula_grid_hint')}
                </p>
            </div>

            <div className="formulagrid-wrapper">
                <table className="formulagrid-table">
                    <thead>
                        <tr>
                            <th className="formulagrid-corner-cell">{t('metric')}</th>
                            {columns.map((col, colIdx) => (
                                <th key={colIdx} className="formulagrid-column-header">
                                    <div className="formulagrid-column-header-content">
                                        <span className="text-black formulagrid-column-label">
                                            {toCellReference(0, colIdx)[0]}
                                        </span>
                                        <span className="text-black">{col}</span>
                                        <button
                                            className="formulagrid-delete-btn"
                                            onClick={() => handleDeleteColumn(colIdx)}
                                            title={t('delete_column')}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                <td className="formulagrid-row-header">
                                    <div className="formulagrid-row-header-content">
                                        <span className="text-black formulagrid-row-number">
                                            {rowIdx + 1}
                                        </span>
                                        {editingRowName === rowIdx ? (
                                            <input
                                                type="text"
                                                className="formulagrid-rowname-input"
                                                value={tempValue}
                                                onChange={(e) => setTempValue(e.target.value)}
                                                onBlur={handleRowNameBlur}
                                                onKeyDown={handleRowNameKeyDown}
                                                autoFocus
                                            />
                                        ) : (
                                            <span
                                                className="text-black formulagrid-rowname"
                                                onClick={() => handleRowNameClick(rowIdx)}
                                            >
                                                {row.rowName}
                                            </span>
                                        )}
                                        <button
                                            className="formulagrid-delete-btn"
                                            onClick={() => handleDeleteRow(rowIdx)}
                                            title={t('delete_row')}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </td>
                                {row.cells.map((cell, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className={`formulagrid-cell ${cell.formula ? 'formulagrid-cell-formula' : ''}`}
                                        onClick={() => handleCellClick(rowIdx, colIdx)}
                                    >
                                        {editingCell?.row === rowIdx && editingCell?.col === colIdx ? (
                                            <input
                                                type="text"
                                                className="formulagrid-cell-input"
                                                value={tempValue}
                                                onChange={(e) => setTempValue(e.target.value)}
                                                onBlur={handleCellBlur}
                                                onKeyDown={handleCellKeyDown}
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="formulagrid-cell-content">
                                                <span className="text-black formulagrid-cell-value">
                                                    {formatCurrency(cell.value)}
                                                </span>
                                                {cell.formula && (
                                                    <span className="formulagrid-cell-formula-indicator">
                                                        ƒ
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="formulagrid-info">
                <p className="text-black">
                    <strong>{t('formula_examples')}:</strong>
                </p>
                <ul className="formulagrid-examples">
                    <li className="text-black">=A1+B1 ({t('sum_cells')})</li>
                    <li className="text-black">=A1-B1 ({t('subtract_cells')})</li>
                    <li className="text-black">=A1*B1 ({t('multiply_cells')})</li>
                    <li className="text-black">=SUM(A1:D1) ({t('sum_range')})</li>
                    <li className="text-black">=AVERAGE(A1:D1) ({t('average_range')})</li>
                </ul>
            </div>
        </div>
    );
};

export default FormulaGrid;
