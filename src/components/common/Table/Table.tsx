import React, { useState } from "react"
import { TableContext } from "./TableContext"
import "./Table.css"

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    /** The aria-label is recommended for accessibility */
    "aria-label"?: string
    /** Children typically include TableHeader & TableBody */
    children: React.ReactNode
    /** ClassNames for the table container */
    className?: string
    /** Additional inline styles for overwriting the main parent container */
    style?: React.CSSProperties
    /** Border radius for the table cells (in pixels) */
    radius?: number
}

/**
 * The main Table component. 
 * Renders a scrollable wrapper with a <table> inside.
 * NOTE Use `className` for the table container but `style` for the parent container
 */
export const Table: React.FC<TableProps> = ({
    children,
    className = "",
    style,
    radius,
}) => {
    const [columnCount, setColumnCount] = useState<number>(0)
    return (
        <TableContext.Provider value={{ columnCount, setColumnCount, radius }}>
            <div className="table-main-cont" style={style}>
                <table className={`table-cont ${className}`}>
                    {children}
                </table>
            </div>
        </TableContext.Provider>
    )
}
