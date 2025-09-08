import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import Card from '../Card/Card';
import './AuthRequired.css';

interface AuthRequiredProps {
    /**
     * Optional button size (defaults to 'md')
     */
    buttonSize?: 'sm' | 'md' | 'lg';
    /**
     * Optional button variant (defaults to 'primary')
     */
    buttonVariant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success';
}

/**
 * A reusable component that displays a message and login button for unauthenticated users.
 * Used across multiple pages that require authentication.
 */
const AuthRequired = ({
    buttonSize = 'md',
    buttonVariant = 'primary'
}: AuthRequiredProps) => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    return (
        <div className="auth-required-container">
            <Card className="auth-required-card">
                <div className="auth-required-content">
                    <h2>{t('auth_required')}</h2>
                    <p>{t('auth_required_message')}</p>
                    <div className="auth-buttons">
                        <Button 
                            variant={buttonVariant} 
                            size={buttonSize} 
                            onClick={() => navigate('/login')}
                        >
                            {t('login')}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AuthRequired;
