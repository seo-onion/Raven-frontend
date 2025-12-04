import { useTranslation } from "react-i18next"
import { Link, useLocation } from 'react-router-dom'
import {
    RiHome3Line,
    RiCloseLine,
    RiBarChartBoxLine,
} from 'react-icons/ri'

import routes from '@/routes/routes'
import { mainLogo } from "@/utils/constants/common"
import useAuthStore from "@/stores/AuthStore"

import './Sidebar.css'

const Sidebar = () => {
    const { t } = useTranslation('common')
    const location = useLocation()
    const user = useAuthStore(state => state.user)

    const isActive = (path: string) => location.pathname === path

    // Base nav items for all users
    const navItems = [
        { path: routes.home, icon: RiHome3Line, label: t('nav_home') },
    ]

    // Incubator-only nav items
    const incubatorNavItems = [
        { path: routes.dashboardMetrics, icon: RiBarChartBoxLine, label: t('nav_metrics') || 'Métricas' },
    ]

    // Combine based on user type
    const allNavItems = user?.user_type === 'incubator'
        ? [...navItems, ...incubatorNavItems]
        : navItems

    return (
        <>
            <nav className="sidebar-main-cont">
                <div className="sidebar-header">
                    <Link to={routes.home} className="sidebar-logo">
                        <img src={mainLogo.src} alt={mainLogo.alt} className="sidebar-logo-img" />
                    </Link>
                    <button className="sidebar-close-button">
                        <RiCloseLine size={24} />
                    </button>
                </div>

                <div className="sidebar-nav-links">
                    {allNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <item.icon className="sidebar-icon" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    )
}

export default Sidebar
