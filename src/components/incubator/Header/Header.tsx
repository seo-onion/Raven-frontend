import React from 'react';
import { useAuthStore } from '../../../stores/AuthStore';
import './Header.css';
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuSearch } from "react-icons/lu";

const IncubatorHeader: React.FC = () => {
    const { getUserDetails } = useAuthStore();
    const user = getUserDetails();

    return (
        <header className="incubator-header">
            <div className="incubator-header-search">
                <LuSearch size={24} />
                <input
                    type="text"
                    placeholder="Buscar startups, mentores, inversores..."
                    className="incubator-search-input"
                />
            </div>

            <div className="incubator-header-right">
                <IoIosNotificationsOutline size={32} />

                <div className="incubator-user-info">

                    <div className="incubator-user-avatar text-black">
                        {user?.email ? `@${user.email.charAt(0).toUpperCase()}` : 'U'}
                    </div>

                    <div className='incubator-user-info-container'>
                        <span className="incubator-user-email text-black">{user?.email || 'user@example.com'}</span>
                        <span className="incubator-user-role text-black">
                            {user?.user_type === 'incubator' ? 'Incubadora' : 'Startup'}
                        </span>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default IncubatorHeader;
