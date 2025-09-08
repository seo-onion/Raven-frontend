import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
    RiGithubFill,
    RiTwitterXFill,
    RiTelegramFill,
    RiDiscordFill,
} from 'react-icons/ri'

import routes from '@/routes/routes'
import { projectName } from '@/utils/constants/common'

import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const { t } = useTranslation('common')
    
    return (
        <footer className="footer-main-cont">
            <div className="footer-container">
                <div className="footer-section footer-branding">
                    <Link to={routes.home} className="footer-logo">
                        <span className="footer-logo-text">{projectName}</span>
                    </Link>
                    <p className="footer-tagline">{t('footer_tagline')}</p>
                </div>

                <div className="footer-section footer-links">
                    <h4>{t('footer_navigation')}</h4>
                    <ul>
                        <li><Link to={routes.home}>{t('nav_home')}</Link></li>
                    </ul>
                </div>

                <div className="footer-section footer-social">
                    <h4>{t('footer_community')}</h4>
                    <div className="footer-social-icons">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <RiGithubFill size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <RiTwitterXFill size={20} />
                        </a>
                        <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <RiTelegramFill size={20} />
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <RiDiscordFill size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="footer-copyright">
                    {`© ${currentYear} - ${t('footer_rights')}`}
                </p>
                <p className="footer-made-with">
                    {/* {t('footer_made_with')} <RiHeartFill className="footer-heart" /> {t('footer_in')}  */}
                    {t('footer_location')}
                </p>
            </div>
        </footer>
    )
}

export default Footer
