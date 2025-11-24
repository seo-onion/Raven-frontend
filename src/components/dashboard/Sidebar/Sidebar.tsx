import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/AuthStore';
import routes from '../../../routes/routes';
import './Sidebar.css';
import { GrDeploy } from 'react-icons/gr';
import { GoGraph } from "react-icons/go";
import { LuDollarSign } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { FiTarget } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import Spinner from '@/components/common/Spinner/Spinner';

// Definición de la interfaz (buena práctica, aunque opcional)
interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

const Sidebar: React.FC = () => {
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
        { icon: <GrDeploy size={24} />, label: 'Mi Progreso', path: '/dashboard/mi-progreso' },
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
                className="sidebar-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Sidebar"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-top">
                    <div className='logo-container'>
                        <GrDeploy size={24} color='white' />
                    </div>
                    <div>
                        <h2 className="sidebar-logo">Raven CRM</h2>
                        <p className="sidebar-subtitle text-black">TechVision AI</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            // Pasa la función isActive a una variable para usarla en los spans internos
                            className={({ isActive }) =>
                                `sidebar-nav-item ${isActive ? 'active' : ''}`
                            }
                            onClick={() => setIsOpen(false)}
                        >
                            {({ isActive }) => ( // Usa un render prop pattern aquí para acceder a isActive
                                <>
                                    {/* Aplica la clase 'text-white' o similar condicionalmente */}
                                    <span className={`sidebar-nav-icon ${isActive ? 'aside-text-active' : ''}`}>{item.icon}</span>
                                    <span className={`sidebar-nav-label ${isActive ? 'aside-text-active' : ''}`}>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="sidebar-logout-btn text-black"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <>
                                <Spinner variant="secondary" size="sm" />
                                <span className="sidebar-nav-label">Cerrando...</span>
                            </>
                        ) : (
                            <>
                                <RxExit size={24} />
                                <span className="sidebar-nav-label">Cerrar Sesión</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
