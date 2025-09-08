import React, { useState, useRef, useEffect } from 'react'
import { RiArrowDownSLine, RiCheckLine } from 'react-icons/ri'
import './Select.css'

interface SelectOption {
    value: string
    label: string
}

interface SelectProps {
    label?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: SelectOption[]
    error?: string
    disabled?: boolean
    required?: boolean
    placeholder?: string
}

const Select = ({
    label,
    value,
    onChange,
    options,
    error,
    disabled = false,
    required = false,
    placeholder = "Select an option..."
}: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const selectRef = useRef<HTMLSelectElement>(null)

    // Detect mobile devices
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCustomSelect = (optionValue: string) => {
        const syntheticEvent = {
            target: { value: optionValue },
            currentTarget: { value: optionValue }
        } as React.ChangeEvent<HTMLSelectElement>
        onChange(syntheticEvent)
        setIsOpen(false)
    }

    const selectedOption = options.find(option => option.value === value)

    // Use native select on mobile
    if (isMobile) {
        return (
            <div className="select-container">
                {label && (
                    <label className="select-label">
                        {label}
                        {required && <span className="required-mark">*</span>}
                    </label>
                )}
                <select
                    ref={selectRef}
                    className={`select-input native ${error ? 'error' : ''}`}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <span className="select-error">{error}</span>}
            </div>
        )
    }

    // Custom dropdown for desktop
    return (
        <div className="select-container">
            {label && (
                <label className="select-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <div 
                ref={dropdownRef}
                className={`custom-select ${isOpen ? 'open' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
            >
                <div 
                    className="select-trigger"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            !disabled && setIsOpen(!isOpen)
                        }
                    }}
                    tabIndex={disabled ? -1 : 0}
                    role="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="select-value">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <RiArrowDownSLine className={`select-arrow ${isOpen ? 'rotated' : ''}`} />
                </div>
                
                {isOpen && (
                    <div className="select-dropdown">
                        <div className="select-options" role="listbox">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    className={`select-option ${value === option.value ? 'selected' : ''}`}
                                    onClick={() => handleCustomSelect(option.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            handleCustomSelect(option.value)
                                        }
                                    }}
                                    tabIndex={0}
                                    role="option"
                                    aria-selected={value === option.value}
                                >
                                    <span className="option-text">{option.label}</span>
                                    {value === option.value && (
                                        <RiCheckLine className="option-check" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {error && <span className="select-error">{error}</span>}
        </div>
    )
}

export default Select
