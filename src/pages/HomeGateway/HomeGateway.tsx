import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button/Button'
import routes from '@/routes/routes'
import './HomeGateway.css'

const HomeGateway = () => {
    const { t } = useTranslation('common')
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate(routes.login)
    }

    const handleRegister = () => {
        navigate(routes.register)
    }

    return (
        <div className="homegateway_container">
            <div className="homegateway_card">
                <div className="homegateway_content">
                    <h1 className="homegateway_title text-black">
                        {t('homegateway_title')}
                    </h1>
                    <p className="homegateway_subtitle text-black">
                        {t('homegateway_subtitle')}
                    </p>
                    <div className="homegateway_actions">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleLogin}
                            className="homegateway_button"
                        >
                            {t('homegateway_login')}
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleRegister}
                            className="homegateway_button"
                        >
                            {t('homegateway_register')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeGateway
