import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoChevronBack } from 'react-icons/io5'
import { GrDeploy } from 'react-icons/gr';


import Input from '@/components/forms/Input/Input'
import PasswordEyeInput from '@/components/forms/PasswordEyeInput/PasswordEyeInput'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import useAuthStore, { type LoginRequest, type AuthResult } from '@/stores/AuthStore'
import routes from '@/routes/routes'

import './StartupLogin.css'
import '@/styles/Auth.css'

const StartupLogin = () => {
    const navigate = useNavigate()
    const { logIn, isLoading } = useAuthStore()
    const { t } = useTranslation('common')

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: '',
    })

    // Comentado para desarrollo - permite acceder al login aunque estés logueado
    // useEffect(() => {
    //     if (isLogged) {
    //         const userDetails = getUserDetails()
    //         if (userDetails?.user_type === 'startup') {
    //             navigate(routes.dashboard)
    //         } else if (userDetails?.user_type === 'incubadora') {
    //             navigate(routes.incubadora)
    //         } else {
    //             navigate(routes.home)
    //         }
    //     }
    // }, [isLogged, navigate])

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
            const status: AuthResult = await logIn(formData, () => console.log('2FA required'))

            if (status === 'success') {
                toast.success(t('success'))
                navigate(routes.dashboardMiProgreso)
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

    return (
        <div className="startuplogin-main-container">
            <div className="startuplogin-logo-container">
                <div className="startuplogin-logo">
                    <GrDeploy size={40} color='var(--main-secondary)' />
                </div>
                <h1 className="text-white">{t('raven_crm_title')}</h1>
                <p className="text-white startuplogin-subtitle">
                    {t('login_as_startup')}
                </p>
            </div>

            <div className="startuplogin-content-container">
                <Card className="startuplogin-card">
                    <h2 className="text-black startuplogin-title">{t('login')}</h2>

                    <form
                        className="startuplogin-form"
                        onSubmit={handleFormSubmit}
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

                        <button
                            type="button"
                            className="text-btn startuplogin-forgot-password"
                            onClick={() => navigate(routes.forgotPassword)}
                        >
                            <span className="">{t('login_forgot_password')}</span>
                        </button>

                        <Button
                            variant="secondary"
                            size="lg"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner variant="secondary" /> : t('submit')}
                        </Button>

                        <button
                            type="button"
                            className="text-btn startuplogin-back-link"
                            onClick={() => navigate(routes.login)}
                        >
                            <IoChevronBack /> {t('back_to_type_selection')}
                        </button>
                    </form>
                </Card>
            </div>

            <div className="startuplogin-demo-note text-white">
                {t('demo_note')}
            </div>
        </div>
    )
}

export default StartupLogin
