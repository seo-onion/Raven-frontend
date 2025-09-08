import React from "react";
import "./TableColumn.css";

export interface TableColumnProps
    extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
    children: React.ReactNode;
}

/**
 * A TableColumn is effectively a <th>.
 * Typically used only inside <TableHeader>.
 */
export const TableColumn: React.FC<TableColumnProps> = ({ children, ...props }) => {
    return (
        <th className="table-column-cont" {...props}>
            {children}
        </th>
    );
};
