import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/AuthStore';
import StartupSidebar from '../../components/dashboard/Sidebar/Sidebar';

import StartupHeader from '../../components/dashboard/Header/Header';
import IncubatorHeader from '../../components/incubator/Header/Header';
import Spinner from '@/components/common/Spinner/Spinner';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const userDetails = useAuthStore(state => state.user);
    const logOut = useAuthStore(state => state.logOut);
    const isLoading = useAuthStore(state => state.isLoading);
    const isIncubator = userDetails?.user_type === 'incubator';

    // Debug logs
    React.useEffect(() => {
        console.log('=== Dashboard Debug ===');
        console.log('userDetails:', userDetails);
        console.log('user_type:', userDetails?.user_type);
        console.log('isIncubator:', isIncubator);
        console.log('isLoading:', isLoading);
        console.log('======================');
    }, [userDetails, isIncubator, isLoading]);

    // Redirect if no user details (handled by App.tsx usually, but as backup)
    React.useEffect(() => {
        if (!userDetails && !isLoading) {
            const isLogged = useAuthStore.getState().isLogged;
            if (isLogged) {
                console.log('User details missing and not loading, logging out...');
                logOut();
            }
        }
    }, [userDetails, isLoading, logOut]);

    if (!userDetails) {
        return <div className="dashboard-loading"><Spinner variant="primary" size="lg" /></div>;
    }

    return (
        <div className="dashboard-unified-container">
            <StartupSidebar />
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
