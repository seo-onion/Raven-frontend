import React from "react";
import "./TableCell.css";

export interface TableCellProps
    extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
    children: React.ReactNode;
}

/**
 * A single cell (<td>) within the table body row.
 */
export const TableCell: React.FC<TableCellProps> = ({ children, ...props }) => {
    return (
        <td className="table-cel-cont" {...props}>
            {children}
        </td>
    );
};
