import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/AuthStore';
import routes from '../../../routes/routes';
import './Sidebar.css';
import Spinner from '@/components/common/Spinner/Spinner';
import { MdFactory } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { LuDollarSign } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { FiTarget } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import { MdDashboard } from "react-icons/md";
import { LuPackage } from "react-icons/lu";

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

const IncubatorSidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { logOut } = useAuthStore();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logOut();
        setIsLoggingOut(false);
        navigate(routes.login);
    };

    const menuItems: MenuItem[] = [
        { icon: <MdDashboard size={24} />, label: 'Overview', path: '/dashboard/overview' },
        { icon: <LuPackage size={24} />, label: 'Pipeline', path: '/dashboard/pipeline' },
        { icon: <GoGraph size={24}/>, label: 'TRL/CRL', path: '/dashboard/trl-crl' },
        { icon: <LuDollarSign size={24}/>, label: 'Finanzas', path: '/dashboard/finanzas' },
        { icon: <LuUsers size={24}/>, label: 'Inversores', path: '/dashboard/inversores' },
        { icon: <FiTarget size={24}/>, label: 'Desafíos', path: '/dashboard/desafios' },
        { icon: <LuBrain size={24}/>, label: 'Mentoring', path: '/dashboard/mentoring' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="incubator-sidebar-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Sidebar"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <aside className={`incubator-sidebar ${isOpen ? 'incubator-sidebar-open' : ''}`}>
                <div className="incubator-sidebar-top">
                    <div className='incubator-logo-container'>
                        <MdFactory size={24} color='white' />
                    </div>
                    <div>
                        <h2 className="incubator-sidebar-logo">Raven CRM</h2>
                        <p className="incubator-sidebar-subtitle text-black">BioHub Accelerator</p>
                    </div>
                </div>

                <nav className="incubator-sidebar-nav">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) =>
                                `incubator-sidebar-nav-item ${isActive ? 'active' : ''}`
                            }
                            onClick={() => setIsOpen(false)}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`incubator-sidebar-nav-icon ${isActive ? 'incubator-aside-text-active' : ''}`}>{item.icon}</span>
                                    <span className={`incubator-sidebar-nav-label ${isActive ? 'incubator-aside-text-active' : ''}`}>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="incubator-sidebar-footer">
                    <button
                        className="incubator-sidebar-logout-btn text-black"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <>
                                <Spinner variant="primary" size="sm" />
                                <span className="incubator-sidebar-nav-label">Cerrando...</span>
                            </>
                        ) : (
                            <>
                                <RxExit size={24} />
                                <span className="incubator-sidebar-nav-label">Cerrar Sesión</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="incubator-sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default IncubatorSidebar;
