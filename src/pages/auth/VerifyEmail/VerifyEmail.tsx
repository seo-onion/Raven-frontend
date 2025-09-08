import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import Input from '@/components/forms/Input/Input'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import useAuthStore from '@/stores/AuthStore'
import routes from '@/routes/routes'

import './VerifyEmail.css'
import '@/styles/Auth.css'
import '@/styles/General.css'

const VerifyEmail = () => {
    const navigate = useNavigate()
    const { verifyConfirmationCode, isLoading, isLogged } = useAuthStore()
    const { t } = useTranslation('common')

    const [code, setCode] = useState('')

    useEffect(() => {
        if (isLogged) {
            navigate(routes.home)
        }
    }, [isLogged])

    const validateCode = (code: string) => {
        if (!code || code.length !== 6) {
            return { isValid: false, message: 'Please enter a 6-digit verification code' }
        }
        
        if (!/^\d{6}$/.test(code)) {
            return { isValid: false, message: 'Code must contain only numbers' }
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
                navigate(routes.login)
                return;
            }
        } catch (error) {
            toast.error('Verification failed')
            console.error('Verification error:', error)
        }
    }

    return (
        <div className="login-register-main-cont animated-gradient-background">
            {/* <div className="login-register-header">
                <button 
                    className="login-register-back-button"
                    onClick={() => navigate(routes.login)}
                    aria-label="Back to login"
                >
                    <IoChevronBack /> {t('login_back_to_login_button')}
                </button>
            </div> */}
            
            <Card className="login-register-card-cont">
                <div className="section-title">
                    {t('login_verify_email')}
                </div>
                
                <p className="verify-email-description">
                    Enter the 6-digit verification code sent to your email address.
                </p>

                <form 
                    className="login-register-form-cont" 
                    onSubmit={handleSubmit}
                >
                    <Input
                        name="code"
                        type="text"
                        value={code}
                        setValue={setCode}
                        label="Verification Code"
                        placeholder="123456"
                        maxLength={6}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner variant="secondary" /> : 'Verify Email'}
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default VerifyEmail
