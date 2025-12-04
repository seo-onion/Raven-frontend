import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/AuthStore';
import { useStartupData } from './useStartupData';
import routes from '@/routes/routes';

/**
 * Hook to validate that a startup user has completed basic onboarding
 * Redirects to onboarding wizard if company_name is missing
 *
 * Should be used in all startup dashboard pages
 */
export const useStartupValidation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore(); // Use user directly from store state
    const { data: startupData, isLoading, isSuccess, isError } = useStartupData();

    useEffect(() => {
        console.log('useStartupValidation check:', {
            userType: user?.user_type,
            isLoading,
            isSuccess,
            isError,
            hasCompanyName: !!startupData?.company_name,
            companyName: startupData?.company_name,
            path: location.pathname
        });

        // If explicitly incubator, do not validate (incubators don't need company_name in this context)
        if (user?.user_type === 'incubator') {
            return;
        }

        // If we are already in the wizard, don't redirect
        if (location.pathname === routes.onboardingWizard) {
            return;
        }

        // If there's an error fetching data (e.g. 404 profile not found), redirect
        // We only redirect on error if we are NOT explicitly an incubator
        if (isError) {
            console.log('Error fetching startup data, redirecting to wizard...');
            window.location.href = routes.onboardingWizard;
            return;
        }

        // Wait for data to be successfully fetched
        // We check this regardless of user_type being 'startup' or undefined
        // because if the API call succeeds, we are likely a startup context
        if (!isLoading && isSuccess) {
            console.log('Startup Data for validation:', startupData);

            // Check if company_name exists in the fresh data
            if (!startupData?.company_name || startupData.company_name.trim() === '') {
                console.log('Startup missing company_name, redirecting to wizard...');
                window.location.href = routes.onboardingWizard;
            }
        }
    }, [navigate, user, startupData, isLoading, isSuccess, isError, location.pathname]);
};

export default useStartupValidation;
