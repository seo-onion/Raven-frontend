import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IoChevronBack } from 'react-icons/io5'

import Input from '@/components/forms/Input/Input'
import PasswordEyeInput from '@/components/forms/PasswordEyeInput/PasswordEyeInput'
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import Spinner from '@/components/common/Spinner/Spinner'
import useAuthStore, { type SignupRequest } from '@/stores/AuthStore'
import routes from '@/routes/routes'

import './Register.css'
import '@/styles/Auth.css'
import '@/styles/General.css'

const Register = () => {
    const navigate = useNavigate()
    const { t } = useTranslation('common')
    const { registerAccount, isLoading, isLogged } = useAuthStore()

    const [formData, setFormData] = useState<SignupRequest>({
        email: '',
        password1: '',
        password2: '',
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

    const validateForm = (formData: SignupRequest) => {
        const { email, password1, password2 } = formData
        
        if (!email || !password1 || !password2) {
            return { isValid: false, message: t('missing_fields') }
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { isValid: false, message: t('invalid_email') }
        }
        
        // Password validation
        if (password1 !== password2) {
            return { isValid: false, message: t('passwords_do_not_match') }
        }
        
        return { isValid: true, message: '' }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const validation = validateForm(formData);
        if (!validation.isValid) {
            toast.error(validation.message);
            return;
        }

        try {
            const status: boolean = await registerAccount(formData);
            if (status) {
                navigate(routes.verifyEmail);
                return;
            }
            toast.error(t('signup_error'));
        } catch (error) {
            toast.error('error');
            console.error('Login error:', error);
        }
    }

    // const handleLoginWithGoogle = () => {
    //     // TODO: implement Google OAuth flow
    // }

    return (
        <div className="login-register-main-cont animated-gradient-background">
            <div className="login-register-header">
                <button
                    className="login-register-back-button"
                    onClick={() => navigate(routes.home)}
                    aria-label="Back to home"
                >
                    <IoChevronBack /> {t('backToHome')}
                </button>
            </div>

            <Card className="login-register-card-cont">
                <div className="section-title">{t('signup')}</div>

                <form className="login-register-form-cont" onSubmit={handleSubmit}>
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        setValue={(v) => handleFormDataChange('email', v)}
                        label={t('email_label')}
                        placeholder={t('email_placeholder')}
                    />
                    <PasswordEyeInput
                        name="password1"
                        value={formData.password1}
                        setValue={(v) => handleFormDataChange('password1', v)}
                        label={t('password1_label')}
                        placeholder={t('password1_placeholder')}
                    />
                    <PasswordEyeInput
                        name="password2"
                        value={formData.password2}
                        setValue={(v) => handleFormDataChange('password2', v)}
                        label={t('password2_label')}
                        placeholder={t('password2_placeholder')}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={isLoading}
                    >
                        {(isLoading) ? <Spinner variant="secondary" /> : t('signup')}
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

                <button className="text-btn login-register-footer" onClick={() => navigate(routes.login)}>
                    <span>{t('login_old_user')}</span>
                    <span className="login-register-color-text">{t('login')}</span>
                </button>
            </Card>
        </div>
    )
}

export default Register
