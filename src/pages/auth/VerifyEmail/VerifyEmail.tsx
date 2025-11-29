import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoChevronBack } from 'react-icons/io5'

import Input from '@/components/forms/Input/Input'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import useAuthStore from '@/stores/AuthStore'
import routes from '@/routes/routes'

import './VerifyEmail.css'
import '@/styles/Auth.css'

const VerifyEmail = () => {
    const navigate = useNavigate()
    const { verifyConfirmationCode, isLoading } = useAuthStore()
    const { t } = useTranslation('common')

    const [code, setCode] = useState('')
    const [isResending, setIsResending] = useState(false)

    // Comentado para desarrollo - permite acceder a verificación aunque estés logueado
    // useEffect(() => {
    //     if (isLogged) {
    //         navigate(routes.home)
    //     }
    // }, [isLogged, navigate])

    const validateCode = (code: string) => {
        if (!code || code.length !== 6) {
            return { isValid: false, message: t('verify_code_6_digits') }
        }

        if (!/^\d{6}$/.test(code)) {
            return { isValid: false, message: t('verify_code_numbers_only') }
        }

        return { isValid: true, message: '' }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const validation = validateCode(code)
        if (!validation.isValid) {
            toast.error(validation.message)
            return
        }

        try {
            const success = await verifyConfirmationCode(code)
            if (success) {
                toast.success(t('email_verified_success'))

                // Get user data from localStorage to check onboarding status
                const userStr = localStorage.getItem('user')
                if (userStr) {
                    const user = JSON.parse(userStr)

                    // If startup user hasn't completed onboarding, redirect to wizard
                    if (user.user_type === 'startup' && !user.onboarding_complete) {
                        navigate(routes.onboardingWizard)
                        return
                    }
                }

                // Otherwise, redirect to dashboard
                navigate(routes.dashboard)
            }
        } catch (error) {
            toast.error(t('verification_failed'))
            console.error('Verification error:', error)
        }
    }

    const handleResendCode = async () => {
        setIsResending(true)
        try {
            // Note: resendConfirmationCode necesita el token del cache
            // Por ahora solo mostramos un mensaje
            toast.success(t('verification_email_resent'))
        } catch (error) {
            toast.error(t('error'))
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="verifyemail-main-container">
            <div className="verifyemail-logo-container">
                <div className="verifyemail-logo">
                    <div className="verifyemail-logo-icon"></div>
                </div>
                <h1 className="text-white">{t('raven_crm_title')}</h1>
                <p className="text-white verifyemail-subtitle">
                    {t('verify_your_email')}
                </p>
            </div>

            <div className="verifyemail-content-container">
                <Card className="verifyemail-card">
                    <h2 className="text-black verifyemail-title">{t('email_verification')}</h2>

                    <p className="text-black verifyemail-description">
                        {t('verify_email_description')}
                    </p>

                    <form
                        className="verifyemail-form"
                        onSubmit={handleSubmit}
                    >
                        <Input
                            name="code"
                            type="text"
                            value={code}
                            setValue={setCode}
                            label={t('verification_code_label')}
                            placeholder="123456"
                            maxLength={6}
                        />

                        <Button
                            variant="info"
                            size="lg"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner variant="secondary" /> : t('verify_email_button')}
                        </Button>

                        <button
                            type="button"
                            className="text-btn verifyemail-resend-button"
                            onClick={handleResendCode}
                            disabled={isResending}
                        >
                            {isResending ? t('sending') : t('resend_verification_code')}
                        </button>

                        <button
                            type="button"
                            className="text-btn verifyemail-back-link"
                            onClick={() => navigate(routes.login)}
                        >
                            <IoChevronBack /> {t('back_to_login')}
                        </button>
                    </form>
                </Card>
            </div>

            <div className="verifyemail-demo-note text-white">
                {t('demo_note')}
            </div>
        </div>
    )
}

export default VerifyEmail
