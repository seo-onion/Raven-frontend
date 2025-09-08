import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { IoChevronBack } from 'react-icons/io5'

import PasswordEyeInput from '@/components/forms/PasswordEyeInput/PasswordEyeInput'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import useAuthStore, { type ChangePasswordRequest } from '@/stores/AuthStore'
import routes from '@/routes/routes'

import './ChangePassword.css'
import '@/styles/Auth.css'
import '@/styles/General.css'

const ChangePassword = () => {
    const navigate = useNavigate()
    const { t } = useTranslation('common')
    const { changePasswordLogged, isLoading, isLogged } = useAuthStore()

    const [formData, setFormData] = useState<ChangePasswordRequest>({
        old_password: '',
        new_password1: '',
        new_password2: '',
    })

    useEffect(() => {
        if (!isLogged) {
            navigate(routes.login)
        }
    }, [isLogged])

    const handleFormDataChange = (key: string, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: value,
        }))
    }

    const validateForm = (formData: ChangePasswordRequest) => {
        const { old_password, new_password1, new_password2 } = formData
        
        if (!old_password || !new_password1 || !new_password2) {
            return { isValid: false, message: t('missing_fields') }
        }
        
        // Password confirmation validation
        if (new_password1 !== new_password2) {
            return { isValid: false, message: t('passwords_do_not_match') }
        }

        // Check if new password is different from old password
        if (old_password === new_password1) {
            return { isValid: false, message: 'New password must be different from current password' }
        }
        
        // Password strength validation (optional)
        if (new_password1.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' }
        }
        
        return { isValid: true, message: '' }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const validation = validateForm(formData)
        if (!validation.isValid) {
            toast.error(validation.message)
            return
        }

        try {
            const success = await changePasswordLogged(formData)
            if (success) {
                navigate(routes.profile)
                return
            }
        } catch (error) {
            console.error('Change password error:', error)
        }
    }

    return (
        <div className="login-register-main-cont animated-gradient-background">
            <div className="login-register-header">
                <button 
                    className="login-register-back-button"
                    onClick={() => navigate(routes.profile)}
                    aria-label="Back to profile"
                >
                    <IoChevronBack /> {t('login_back_to_profile_button')}
                </button>
            </div>
            
            <Card className="login-register-card-cont">
                <div className="section-title">
                    {t('change_password')}
                </div>  

                <form 
                    className="login-register-form-cont" 
                    onSubmit={handleSubmit}
                >
                    <PasswordEyeInput
                        name="old_password"
                        value={formData.old_password}
                        setValue={(value) => handleFormDataChange('old_password', value)}
                        label={t('old_password_label')}
                        placeholder={t('old_password_placeholder')}
                    />
                    
                    <PasswordEyeInput
                        name="new_password1"
                        value={formData.new_password1}
                        setValue={(value) => handleFormDataChange('new_password1', value)}
                        label={t('password1_label')}
                        placeholder={t('password1_placeholder')}
                    />
                    
                    <PasswordEyeInput
                        name="new_password2"
                        value={formData.new_password2}
                        setValue={(value) => handleFormDataChange('new_password2', value)}
                        label={t('password2_label')}
                        placeholder={t('password2_placeholder')}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner variant="secondary" /> : t('change_password')}
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default ChangePassword
