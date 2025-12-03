import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button/Button'
import routes from '@/routes/routes'
import logo from '@/assets/logo.png'
import { IoRocketOutline } from 'react-icons/io5'
import { BiBuildings } from 'react-icons/bi'
import './Home.css'

const Home = () => {
    const { t } = useTranslation('common')
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate(routes.login)
    }

    const handleRegister = () => {
        navigate(routes.preRegister)
    }

    const handleStartupLogin = () => {
        navigate(`${routes.register}?type=startup`)
    }

    const handleIncubatorLogin = () => {
        navigate(`${routes.register}?type=incubator`)
    }

    return (
        <div className="home__container">
            {/* 1. Navbar */}
            <nav className="home__navbar">
                <div className="home__logo">
                    <img src={logo} alt="Raven Logo" style={{ height: '40px' }} />
                    <span style={{ marginLeft: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--main-primary)' }}>Raven</span>
                </div>
                <div className="home__nav-actions">
                    <Button
                        variant="secondary"
                        onClick={handleLogin}
                        size="md"
                    >
                        {t('action_login')}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleRegister}
                        size="md"
                    >
                        {t('action_register')}
                    </Button>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <section className="home__hero">
                <h1 className="home__hero-title">
                    Gestión integral para el ecosistema de innovación
                </h1>
                <p className="home__hero-subtitle">
                    Conecta tu progreso como Startup con la gestión estratégica de tu Incubadora
                </p>
                <div className="home__hero-actions">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleStartupLogin}
                        style={{ minWidth: '200px' }}
                    >
                        Soy una Startup
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={handleIncubatorLogin}
                        style={{
                            minWidth: '200px',
                            backgroundColor: 'var(--main-secondary)',
                            borderColor: 'var(--main-secondary)'
                        }}
                    >
                        Soy una Incubadora
                    </Button>
                </div>
            </section>

            {/* 3. Startup Section */}
            <section className="home__features-section startup">
                <div className="home__section-header">
                    <div className="home__section-icon">
                        <IoRocketOutline size={64} />
                    </div>
                    <h2 className="home__section-title">Para Startups</h2>
                    <p className="home__hero-subtitle">Acelera tu crecimiento y valida tu modelo</p>
                </div>

                <div className="home__features-grid">
                    <div className="home__feature-card">
                        <h3 className="home__feature-title">Progreso TRL/CRL</h3>
                        <p className="home__feature-desc">
                            Bitácora de 9 niveles con carga de evidencias y galería para validar tu madurez tecnológica y comercial.
                        </p>
                    </div>
                    <div className="home__feature-card">
                        <h3 className="home__feature-title">Finanzas Claras</h3>
                        <p className="home__feature-desc">
                            Visualización de KPIs clave como EBITDA, VAN, TIR y herramientas de flujo de caja exportable.
                        </p>
                    </div>
                    <div className="home__feature-card">
                        <h3 className="home__feature-title">Conexiones</h3>
                        <p className="home__feature-desc">
                            Acceso directo a un listado curado de inversores, rondas de inversión y directorio de mentores expertos.
                        </p>
                    </div>
                    <div className="home__feature-card">
                        <h3 className="home__feature-title">Desafíos</h3>
                        <p className="home__feature-desc">
                            Postula directamente a desafíos empresariales a través de nuestra "Ventanilla Abierta".
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Incubator Section */}
            <section className="home__features-section incubator">
                <div className="home__section-header">
                    <div className="home__section-icon">
                        <BiBuildings size={64} />
                    </div>
                    <h2 className="home__section-title">Para Incubadoras</h2>
                    <p className="home__hero-subtitle">Gestiona tu portafolio y monitorea el éxito</p>
                </div>

                <div className="home__features-grid">
                    <div className="home__feature-card">
                        <h3 className="home__feature-title">Pipeline de Incubación</h3>
                        <p className="home__feature-desc">
                            Tablero Kanban intuitivo con sistema drag & drop para gestionar las etapas de tu portafolio.
                        </p>
                    </div>
                    <div className="home__feature-card">
                        <h3 className="home__feature-title">Visión Global</h3>
                        <p className="home__feature-desc">
                            KPIs consolidados del portafolio y proyecciones estadísticas agregadas para la toma de decisiones.
                        </p>
                    </div>
                    <div className="home__feature-card">
                        <h3 className="home__feature-title">Gestión Centralizada</h3>
                        <p className="home__feature-desc">
                            Administración eficiente de desafíos, postulaciones y seguimiento detallado de sesiones de mentoría.
                        </p>
                    </div>
                    <div className="home__feature-card">
                        <h3 className="home__feature-title">Supervisión TRL/CRL</h3>
                        <p className="home__feature-desc">
                            Acceso completo a las evidencias y progresos de madurez de todas las startups administradas.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. Footer */}
            <footer className="home__footer">
                <p>&copy; {new Date().getFullYear()} Raven CRM. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}

export default Home
