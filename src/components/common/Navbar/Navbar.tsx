import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
    RiHome3Line,
    RiMenuLine,
    RiCloseLine,
    RiUserLine,
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import routes from '@/routes/routes'
import { mainLogo, projectName } from "@/utils/constants/common"
import useAuthStore, { type UserDetails } from '@/stores/AuthStore'
import Button from '@/components/common/Button/Button'
import Spinner from '@/components/common/Spinner/Spinner'
// import LanguageToggle from '@/components/general/LanguageToggle/LanguageToggle'

import './Navbar.css'

const Navbar = () => {
    const navigate = useNavigate()
    const { t } = useTranslation('common')
    const location = useLocation()

    const { isLogged, getUserDetails } = useAuthStore()
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userDetails, setUserDetails] = useState<UserDetails | undefined>(undefined)
    const [profileLoading, setProfileLoading] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    

    useEffect(() => {
        if (isLogged) {
            // Simulate loading state for better UX
            setProfileLoading(true)
            setTimeout(() => {
                const userData = getUserDetails()
                setUserDetails(userData)
                setProfileLoading(false)
            }, 500)
        }
    }, [isLogged, getUserDetails])
    
    // Handle scroll event to add glass effect when scrolled
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isActive = (path: string) => location.pathname.startsWith(path)

    const navItems = [
        { path: routes.home, icon: RiHome3Line, label: t('nav_home') },
    ]

    const toggleMobileMenu = () => {
        setMobileMenuOpen(prev => !prev)
    }

    return (
        <nav className={`navbar-main-cont ${scrolled ? 'navbar-scrolled' : ''}`}>
            
            {/* Main logo */}
            <Link to={routes.home} className="navbar-logo">
                <img src={mainLogo.src} alt={mainLogo.alt} className="navbar-logo-img" />
                <span className="navbar-logo-text">{projectName}</span>
            </Link>

            {/* MOBILE: menu toggle */}
            <button className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? (
                    <RiCloseLine size={24} className="fade-in" />
                ) : (
                    <RiMenuLine size={24} className="fade-in" />
                )}
            </button>
            
            {/* DESKTOP: menu links */}
            <div className={`navbar-nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`navbar-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <item.icon className="navbar-icon" />
                        <span className="navbar-link-text">{item.label}</span>
                        {isActive(item.path) && <span className="navbar-active-indicator"></span>}
                    </Link>
                ))}
                
                {isLogged && mobileMenuOpen ? (
                    <Link 
                        to="/profile"
                        className={`navbar-nav-link ${isActive('/profile') ? 'active' : ''} show-when-small`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <RiUserLine className="navbar-icon" />
                        <span>{t('profile')}</span>
                    </Link>
                ) : (
                    <Button 
                        variant="primary"
                        size="sm"
                        className="show-when-small"
                        onClick={() => navigate(routes.login)}
                    >
                        {t('nav_login')}
                    </Button>
                )}
                
            </div>
            
            {/* User actions */}
            <div className="navbar-actions">
                {profileLoading ? (
                    <div className="navbar-user-info fade-in">
                        <Spinner className="navbar-user" />
                    </div>
                ) : isLogged ? (
                    <div className="navbar-user-info fade-in">
                        <Link to="/profile" className="navbar-user transform-3d">
                            <div className="navbar-user-avatar">
                                <span className="avatar-text">{userDetails?.username?.charAt(0).toUpperCase() || 'U'}</span>
                                <div className="avatar-shine"></div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="navbar-auth-actions fade-in">
                        <Button 
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(routes.login)}
                        >
                            {t('nav_login')}
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar