import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './PasswordEyeInput.css';

interface InputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: any;
  setValue?: (value: any) => void;
}
 
const PasswordEyeInput = ({
  name,
  label = "",
  placeholder = '',
  value = '',
  setValue = () => {},
}: InputProps) => {
    
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="password-eye-input-group">
            <label className="password-eye-input-label" htmlFor={name}>
                {label}
            </label>

            <div className="password-eye-input-wrapper">
                <input
                    className="password-eye-input-field"
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <span className="password-eye-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
        </div>
    );
};

export default PasswordEyeInput;
