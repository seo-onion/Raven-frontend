import React, { useState, useEffect } from 'react'
import './DateTimePicker.css'

interface DateTimePickerProps {
    /** Unique identifier for the input field */
    name: string
    /** Current value of the input field */
    value: string
    /** Callback function to update the input value */
    setValue: (value: string) => void
    /** Visual style variant of the input */
    variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
    /** Color scheme based on theme variables */
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    /** Size preset from global size variables */
    size?: 'sm' | 'md' | 'lg'
    /** Border radius preset from global radius variables */
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
    /** Label text displayed adjacent to the input */
    label?: string
    /** Validation error message displayed below the input */
    errorMessage?: string
    /** Minimum allowed datetime value */
    min?: string
    /** Maximum allowed datetime value */
    max?: string
    /** Only allow date selection, time will be set to 00:00 */
    dateOnly?: boolean
    /** Content to display before the input */
    startContent?: React.ReactNode
    /** Content to display after the input */
    endContent?: React.ReactNode
    /** Whether the input should span full container width */
    fullWidth?: boolean
    /** Show clear button when input has content */
    isClearable?: boolean
    /** Mark field as required with asterisk */
    isRequired?: boolean
    /** HTML required attribute (alternative to isRequired) */
    required?: boolean
    /** Prevent user interaction while maintaining value */
    isReadOnly?: boolean
    /** Disable input interaction completely */
    isDisabled?: boolean
    /** Manual validation state override */
    isInvalid?: boolean
    /** Ref object for the wrapper div element */
    baseRef?: React.RefObject<HTMLDivElement>
    /** Additional CSS classes for custom styling */
    classNames?: string
}

const DateTimePicker = ({
    name,
    value,
    setValue,
    variant = 'flat',
    color = 'default',
    size = 'md',
    radius = 'md',
    label,
    errorMessage,
    min,
    max,
    dateOnly = false,
    startContent,
    endContent,
    fullWidth = true,
    isClearable = false,
    isRequired = false,
    required,
    isReadOnly = false,
    isDisabled = false,
    isInvalid,
    baseRef,
    classNames = ''
}: DateTimePickerProps) => {

    const [validationError, setValidationError] = useState<string>('')

    // Combine validation errors from prop and internal validation
    const computedErrorMessage = errorMessage || validationError
    const invalid = isInvalid || !!computedErrorMessage
    const showClearButton = isClearable && value.length > 0 && !isDisabled

    // Validate datetime input
    useEffect(() => {
        if (isDisabled || isReadOnly) {
            setValidationError('');
            return;
        }

        // Only validate if there's a value
        if (value) {
            // Check if the datetime is valid
            const dateTime = new Date(value);
            if (isNaN(dateTime.getTime())) {
                setValidationError('Please enter a valid date and time');
                return;
            }

            // Min datetime validation
            if (min && new Date(value) < new Date(min)) {
                setValidationError('Date and time must be after the minimum allowed');
                return;
            }

            // Max datetime validation
            if (max && new Date(value) > new Date(max)) {
                setValidationError('Date and time must be before the maximum allowed');
                return;
            }
        }

        // Clear validation error if all checks pass
        setValidationError('');
    }, [value, min, max, isDisabled, isReadOnly]);

    const handleClear = () => setValue('')

    // Match Input component's size mapping logic
    const getHeightSize = () => {
        // For DateTimePicker, we don't have label placement logic like Input
        // So we use the same downsizing approach as Input's outside labels
        switch(size) {
            case 'sm': return 'xs'
            case 'md': return 'sm'
            case 'lg': return 'md'
            default: return 'xs'
        }
    }

    // Handle date change and automatically set time to 00:00 if dateOnly is true
    const handleDateTimeChange = (newValue: string) => {
        if (dateOnly && newValue) {
            // For date-only inputs, append T00:00 to make it a valid datetime
            setValue(newValue + 'T00:00');
        } else {
            setValue(newValue);
        }
    }


    const getBorderColor = () => {
        if (variant === "flat") return "transparent"
        switch(color) {
            case 'primary': return 'var(--main-primary)'
            case 'secondary': return 'var(--main-secondary)'
            case 'success': return 'var(--state-success)'
            case 'warning': return 'var(--state-warning)'
            case 'danger': return 'var(--state-danger)'
            default: return 'var(--border-primary)'
        }
    }

    return (
        <div
            ref={baseRef}
            className={`datetime-picker-group ${fullWidth ? 'full-width' : ''} ${classNames}`}
        >
            {/* Always show label above the input */}
            {label && (
                <label className="datetime-picker-label" htmlFor={name}>
                    {label}
                    {isRequired && <span className="required-mark">*</span>}
                </label>
            )}
            
            <div className="input-container">
                {startContent && (
                    <div className="input-start-content">
                        {startContent}
                    </div>
                )}

                <input
                    id={name}
                    className={`datetime-picker-field variant-${variant} size-${getHeightSize()} 
                    ${variant !== "underlined" ? `radius-${radius}` : ""} 
                    ${invalid ? 'input-invalid' : ''} 
                    ${startContent ? 'has-start' : ''} 
                    ${endContent || showClearButton ? 'has-end' : ''}`}
                    style={{
                        borderColor: getBorderColor(),
                        backgroundColor: variant === 'flat' || variant === 'faded'
                            ? 'var(--background-secondary)' 
                            : 'transparent'
                    }}
                    name={name}
                    type={dateOnly ? "date" : "datetime-local"}
                    value={dateOnly && value ? value.split('T')[0] : value}
                    onChange={(e) => handleDateTimeChange(e.target.value)}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    min={min}
                    max={max}
                    required={required || isRequired}
                    aria-invalid={invalid}
                    aria-describedby={computedErrorMessage ? `${name}-error` : undefined}
                />

                {showClearButton && (
                    <button
                        type="button"
                        className="input-clear"
                        onClick={handleClear}
                        aria-label="Clear input"
                    >
                        ×
                    </button>
                )}

                {endContent && (
                    <div className="input-end-content">
                        {endContent}
                    </div>
                )}
            </div>

            {/* Error message */}
            {computedErrorMessage && (
                <div className="input-error" id={`${name}-error`}>
                    {computedErrorMessage}
                </div>
            )}
        </div>
    )
}

export default DateTimePicker
