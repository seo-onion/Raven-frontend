import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoChevronBack } from 'react-icons/io5'

import Input from '@/components/forms/Input/Input'
import PasswordEyeInput from '@/components/forms/PasswordEyeInput/PasswordEyeInput'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import useAuthStore, { type SignupRequest } from '@/stores/AuthStore'
import routes from '@/routes/routes'

import './Register.css'
import '@/styles/Auth.css'

const Register = () => {
    const navigate = useNavigate()
    const { registerAccount, isLoading } = useAuthStore()
    const { t } = useTranslation('common')

    const [formData, setFormData] = useState<SignupRequest>({
        email: '',
        password1: '',
        password2: '',
        user_type: 'startup',
    })

    // Comentado para desarrollo - permite acceder al registro aunque estés logueado
    // useEffect(() => {
    //     if (isLogged) {
    //         navigate(routes.home)
    //     }
    // }, [isLogged, navigate])

    const handleFormDataChange = (key: string, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: value,
        }))
    }

    const validateForm = (formData: SignupRequest) => {
        const { email, password1, password2, user_type } = formData

        if (!email || !password1 || !password2 || !user_type) {
            return { isValid: false, message: t('missing_fields') }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { isValid: false, message: t('invalid_email') }
        }

        if (password1 !== password2) {
            return { isValid: false, message: t('passwords_do_not_match') }
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
            const status = await registerAccount(formData)
            if (status) {
                toast.success(t('register_success'))
                navigate(routes.verifyEmail)
            }
        } catch (error) {
            toast.error('error')
            console.error('Registration error:', error)
        }
    }

    return (
        <div className="register-main-container">
            <div className="register-logo-container">
                <div className="register-logo">
                    <div className="register-logo-icon"></div>
                </div>
                <h1 className="text-white">{t('raven_crm_title')}</h1>
                <p className="text-white register-subtitle">
                    {t('create_your_account')}
                </p>
            </div>

            <div className="register-content-container">
                <Card className="register-card">
                    <h2 className="text-black register-title">{t('signup')}</h2>

                    <form
                        className="register-form"
                        onSubmit={handleFormSubmit}
                    >
                        <div className="register-user-type-selector">
                            <label className="text-black register-label">{t('select_account_type')}</label>
                            <div className="register-user-type-buttons">
                                <button
                                    type="button"
                                    className={`register-user-type-button ${formData.user_type === 'startup' ? 'register-user-type-button-active' : ''}`}
                                    onClick={() => handleFormDataChange('user_type', 'startup')}
                                >
                                    {t('startup')}
                                </button>
                                <button
                                    type="button"
                                    className={`register-user-type-button ${formData.user_type === 'incubator' ? 'register-user-type-button-active' : ''}`}
                                    onClick={() => handleFormDataChange('user_type', 'incubator')}
                                >
                                    {t('incubator')}
                                </button>
                            </div>
                        </div>

                        <Input
                            name="email"
                            value={formData.email}
                            setValue={(value) => handleFormDataChange('email', value)}
                            label={t('email_label')}
                            placeholder={t('email_placeholder')}
                        />
                        <PasswordEyeInput
                            name="password1"
                            value={formData.password1}
                            setValue={(value) => handleFormDataChange('password1', value)}
                            label={t('password1_label')}
                            placeholder={t('password1_placeholder')}
                        />
                        <PasswordEyeInput
                            name="password2"
                            value={formData.password2}
                            setValue={(value) => handleFormDataChange('password2', value)}
                            label={t('password2_label')}
                            placeholder={t('password2_placeholder')}
                        />

                        <Button
                            variant="info"
                            size="lg"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner variant="secondary" /> : t('signup')}
                        </Button>

                        <button
                            type="button"
                            className="text-btn register-back-link"
                            onClick={() => navigate(routes.login)}
                        >
                            <IoChevronBack /> {t('back_to_login')}
                        </button>
                    </form>
                </Card>
            </div>

            <div className="register-demo-note text-white">
                {t('demo_note')}
            </div>
        </div>
    )
}

export default Register
