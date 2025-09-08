import React from 'react'
import './CardTitle.css'

/**
 * Card title for the Card
 */
type CardTitleProps = {
    /** The content to be rendered inside the container */
    children: React.ReactNode;
    /** Additional CSS classes for custom styling (optional) */
    className?: string;
    /** OnClick callback */
    onClick?: () => any
}

const CardTitle = ({ children, className, onClick }: CardTitleProps) => {
    return (
        <div className={`card-title-cont ${className}`} onClick={onClick}>
            {children}
        </div>
    )
}

export default CardTitle