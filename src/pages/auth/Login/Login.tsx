import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoChevronBack } from 'react-icons/io5'
import { MdFactory } from "react-icons/md";
import Input from '@/components/forms/Input/Input'
import PasswordEyeInput from '@/components/forms/PasswordEyeInput/PasswordEyeInput'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import useAuthStore, { type LoginRequest, type AuthResult } from '@/stores/AuthStore'
import routes from '@/routes/routes'

import './Login.css'
import '@/styles/Auth.css'

const IncubatorLogin = () => {
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
                const user = useAuthStore.getState().user;

                // Redirect based on user type and onboarding status
                if (user?.user_type === 'startup') {
                    if (!user.company_name) {
                        // Startup without company_name -> onboarding wizard
                        navigate(routes.onboardingWizard)
                    } else {
                        // Startup with company_name -> Mi Progreso
                        navigate(routes.dashboardMiProgreso)
                    }
                } else {
                    // Incubator
                    // Always validate name and onboarding status
                    if (!user?.name || !user?.onboarding_complete) {
                        // Incubator without name or incomplete onboarding -> onboarding wizard
                        navigate(routes.incubatorOnboardingWizard)
                    } else {
                        // Incubator with name and complete onboarding -> Overview
                        navigate(routes.dashboardOverview)
                    }
                }
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
        <div className="incubatorlogin-main-container">
            <div className="incubatorlogin-logo-container">
                <div className="incubatorlogin-logo">
                    <MdFactory size={40} color='var(--main-primary)' />
                </div>
                <h1 className="text-white">{t('raven_crm_title')}</h1>
            </div>

            <div className="incubatorlogin-content-container">
                <Card className="incubatorlogin-card">
                    <h2 className="text-black incubatorlogin-title">{t('login')}</h2>

                    <form
                        className="incubatorlogin-form"
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
                            className="text-btn incubatorlogin-forgot-password"
                            onClick={() => navigate(routes.forgotPassword)}
                        >
                            <span className="text-black">{t('login_forgot_password')}</span>
                        </button>

                        <Button
                            variant="primary"
                            size="lg"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner variant="secondary" /> : t('submit')}
                        </Button>

                        <button
                            type="button"
                            className="text-btn incubatorlogin-back-link"
                            onClick={() => navigate(routes.preRegister)}
                        >
                            <IoChevronBack /> {t('back_to_type_selection')}
                        </button>
                    </form>
                </Card>
            </div>

            <div className="incubatorlogin-demo-note">
                {t('demo_note')} <button className='text-white' onClick={() => navigate(routes.preRegister)} style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>{t('register_here')}</button>
            </div>
        </div>
    )
}

export default IncubatorLogin