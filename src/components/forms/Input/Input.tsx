import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import './Input.css'

interface InputProps {
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
    /** Placeholder text when input is empty */
    placeholder?: string
    /** Validation error message displayed below the input */
    errorMessage?: string
    /** Minimum allowed character length */
    minLength?: number
    /** Maximum allowed character length */
    maxLength?: number
    /** Step increment for number inputs */
    step?: string
    /** Minimum value for number inputs */
    min?: string
    /** Maximum value for number inputs */
    max?: string
    /** HTML input type attribute */
    type?: 'text' | 'email' | 'url' | 'password' | 'tel' | 'search' | 'file' | 'number'
    /** Enable multiline textarea functionality */
    multiline?: boolean
    /** Number of visible text lines for textarea */
    rows?: number
    /** Content to display before the input */
    startContent?: React.ReactNode
    /** Content to display after the input */
    endContent?: React.ReactNode
    /** Position of the label relative to the input */
    labelPlacement?: 'inside' | 'outside' | 'outside-left'
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

const Input = ({
    name,
    value,
    setValue,
    variant = 'flat',
    color = 'default',
    size = 'md',
    radius = 'md',
    label,
    placeholder,
    errorMessage,
    minLength,
    maxLength,
    step,
    min,
    max,
    type = 'text',
    multiline = false,
    rows = 3,
    startContent,
    endContent,
    labelPlacement = 'outside',
    fullWidth = true,
    isClearable = false,
    isRequired = false,
    required,
    isReadOnly = false,
    isDisabled = false,
    isInvalid,
    baseRef,
    classNames = ''
}: InputProps) => {

    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [validationError, setValidationError] = useState<string>('')

    // Check if we need floating label behavior (when outside placement with no placeholder)
    const needsFloatingLabel = labelPlacement === 'outside' && label && !placeholder
    
    // Determine if the label should be positioned as a placeholder or float above
    const shouldShowAsPlaceholder = needsFloatingLabel && !isFocused && value.length === 0
    const shouldFloatAbove = needsFloatingLabel && (isFocused || value.length > 0)

    // For regular inside label behavior
    const hasInsideLabel = labelPlacement === 'inside' && label
    const shouldFloat = hasInsideLabel && (isFocused || value.length > 0 || placeholder || startContent || endContent)

    // Combine validation errors from prop and internal validation
    const computedErrorMessage = errorMessage || validationError
    const invalid = isInvalid || !!computedErrorMessage
    const showClearButton = isClearable && value.length > 0 && !isDisabled

    // Validate input based on type and constraints
    useEffect(() => {
        if (isDisabled || isReadOnly) {
            setValidationError('');
            return;
        }

        // Only validate if there's a value
        if (value) {
            // Email validation
            if (type === 'email' && value.length > 0) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    setValidationError('Please enter a valid email address');
                    return;
                }
            }

            // URL validation
            if (type === 'url' && value.length > 0) {
                try {
                    new URL(value);
                } catch (_) {
                    setValidationError('Please enter a valid URL');
                    return;
                }
            }

            // Tel validation - simple pattern for digits, dashes, parentheses, and plus sign
            if (type === 'tel' && value.length > 0) {
                const telPattern = /^[0-9+\-() ]+$/;
                if (!telPattern.test(value)) {
                    setValidationError('Please enter a valid phone number');
                    return;
                }
            }

            // Min length validation
            if (minLength !== undefined && value.length < minLength) {
                setValidationError(`Must be at least ${minLength} characters`);
                return;
            }

            // Max length validation
            if (maxLength !== undefined && value.length > maxLength) {
                setValidationError(`Must not exceed ${maxLength} characters`);
                return;
            }
        }

        // Clear validation error if all checks pass
        setValidationError('');
    }, [value, type, minLength, maxLength, isDisabled, isReadOnly]);

    const handleClear = () => setValue('')

    const getHeightSize = () => {
        if (labelPlacement === "inside") return size
        switch(size) {
            case 'sm': return 'xs'
            case 'md': return 'sm'
            case 'lg': return 'md'
            default: return 'xs'
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
            className={`basic-input-group ${fullWidth ? 'full-width' : ''} label-placement-${labelPlacement} ${needsFloatingLabel ? 'has-floating-outside-label' : ''} ${classNames}`}
        >
            {/* Show outside label only if it's not the floating case */}
            {labelPlacement !== 'inside' && !needsFloatingLabel && label && (
                <label className="basic-input-label" htmlFor={name}>
                    {label}
                    {isRequired && <span className="required-mark">*</span>}
                </label>
            )}
            
            <div className={`input-container ${needsFloatingLabel ? 'with-floating-label' : ''}`}>
                {startContent && (
                    <div className={`input-start-content ${hasInsideLabel ? 'has-inside-label' : ''}`}>
                        {startContent}
                    </div>
                )}
                
                {/* Inside label OR floating outside label */}
                {(hasInsideLabel || needsFloatingLabel) && (
                    <label 
                        className={`input-label ${hasInsideLabel ? 'inside-label' : 'floating-outside-label'} ${shouldFloat ? 'floating' : ''} ${shouldShowAsPlaceholder ? 'as-placeholder' : ''} ${shouldFloatAbove ? 'float-above' : ''}`}
                        htmlFor={name}
                    >
                        {label}
                        {isRequired && <span className="required-mark">*</span>}
                    </label>
                )}

                {multiline ? (
                    <textarea
                        id={name}
                        className={`basic-input-field variant-${variant} size-${getHeightSize()} 
                            ${variant !== "underlined" ? `radius-${radius}` : ""} 
                            ${hasInsideLabel ? 'has-inside-label' : ''} 
                            ${invalid ? 'input-invalid' : ''} 
                            ${startContent ? 'has-start' : ''} 
                            ${endContent ? 'has-end' : ''}
                            ${needsFloatingLabel ? 'with-floating-label' : ''} 
                            multiline-textarea`}
                        style={{
                            borderColor: getBorderColor(),
                            backgroundColor: variant === 'flat' || variant === 'faded'
                                ? 'var(--background-secondary)' 
                                : 'transparent',
                            minHeight: `${rows * 1.5}rem`,
                            resize: 'vertical'
                        }}
                        name={name}
                        placeholder={shouldShowAsPlaceholder ? '' : placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={isDisabled}
                        readOnly={isReadOnly}
                        minLength={minLength}
                        maxLength={maxLength}
                        rows={rows}
                        required={required || isRequired}
                        aria-invalid={invalid}
                        aria-describedby={computedErrorMessage ? `${name}-error` : undefined}
                    />
                ) : (
                    <input
                        id={name}
                        className={`basic-input-field variant-${variant} size-${getHeightSize()} 
                            ${variant !== "underlined" ? `radius-${radius}` : ""} 
                            ${hasInsideLabel ? 'has-inside-label' : ''} 
                            ${invalid ? 'input-invalid' : ''} 
                            ${startContent ? 'has-start' : ''} 
                            ${endContent || type === 'password' ? 'has-end' : ''}
                            ${needsFloatingLabel ? 'with-floating-label' : ''}`}
                        style={{
                            borderColor: getBorderColor(),
                            backgroundColor: variant === 'flat' || variant === 'faded'
                                ? 'var(--background-secondary)' 
                                : 'transparent'
                        }}
                        name={name}
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={shouldShowAsPlaceholder ? '' : placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={isDisabled}
                        readOnly={isReadOnly}
                        minLength={minLength}
                        maxLength={maxLength}
                        step={step}
                        min={min}
                        max={max}
                        required={required || isRequired}
                        aria-invalid={invalid}
                        aria-describedby={computedErrorMessage ? `${name}-error` : undefined}
                    />
                )}

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

                {(endContent || (type === 'password' && !multiline)) && (
                    <div className={`input-end-content ${hasInsideLabel ? 'has-inside-label' : ''}`}>
                        {endContent}
                        {type === 'password' && !multiline && ((labelPlacement === "outside") || shouldFloat) && (
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {computedErrorMessage && (
                <span id={`${name}-error`} className="input-error">
                    {computedErrorMessage}
                </span>
            )}
        </div>
    )
}

export default Input