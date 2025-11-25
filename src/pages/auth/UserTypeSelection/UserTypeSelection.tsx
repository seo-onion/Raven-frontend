import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TypeSelectionCard from '@/components/auth/TypeSelectionCard/TypeSelectionCard'
import routes from '@/routes/routes'
import { GrDeploy } from "react-icons/gr";
import './UserTypeSelection.css'
import '@/styles/Auth.css'

const UserTypeSelection = () => {
    const navigate = useNavigate()
    const { t } = useTranslation('common')

    // Comentado para desarrollo - permite acceder al login aunque estés logueado
    // useEffect(() => {
    //     if (isLogged) {
    //         navigate(routes.home)
    //     }
    // }, [isLogged, navigate])

    const handleStartupSelect = () => {
        navigate(`${routes.register}?type=startup`)
    }

    const handleIncubatorSelect = () => {
        navigate(`${routes.register}?type=incubator`)
    }

    return (
        <div className="usertypeselection-main-container">
            <div className="usertypeselection-logo-container">
                <div className="usertypeselection-logo">
                    <GrDeploy size={40} color='var(--main-primary)'/>
                </div>
                <h1 className="text-white">{t('raven_crm_title')}</h1>
                <p className="text-white usertypeselection-subtitle">
                    {t('raven_crm_subtitle')}
                </p>
            </div>

            <div className="usertypeselection-cards-container">
                <TypeSelectionCard
                    icon="🚀"
                    title={t('im_a_startup')}
                    description={t('startup_description')}
                    buttonText={t('login_as_startup')}
                    onClick={handleStartupSelect}
                    variant="startup"
                />

                <TypeSelectionCard
                    icon="🏢"
                    title={t('im_an_incubator')}
                    description={t('incubator_description')}
                    buttonText={t('login_as_incubator')}
                    onClick={handleIncubatorSelect}
                    variant="incubator"
                />
            </div>

            <p className="usertypeselection-register-link">
                <span>{t('no_account')} </span>
                <a
                    style={{
                        color: "white",
                        transition: "color 0.3s ease",
                        textDecoration: "none"
                    }}
                    href="/register"
                    onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = "#d1d5db"}
                    onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = "white"}
                >
                    {t('register_here')}
                </a>
            </p>
        </div>
    )
}

export default UserTypeSelection
