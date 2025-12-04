import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster, ToastBar, toast } from "react-hot-toast"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"

import routes from "./routes/routes"
import Home from "./pages/Home/Home"
import ModalBase from "./modals/ModalBase/ModalBase"

import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/auth/Login/Login"
import UserTypeSelection from "./pages/auth/UserTypeSelection/UserTypeSelection"
import Register from "./pages/auth/Register/Register"
import VerifyEmail from "./pages/auth/VerifyEmail/VerifyEmail"
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword"
import ChangePassword from "./pages/auth/ChangePassword/ChangePassword"
import OnboardingWizard from "./pages/startup/OnboardingWizard/OnboardingWizard"
import IncubatorOnboardingWizard from "./pages/incubator/OnboardingWizard/IncubatorOnboardingWizard"

import Dashboard from "./layouts/Dashboard/Dashboard"
import MiProgreso from "./pages/startup/MiProgreso/MiProgreso"
import TRLCRL from "./pages/startup/TRLCRL/TRLCRL"
import Finanzas from "./pages/startup/Finanzas/Finanzas"
import Inversores from "./pages/startup/Inversores/Inversores"
import Desafios from "./pages/startup/Desafios/Desafios"
import Mentoring from "./pages/startup/Mentoring/Mentoring"
import IncubatorOverview from "./pages/incubator/Overview/Overview"
import IncubatorFinanzas from "./pages/incubator/Finanzas/Finanzas"
import Pipeline from "./pages/incubator/Pipeline/Pipeline"
import IncubatorInversores from "./pages/incubator/Inversores/Inversores"
import IncubatorMentoring from "./pages/incubator/Mentoring/Mentoring"
import IncubatorChallenges from "./pages/incubator/Challenges/Challenges"
import IncubatorMetrics from "./pages/incubator/Metrics/IncubatorMetrics"
import IncubatorTRLCRL from "./pages/incubator/TRLCRL/IncubatorTRLCRL"

import useAuthStore from "./stores/AuthStore"
import { useIncubatorData } from "./hooks/useIncubatorData"
import Spinner from "./components/common/Spinner/Spinner"

import './App.css'
import Main from "./pages/Main/Main"

