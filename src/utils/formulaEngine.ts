import type { RowData, CellReference } from '@/types/formulaGrid';

/**
 * Converts a cell reference like "C1" to row and column indices
 * A-Z = columns 0-25
 * 1-n = rows 0-(n-1)
 */
export function parseCellReference(cellRef: string): CellReference | null {
    const match = cellRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) return null;

    const colStr = match[1];
    const rowStr = match[2];

    // Convert column letter(s) to number (A=0, B=1, ..., Z=25, AA=26, etc.)
    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
        col = col * 26 + (colStr.charCodeAt(i) - 65);
    }

    const row = parseInt(rowStr) - 1; // Convert to 0-indexed

    return { row, col };
}

/**
 * Converts row and column indices to a cell reference like "C1"
 */
export function toCellReference(row: number, col: number): string {
    let colStr = '';
    let colNum = col;

    while (colNum >= 0) {
        colStr = String.fromCharCode(65 + (colNum % 26)) + colStr;
        colNum = Math.floor(colNum / 26) - 1;
    }

    return `${colStr}${row + 1}`;
}

/**
 * Evaluates a formula and returns the calculated value
 * Supports basic operations: +, -, *, /, (), and cell references
 */
export function evaluateFormula(
    formula: string,
    rows: RowData[],
    currentRow: number,
    currentCol: number
): number | null {
    try {
        // Remove the leading '=' if present
        let expr = formula.startsWith('=') ? formula.slice(1) : formula;

        // Replace cell references with actual values
        const cellRefPattern = /([A-Z]+\d+)/g;
        expr = expr.replace(cellRefPattern, (match) => {
            const ref = parseCellReference(match);
            if (!ref) return '0';

            const { row, col } = ref;

            // Check for circular reference
            if (row === currentRow && col === currentCol) {
                throw new Error('Circular reference detected');
            }

            // Get the value from the referenced cell
            if (row < 0 || row >= rows.length) return '0';
            if (col < 0 || col >= rows[row].cells.length) return '0';

            const cell = rows[row].cells[col];

            // If the referenced cell has a formula, we need to evaluate it first
            if (cell.formula) {
                const result = evaluateFormula(cell.formula, rows, row, col);
                return result !== null ? String(result) : '0';
            }

            return String(cell.value || 0);
        });

        // Support common functions
        expr = expr.replace(/SUM\(([^)]+)\)/gi, (_match, range) => {
            const sum = calculateSum(range, rows);
            return String(sum);
        });

        expr = expr.replace(/AVERAGE\(([^)]+)\)/gi, (_match, range) => {
            const avg = calculateAverage(range, rows);
            return String(avg);
        });

        expr = expr.replace(/MIN\(([^)]+)\)/gi, (_match, range) => {
            const min = calculateMin(range, rows);
            return String(min);
        });

        expr = expr.replace(/MAX\(([^)]+)\)/gi, (_match, range) => {
            const max = calculateMax(range, rows);
            return String(max);
        });

        // Evaluate the mathematical expression safely
        const result = safeEval(expr);
        return result;
    } catch (error) {
        console.error('Error evaluating formula:', error);
        return null;
    }
}

/**
 * Safely evaluates a mathematical expression
 * Only allows numbers and basic operators
 */
function safeEval(expr: string): number | null {
    try {
        // Remove whitespace
        expr = expr.trim();

        // Validate that the expression only contains allowed characters
        if (!/^[\d+\-*/().%\s]+$/.test(expr)) {
            throw new Error('Invalid characters in expression');
        }

        // Use Function constructor to evaluate (safer than eval)
        const result = new Function('return ' + expr)();

        if (typeof result !== 'number' || !isFinite(result)) {
            return null;
        }

        return result;
    } catch {
        return null;
    }
}

/**
 * Calculates the sum of a range of cells
 * Supports formats like "A1:A5" or "A1,B2,C3"
 */
function calculateSum(range: string, rows: RowData[]): number {
    const values = parseRange(range, rows);
    return values.reduce((sum, val) => sum + val, 0);
}

/**
 * Calculates the average of a range of cells
 */
function calculateAverage(range: string, rows: RowData[]): number {
    const values = parseRange(range, rows);
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculates the minimum of a range of cells
 */
function calculateMin(range: string, rows: RowData[]): number {
    const values = parseRange(range, rows);
    if (values.length === 0) return 0;
    return Math.min(...values);
}

/**
 * Calculates the maximum of a range of cells
 */
function calculateMax(range: string, rows: RowData[]): number {
    const values = parseRange(range, rows);
    if (values.length === 0) return 0;
    return Math.max(...values);
}

/**
 * Parses a range string and returns an array of values
 * Supports "A1:A5" (range) and "A1,B2,C3" (list)
 */
function parseRange(range: string, rows: RowData[]): number[] {
    const values: number[] = [];

    if (range.includes(':')) {
        // Range format: A1:A5
        const [start, end] = range.split(':');
        const startRef = parseCellReference(start.trim());
        const endRef = parseCellReference(end.trim());

        if (!startRef || !endRef) return values;

        for (let row = startRef.row; row <= endRef.row; row++) {
            for (let col = startRef.col; col <= endRef.col; col++) {
                if (row >= 0 && row < rows.length && col >= 0 && col < rows[row].cells.length) {
                    values.push(rows[row].cells[col].value || 0);
                }
            }
        }
    } else {
        // List format: A1,B2,C3
        const cellRefs = range.split(',');
        for (const cellRefStr of cellRefs) {
            const ref = parseCellReference(cellRefStr.trim());
            if (ref && ref.row >= 0 && ref.row < rows.length && ref.col >= 0 && ref.col < rows[ref.row].cells.length) {
                values.push(rows[ref.row].cells[ref.col].value || 0);
            }
        }
    }

    return values;
}

/**
 * Recalculates all formulas in the grid
 * Returns a new grid with updated values
 */
export function recalculateGrid(rows: RowData[]): RowData[] {
    const newRows = JSON.parse(JSON.stringify(rows)) as RowData[];

    // Multiple passes to handle formula dependencies
    // We'll do up to 10 passes to resolve interdependent formulas
    for (let pass = 0; pass < 10; pass++) {
        let changed = false;

        for (let rowIdx = 0; rowIdx < newRows.length; rowIdx++) {
            for (let colIdx = 0; colIdx < newRows[rowIdx].cells.length; colIdx++) {
                const cell = newRows[rowIdx].cells[colIdx];

                if (cell.formula) {
                    const newValue = evaluateFormula(cell.formula, newRows, rowIdx, colIdx);
                    if (newValue !== null && newValue !== cell.value) {
                        cell.value = newValue;
                        changed = true;
                    }
                }
            }
        }

        // If nothing changed in this pass, we're done
        if (!changed) break;
    }

    return newRows;
}
