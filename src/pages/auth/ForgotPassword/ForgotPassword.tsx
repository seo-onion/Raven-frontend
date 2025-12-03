import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { IoChevronBack } from 'react-icons/io5'

import Card from '@/components/common/Card/Card'
import Input from '@/components/forms/Input/Input'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
import routes from '@/routes/routes'
import useAuthStore, { type ResetPasswordRequest } from '@/stores/AuthStore'

import '@/styles/Auth.css'
import '@/styles/General.css'

const ForgotPassword = () => {
    const { t } = useTranslation('common')
    const navigate = useNavigate()
    const { sendResetPasswordRequest, isLoading } = useAuthStore()

    const [formData, setFormData] = useState<ResetPasswordRequest>({
        email: '',
    })

    // Comentado para desarrollo - permite acceder aunque estés logueado
    // useEffect(() => {
    //     if (isLogged) {
    //         navigate(routes.home);
    //     }
    // }, [isLogged]);

    const handleFormDataChange = (key: string, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: value,
        }))
    }

    const validateForm = (formData: ResetPasswordRequest) => {
        const { email } = formData;

        if (!email) {
            return { isValid: false, message: t('missing_fields') }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { isValid: false, message: t('invalid_email') }
        }

        return { isValid: true, message: '' }
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();

        const validation = validateForm(formData)
        if (!validation.isValid) {
            toast.error(validation.message);
            return;
        }

        try {
            const status: boolean = await sendResetPasswordRequest(formData);
            if (status) {
                navigate(routes.login);
                return;
            }
        } catch (e) {
            toast.error(t('error'))
        }
    }

    return (
        <div className="login-register-main-cont animated-gradient-background">
            <div className="login-register-header">
                <button
                    className="login-register-back-button"
                    onClick={() => navigate('/main')}
                    aria-label="Back to login"
                >
                    <IoChevronBack /> {t('login_back_to_login_button')}
                </button>
            </div>

            <Card className="login-register-card-cont">
                <div className="section-title">{t('login_forgot_password_title') || 'Forgot your password?'}</div>
                <form className="login-register-form-cont" onSubmit={onSubmit}>
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        setValue={(value) => handleFormDataChange('email', value)}
                        label={t('email_label')}
                        placeholder={t('email_placeholder')}
                    />
                    <Button variant="primary" size="lg" type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner variant="secondary" /> : (t('login_reset_password') || 'Send reset link')}
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default ForgotPassword
