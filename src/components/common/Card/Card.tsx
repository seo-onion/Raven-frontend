import React from 'react'
import './Card.css'

/**
 * Generic card component that can be clickable
 */
type CardProps = {
    /** The content to be rendered inside the container */
    children: React.ReactNode;
    /** Additional CSS classes for custom styling (optional) */
    className?: string;
    /** Click handler for the card (optional) */
    onClick?: () => void;
    /** Whether the card should show hover effects (optional) */
    hoverable?: boolean;
    /** Whether the card is disabled (optional) */
    disabled?: boolean;
}

const Card = ({ 
    children, 
    className = "", 
    onClick,
    hoverable = false,
    disabled = false
}: CardProps) => {
    const cardClasses = [
        'common-card-container',
        className,
        hoverable || onClick ? 'hoverable' : '',
        disabled ? 'disabled' : ''
    ].filter(Boolean).join(' ');

    return (
        <div 
            className={cardClasses}
            onClick={!disabled && onClick ? onClick : undefined}
            role={onClick ? "button" : undefined}
            tabIndex={onClick && !disabled ? 0 : undefined}
            onKeyPress={
                onClick && !disabled 
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onClick();
                        }
                    }
                    : undefined
            }
        >
            {children}
        </div>
    )
}

export default Card