function App() {
    const user = useAuthStore(state => state.user); // Subscribe to the user state
    const { isLogged } = useAuthStore(); // isLogged is still needed from the store

    const WizardRoute = ({ children }: { children: React.ReactNode }) => {
        if (!isLogged) {
            return <Navigate to={routes.main} replace />
        }

        // If not a startup user, redirect to dashboard
        if (user && user.user_type !== 'startup') {
            return <Navigate to={routes.dashboard} replace />
        }

        // If already completed onboarding, redirect to dashboard
        if (user && user.onboarding_complete) {
            return <Navigate to={routes.dashboard} replace />
        }

        return <>{children}</>
    }

    const IncubatorWizardRoute = ({ children }: { children: React.ReactNode }) => {
        const { data: incubatorData, isLoading } = useIncubatorData({
            enabled: isLogged && user?.user_type === 'incubator'
        });

        if (!isLogged) {
            return <Navigate to={routes.main} replace />
        }

        // Safety check: If logged in but no user details, redirect to login to refresh state
        if (!user) {
            return <Navigate to={routes.login} replace />
        }

        // If not an incubator user, redirect to dashboard
        if (user.user_type !== 'incubator') {
            return <Navigate to={routes.dashboard} replace />
        }

        if (isLoading) {
            return <div className="flex justify-center items-center h-screen"><Spinner variant="primary" size="lg" /></div>
        }

        // If already completed onboarding and has name (checked against server data), redirect to dashboard
        if (incubatorData?.name) {
            return <Navigate to={routes.dashboard} replace />
        }

        return <>{children}</>
    }

    const DashboardRoute = ({ children }: { children: React.ReactNode }) => {
        const { data: incubatorData, isLoading } = useIncubatorData({
            enabled: isLogged && user?.user_type === 'incubator'
        });

        if (!isLogged) {
            return <Navigate to={routes.main} replace />
        }

        // Safety check: If logged in but no user details, redirect to login to refresh state
        if (!user) {
            return <Navigate to={routes.login} replace />
        }

        // If startup user hasn't completed onboarding, redirect to wizard
        if (user.user_type === 'startup' && !user.onboarding_complete) {
            return <Navigate to={routes.onboardingWizard} replace />
        }

        // If incubator user hasn't completed onboarding or missing name (checked against server data), redirect to incubator wizard
        if (user.user_type === 'incubator') {
            if (isLoading) {
                return <div className="flex justify-center items-center h-screen"><Spinner variant="primary" size="lg" /></div>
            }

            if (!incubatorData?.name) {
                return <Navigate to={routes.incubatorOnboardingWizard} replace />
            }
        }

        return <>{children}</>
    }

    // Component to redirect /dashboard to the correct page based on user type
    const DashboardRedirect = () => {
        if (user?.user_type === 'startup') {
            return <Navigate to={routes.dashboardMiProgreso} replace />
        }
        return <Navigate to={routes.dashboardOverview} replace />
    }

    return (
        <div className="App">
            <ModalBase />
            <ScrollToTop />
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 5000,
                    success: { className: "toast-success" },
                    error: { className: "toast-error" },
                    style: {
                        zIndex: 20
                    }
                }}
                children={(toasts) => (
                    <ToastBar toast={toasts}>
                        {({ icon, message }) => (
                            <div
                                onClick={() => toast.dismiss()}
                                style={{ cursor: "pointer", display: "flex" }}
                            >
                                {icon}
                                {message}
                            </div>
                        )}
                    </ToastBar>
                )}
            />
            <Routes>
                {/* Auth endpoints - Public routes */}
                <Route path={routes.main} element={<Home />} />
                <Route path={routes.home} element={<Main />} />
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.preRegister} element={<UserTypeSelection />} />
                <Route path={routes.register} element={<Register />} />
                <Route path={routes.verifyEmail} element={<VerifyEmail />} />
                <Route path={routes.forgotPassword} element={<ForgotPassword />} />
                <Route path={routes.changePassword} element={<ChangePassword />} />

                {/* Onboarding - Protected route for startup users only */}
                <Route path={routes.onboardingWizard} element={<WizardRoute><OnboardingWizard /></WizardRoute>} />

                {/* Onboarding - Protected route for incubator users only */}
                <Route path={routes.incubatorOnboardingWizard} element={<IncubatorWizardRoute><IncubatorOnboardingWizard /></IncubatorWizardRoute>} />

                {/* Unified Dashboard - Protected routes for both startup and incubator */}
                <Route path={routes.dashboard} element={<DashboardRoute><Dashboard /></DashboardRoute>}>

                    <Route index element={<DashboardRedirect />} />


                    <Route path={routes.dashboardOverview} element={<IncubatorOverview />} />
                    <Route path={routes.dashboardMiProgreso} element={<MiProgreso />} />
                    <Route path={routes.dashboardPipeline} element={<Pipeline />} />
                    <Route path={routes.dashboardTRLCRL} element={user?.user_type === 'incubator' ? <IncubatorTRLCRL /> : <TRLCRL />} />
                    <Route path={routes.dashboardFinanzas} element={user?.user_type === 'incubator' ? <IncubatorFinanzas /> : <Finanzas />} />
                    <Route path={routes.dashboardInversores} element={user?.user_type === 'incubator' ? <IncubatorInversores /> : <Inversores />} />
                    <Route path={routes.dashboardDesafios} element={user?.user_type === 'incubator' ? <IncubatorChallenges /> : <Desafios />} />
                    <Route path={routes.dashboardMentoring} element={user?.user_type === 'incubator' ? <IncubatorMentoring /> : <Mentoring />} />
                    <Route path={routes.dashboardMetrics} element={<IncubatorMetrics />} />
                </Route>

                {/* Other Protected routes - Require authentication */}
                {/* <Route path={routes.main} element={<ProtectedRoute><Main /></ProtectedRoute>}>
                    <Route path={routes.profile} element={<Profile />} />
                </Route> */}

                <Route path={routes.notFound} element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default App
