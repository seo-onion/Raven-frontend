import React from 'react';
import './Spinner.css';

interface SpinnerProps {
    /** Style variant of the spinner */
    variant?: 'primary' | 'secondary';
    /** Additional CSS classes */
    className?: string;
    /** Size of the spinner */
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Spinner component for loading states.
 * Supports primary and secondary variants.
 */
const Spinner: React.FC<SpinnerProps> = ({
    variant = 'primary',
    className = '',
    size = 'md'
}) => {
    return (
        <div className={`spinner spinner-${variant} ${className} spinner-${size}`}></div>
    );
};

export default Spinner;
