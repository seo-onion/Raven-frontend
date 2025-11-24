import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar/Sidebar';
import Header from '../../components/dashboard/Header/Header';
import './StartupDashboard.css';

const StartupDashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-main">
                <Header />
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StartupDashboard;
