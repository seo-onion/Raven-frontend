import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import Input from '@/components/forms/Input/Input'
import Select from '@/components/forms/Select/Select'
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import routes from '@/routes/routes'
import axiosInstance from '@/api/axiosInstance'

import './Onboarding.css'

interface StartupData {
    company_name: string
    industry: string
}

const INDUSTRY_OPTIONS = [
    { value: 'technology', label: 'Technology' },
    { value: 'fintech', label: 'FinTech' },
    { value: 'healthtech', label: 'HealthTech' },
    { value: 'edtech', label: 'EdTech' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS' },
    { value: 'ai_ml', label: 'AI/ML' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'other', label: 'Other' }
]

const Onboarding = () => {
    const navigate = useNavigate()
    const { t } = useTranslation('common')

    const [formData, setFormData] = useState<StartupData>({
        company_name: '',
        industry: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleCompanyNameChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            company_name: value
        }))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            industry: e.target.value
        }))
    }

    const validateForm = (): { isValid: boolean; message: string } => {
        const { company_name, industry } = formData

        if (!company_name || !company_name.trim()) {
            return { isValid: false, message: t('company_name_required') }
        }

        if (!industry) {
            return { isValid: false, message: t('industry_required') }
        }

        return { isValid: true, message: '' }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validation = validateForm()
        if (!validation.isValid) {
            toast.error(validation.message)
            return
        }

        setIsLoading(true)

        try {
            await axiosInstance.post('/onboarding/startup/', formData)

            // Update user details in localStorage
            const updatedUser = await axiosInstance.get('/auth/user/')
            localStorage.setItem('user', JSON.stringify(updatedUser.data))

            toast.success(t('onboarding_success'))
            navigate(routes.dashboard)
        } catch (error: any) {
            console.error('Onboarding error:', error)
            const errorMessage = error.response?.data?.detail || t('onboarding_error')
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="onboarding-main-container">
            <div className="onboarding-content">
                <Card className="onboarding-card">
                    <div className="onboarding-header">
                        <h1 className="text-black">{t('welcome_to_raven')}</h1>
                        <p className="text-black onboarding-subtitle">
                            {t('complete_your_profile')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="onboarding-form">
                        <Input
                            label={t('company_name')}
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            setValue={handleCompanyNameChange}
                            placeholder={t('enter_company_name')}
                            required
                            isDisabled={isLoading}
                        />

                        <Select
                            label={t('industry')}
                            value={formData.industry}
                            onChange={handleSelectChange}
                            options={INDUSTRY_OPTIONS}
                            placeholder={t('select_industry')}
                            required
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="onboarding-submit-button"
                        >
                            {t('continue')}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default Onboarding
