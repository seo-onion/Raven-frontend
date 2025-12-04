export interface CellData {
    value: number;
    formula?: string;
    isEditing?: boolean;
}

export interface RowData {
    rowName: string;
    cells: CellData[];
}

export interface GridData {
    rows: RowData[];
    columns: string[];
}

export interface KPIData {
    npv: number; // Net Present Value (VAN)
    irr: number; // Internal Rate of Return (TIR)
    ebitda: number; // EBITDA
}

export type CellReference = {
    row: number;
    col: number;
};
