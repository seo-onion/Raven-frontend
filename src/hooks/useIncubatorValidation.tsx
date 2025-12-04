import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/AuthStore';
import { useIncubatorData } from './useIncubatorData';
import routes from '@/routes/routes';

/**
 * Hook to validate that an incubator user has completed basic onboarding
 * Redirects to incubator onboarding wizard if name is missing
 *
 * Should be used in all incubator dashboard pages
 */
export const useIncubatorValidation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();
    const { data: incubatorData, isLoading, isSuccess, isError } = useIncubatorData();

    useEffect(() => {
        // Only validate for incubator users
        if (user?.user_type !== 'incubator') {
            return;
        }

        // If we are already in the wizard, don't redirect
        if (location.pathname === routes.incubatorOnboardingWizard) {
            return;
        }

        // If there's an error fetching data (e.g. 404 profile not found), redirect
        if (isError) {
            console.log('Error fetching incubator data, redirecting to wizard...');
            window.location.href = routes.incubatorOnboardingWizard;
            return;
        }

        // Wait for data to be successfully fetched
        if (!isLoading && isSuccess) {
            // Check if name exists in the fresh data
            if (!incubatorData?.name || incubatorData.name.trim() === '') {
                console.log('Incubator missing name, redirecting to wizard...');
                window.location.href = routes.incubatorOnboardingWizard;
            }
        }
    }, [navigate, user, incubatorData, isLoading, isSuccess, isError, location.pathname]);
};

export default useIncubatorValidation;
