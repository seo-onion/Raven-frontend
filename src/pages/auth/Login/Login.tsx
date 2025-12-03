import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoChevronBack } from 'react-icons/io5'

import Input from '@/components/forms/Input/Input'
import PasswordEyeInput from '@/components/forms/PasswordEyeInput/PasswordEyeInput'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import useAuthStore, { type LoginRequest, type AuthResult } from '@/stores/AuthStore'
import routes from '@/routes/routes'

import './Login.css'
import '@/styles/Auth.css'
import '@/styles/General.css'

const Login = () => {
    const navigate = useNavigate()
    const { logIn, isLoading, isLogged } = useAuthStore()
    const { t } = useTranslation('common')

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: '',
    })

    useEffect(() => {
        if (isLogged) {
            navigate(routes.home)
        }
    }, [isLogged])

    const handleFormDataChange = (key: string, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: value,
        }))
    }

    const validateForm = (formData: LoginRequest) => {
        const { email, password } = formData

        if (!email || !password) {
            return { isValid: false, message: t('missing_fields') }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { isValid: false, message: t('invalid_email') }
        }

        return { isValid: true, message: '' }
    }

    const handleFormSubmit = async (e: any) => {
        e.preventDefault()

        const validation = validateForm(formData)
        if (!validation.isValid) {
            toast.error(validation.message)
            return
        }

        try {
            const status: AuthResult = await logIn(formData, () => console.log('2FA required'));

            if (status === 'success') {
                toast.success(t('success'))
                navigate(routes.home)
            }

            if (status === 'confirm_email') {
                toast.success(t('login_confirm_email'))
                navigate(routes.verifyEmail)
            }

            return
        } catch (error) {
            toast.error('error')
            console.error('Login error:', error)
        }
    }

    // const handleLoginWithGoogle = async () => {
    //     return
    // }

    return (
        <div className="login-register-main-cont animated-gradient-background">
            <div className="login-register-header">
                <button
                    className="login-register-back-button"
                    onClick={() => navigate(routes.main)}
                    aria-label="Back to home"
                >
                    <IoChevronBack /> {t('backToHome')}
                </button>
            </div>
            <Card className="login-register-card-cont">
                <div className="section-title">
                    {t('login_welcome')}
                </div>

                <form
                    className="login-register-form-cont"
                    onSubmit={(e) => handleFormSubmit(e)}
                >
                    <Input
                        name="email"
                        value={formData.email}
                        setValue={(value) => handleFormDataChange('email', value)}
                        label={t('email_label')}
                        placeholder={t('email_placeholder')}
                    />
                    <PasswordEyeInput
                        name="password"
                        value={formData.password}
                        setValue={(value) => handleFormDataChange('password', value)}
                        label={t('password_label')}
                        placeholder={t('password_placeholder')}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner variant="secondary" /> : t('submit')}
                    </Button>

                    {/* <Button
                        variant="secondary"
                        size="lg"
                        type="button"
                        onClick={handleLoginWithGoogle}
                    >
                        {t('login_with_google')}
                    </Button> */}
                </form>

                <button
                    className="text-btn login-register-footer"
                    onClick={() => navigate(routes.forgotPassword)}
                >
                    <span>{t('login_forgot_password')}</span>
                </button>

                <button
                    className="text-btn login-register-footer"
                    onClick={() => navigate(routes.register)}
                >
                    <span className="login-register-color-text">
                        Registrarse como ...
                    </span>
                </button>
            </Card>
        </div>
    )
}

export default Login
