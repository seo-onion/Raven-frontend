import React from 'react';
import { Outlet } from 'react-router-dom';
import IncubadoraSidebar from '../../components/incubadora/Sidebar/Sidebar';
import IncubadoraHeader from '../../components/incubadora/Header/Header';
import './IncubadoraDashboard.css';

const IncubadoraDashboard: React.FC = () => {
    return (
        <div className="incubadora-dashboard-container">
            <IncubadoraSidebar />
            <div className="incubadora-dashboard-main">
                <IncubadoraHeader />
                <div className="incubadora-dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default IncubadoraDashboard;
