import { useState, useEffect } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

import './ThemeToggle.css'

interface ThemeToggleProps {
    /** Size preset from global size variables */
    size?: 'sm' | 'md' | 'lg'
}

const ThemeToggle = ({ size = 'md' }: ThemeToggleProps) => {
    
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark')
        setIsDark(isDarkMode)
    }, [])

    const handleToggle = () => {
        document.documentElement.classList.toggle('dark')
        setIsDark(!isDark)
        localStorage.setItem('theme', isDark ? 'light' : 'dark')
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={handleToggle}
            className={`theme-toggle size-${size}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className="theme-toggle-track">
                <div className="theme-toggle-ball">
                    {isDark ? (
                        <FaMoon className="theme-icon" />
                    ) : (
                        <FaSun className="theme-icon" />
                    )}
                </div>
            </div>
        </button>
    )
}

export default ThemeToggle