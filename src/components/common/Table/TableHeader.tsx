import React, { useEffect } from "react"
import { TableContext } from "./TableContext"
import "./TableHeader.css"

/** We treat TableHeader as a single row of columns by default. */
export interface TableHeaderProps {
    children: React.ReactNode
}

/**
 * The TableHeader is rendered as a `<thead>` with a single `<tr>` 
 * containing TableColumn cells.
 */
export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
    const { setColumnCount, radius } = React.useContext(TableContext)
    const columns = React.Children.count(children)

    useEffect(() => {
        setColumnCount(columns)
    }, [columns, setColumnCount])

    const style = radius !== undefined ? {
        '--table-radius': `${radius}px`
    } as React.CSSProperties : undefined

    return (
        <thead className="table-header-cont">
            <tr className="table-header-row" style={style}>
                {children}
            </tr>
        </thead>
    );
};
