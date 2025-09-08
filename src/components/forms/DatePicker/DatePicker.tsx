import { useRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import { RiCalendarLine } from 'react-icons/ri'
import "react-datepicker/dist/react-datepicker.css"
import './DatePicker.css'

interface DatePickerProps {
    label?: string
    value: Date | null
    onChange: (date: Date | null) => void
    error?: string
    disabled?: boolean
    required?: boolean
    minDate?: Date
    maxDate?: Date
    placeholderText?: string
}

const DatePicker = ({
    label,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    minDate,
    maxDate,
    placeholderText = "Seleccionar fecha"
}: DatePickerProps) => {
    const datePickerRef = useRef<ReactDatePicker>(null)

    const handleIconClick = () => {
        if (!disabled && datePickerRef.current) {
            datePickerRef.current.setFocus()
        }
    }
    return (
        <div className="datepicker-container">
            {label && (
                <label className="datepicker-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <div className={`datepicker-input-container ${error ? 'error' : ''}`}>
                <ReactDatePicker
                    ref={datePickerRef}
                    selected={value}
                    onChange={onChange}
                    className="datepicker-input"
                    dateFormat="dd/MM/yyyy"
                    disabled={disabled}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText={placeholderText}
                    showPopperArrow={false}
                    autoComplete="off"
                />
                <RiCalendarLine 
                    className="datepicker-icon" 
                    onClick={handleIconClick}
                    role="button"
                    aria-label="Open calendar"
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleIconClick()
                        }
                    }}
                />
            </div>
            {error && <span className="datepicker-error">{error}</span>}
        </div>
    )
}

export default DatePicker
