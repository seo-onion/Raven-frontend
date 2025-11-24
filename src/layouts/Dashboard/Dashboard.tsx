import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/AuthStore';
import StartupSidebar from '../../components/dashboard/Sidebar/Sidebar';
import IncubatorSidebar from '../../components/incubator/Sidebar/Sidebar';
import StartupHeader from '../../components/dashboard/Header/Header';
import IncubatorHeader from '../../components/incubator/Header/Header';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const getUserDetails = useAuthStore(state => state.getUserDetails);
    const userDetails = getUserDetails();
    const isIncubator = userDetails?.user_type === 'incubator';

    // Debug logs
    console.log('=== Dashboard Debug ===');
    console.log('userDetails:', userDetails);
    console.log('user_type:', userDetails?.user_type);
    console.log('isIncubator:', isIncubator);
    console.log('======================');

    return (
        <div className="dashboard-unified-container">
            {isIncubator ? <IncubatorSidebar /> : <StartupSidebar />}
            <div className="dashboard-unified-main">
                {isIncubator ? <IncubatorHeader /> : <StartupHeader />}
                <div className="dashboard-unified-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
