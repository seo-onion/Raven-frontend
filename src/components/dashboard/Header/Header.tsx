import React from 'react';
import { useAuthStore } from '../../../stores/AuthStore';
import './Header.css';
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuSearch } from "react-icons/lu";

const Header: React.FC = () => {
    const { getUserDetails } = useAuthStore();
    const user = getUserDetails();


    return (
        <header className="dashboard-header">
            <div className="dashboard-header-search">
            <LuSearch size={24} />
                <input
                    type="text"
                    placeholder="Buscar startups, mentores, inversores..."
                    className="dashboard-search-input"
                />
            </div>

            <div className="dashboard-header-right">
                <IoIosNotificationsOutline size={32} />

                <div className="dashboard-user-info">

                    <div className="dashboard-user-avatar text-black">
                        {user?.email ? `@${user.email.charAt(0).toUpperCase()}` : 'U'}
                    </div>

                    <div className='user-info-container'>
                        <span className="dashboard-user-email text-black">{user?.email || 'user@example.com'}</span>
                        <span className="dashboard-user-role text-black">
                            {user?.user_type === 'incubator' ? 'Incubadora' : 'Startup'}
                        </span>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
