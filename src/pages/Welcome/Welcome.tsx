import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import routes from '@/routes/routes';
import './Welcome.css';
import { GrDeploy } from "react-icons/gr";

const Welcome = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    const handleLoginStartup = () => {
        navigate(routes.startupLogin);
    };

    const handleLoginIncuvator = () => {
        navigate(routes.incubatorLogin);
    };


    const handleRegister = () => {
        navigate(routes.register);
    };

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <div className="welcome-header">
                    <div className="welcome-logo-icon"><GrDeploy size={64} color='white'></GrDeploy></div>
                    <h1 className="text-white">Raven CRM</h1>
                    <p className="welcome-subtitle text-white">
                        {t('welcome_subtitle')}
                    </p>
                </div>

                <div className="welcome-actions">
                    <div className='login-buttons'>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleLoginStartup}
                            className="welcome-btn"
                        >
                            Iniciar Sesion como StartUp
                        </Button>

                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleLoginIncuvator}
                            className="welcome-btn"
                        >
                            Iniciar Sesion como incuvadora
                        </Button>
                    </div>

                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={handleRegister}
                        className="welcome-btn"
                    >
                        {t('signup')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
