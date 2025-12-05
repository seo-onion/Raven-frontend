import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useIncubatorOnboarding } from '@/hooks/useIncubatorData';
import routes from '@/routes/routes';
import Button from '@/components/common/Button/Button';
import Input from '@/components/forms/Input/Input';
import Spinner from '@/components/common/Spinner/Spinner';
import toast from 'react-hot-toast';
import './IncubatorOnboardingWizard.css';

const IncubatorOnboardingWizard: React.FC = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const { mutate: completeOnboarding, isPending } = useIncubatorOnboarding();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error(t('please_enter_incubator_name'));
            return;
        }

        completeOnboarding(
            {
                name: name.trim(),
                description: description.trim(),
                logo_url: logoUrl.trim() || undefined,
            },
            {
                onSuccess: () => {
                    toast.success(t('incubator_onboarding_completed'));
                    navigate(routes.dashboard);
                },
                onError: (error) => {
                    console.error('Onboarding failed:', error);
                    toast.error(t('error_completing_onboarding'));
                },
            }
        );
    };

    return (
        <div className="wizard-container" style={{ backgroundColor: 'var(--gray-400)' }}>
            <div className="wizard-card" style={{ backgroundColor: 'white' }}>
                <div className="wizard-content">
                    <div className="wizard-step">
                        <h2 className="text-black wizard-step-title">{t('incubator_onboarding_title')}</h2>
                        <p className="text-black wizard-step-description">{t('incubator_onboarding_description')}</p>

                        <div className="wizard-form-group">
                            <Input
                                name="name"
                                label={t('incubator_name')}
                                value={name}
                                setValue={setName}
                                placeholder={t('enter_incubator_name')}
                                required
                            />
                        </div>

                        <div className="wizard-form-group">
                            <label className="text-black wizard-label">
                                {t('description')} {t('optional')}
                            </label>
                            <textarea
                                className="basic-input-field multiline-textarea"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('enter_incubator_description')}
                            />
                        </div>

                        <div className="wizard-form-group">
                            <Input
                                name="logo_url"
                                label={t('logo_url')}
                                value={logoUrl}
                                setValue={setLogoUrl}
                                placeholder="https://..."
                            />
                            <p className="wizard-form-hint">{t('logo_url_hint')}</p>
                        </div>
                    </div>
                </div>

                <div className="wizard-actions">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isPending || !name.trim()}
                    >
                        {isPending ? <Spinner size="sm" /> : t('complete_setup')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default IncubatorOnboardingWizard;
