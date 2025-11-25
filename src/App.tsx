import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster, ToastBar, toast } from "react-hot-toast"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"

import routes from "./routes/routes" 
import Home from "./pages/Home/Home"
import ModalBase from "./modals/ModalBase/ModalBase"

import NotFound from "./pages/NotFound/NotFound" 

import UserTypeSelection from "./pages/auth/UserTypeSelection/UserTypeSelection"
import StartupLogin from "./pages/auth/StartupLogin/StartupLogin"
import IncubatorLogin from "./pages/auth/IncubatorLogin/IncubatorLogin"
import Register from "./pages/auth/Register/Register"
import VerifyEmail from "./pages/auth/VerifyEmail/VerifyEmail"
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword"
import ChangePassword from "./pages/auth/ChangePassword/ChangePassword"

import Dashboard from "./layouts/Dashboard/Dashboard"
import MiProgreso from "./pages/startup/MiProgreso/MiProgreso"
import TRLCRL from "./pages/startup/TRLCRL/TRLCRL"
import Finanzas from "./pages/startup/Finanzas/Finanzas"
import Inversores from "./pages/startup/Inversores/Inversores"
import Desafios from "./pages/startup/Desafios/Desafios"
import Mentoring from "./pages/startup/Mentoring/Mentoring"
import IncubatorOverview from "./pages/incubator/Overview/Overview"

import useAuthStore from "./stores/AuthStore"

import './App.css'

function App() {
    const { isLogged } = useAuthStore()

    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        console.log("Estoy registrado: ", isLogged)
        if (!isLogged) {
            return <Navigate to={routes.login} replace />
        }
        return <>{children}</>
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
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.main} element={<UserTypeSelection />} />
                <Route path={routes.login} element={<UserTypeSelection />} />
                <Route path={routes.startupLogin} element={<StartupLogin />} />
                <Route path={routes.incubatorLogin} element={<IncubatorLogin />} />
                <Route path={routes.register} element={<Register />} />
                <Route path={routes.verifyEmail} element={<VerifyEmail />} />
                <Route path={routes.forgotPassword} element={<ForgotPassword />} />
                <Route path={routes.changePassword} element={<ChangePassword />} />

                {/* Unified Dashboard - Protected routes for both startup and incubator */}
                <Route path={routes.dashboard} element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>

                    <Route index element={<Navigate to={routes.dashboardOverview} replace />} />

                    
                    <Route path={routes.dashboardOverview} element={<IncubatorOverview />} />
                    <Route path={routes.dashboardMiProgreso} element={<MiProgreso />} />
                    <Route path={routes.dashboardPipeline} element={<div className="text-black">Pipeline - En desarrollo</div>} />
                    <Route path={routes.dashboardTRLCRL} element={<TRLCRL />} />
                    <Route path={routes.dashboardFinanzas} element={<Finanzas />} />
                    <Route path={routes.dashboardInversores} element={<Inversores />} />
                    <Route path={routes.dashboardDesafios} element={<Desafios />} />
                    <Route path={routes.dashboardMentoring} element={<Mentoring />} />
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
