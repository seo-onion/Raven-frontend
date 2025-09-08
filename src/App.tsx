import { Routes, Route } from "react-router-dom"
import { Toaster, ToastBar, toast } from "react-hot-toast"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"

import routes from "./routes/routes"
import Main from "./pages/Main/Main"
import Home from "./pages/Home/Home"
import ModalBase from "./modals/ModalBase/ModalBase"

import NotFound from "./pages/NotFound/NotFound"
import Profile from "./pages/Profile/Profile"

import Login from "./pages/auth/Login/Login"
import Register from "./pages/auth/Register/Register"
import VerifyEmail from "./pages/auth/VerifyEmail/VerifyEmail"
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword"
import ChangePassword from "./pages/auth/ChangePassword/ChangePassword"

import './App.css'

function App() {
    // The new AuthStore no longer needs initialization as it
    // checks token validity on creation
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
                              style={{ cursor: "pointer", display: "flex"}}
                            >
                                {icon}
                                {message}
                            </div>
                        )}
                    </ToastBar>
                )}
            />
            <Routes>
                {/* Auth endpoints */}
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.register} element={<Register />} />
                <Route path={routes.verifyEmail} element={<VerifyEmail />} />
                <Route path={routes.forgotPassword} element={<ForgotPassword />} />
                <Route path={routes.changePassword} element={<ChangePassword />} />

                <Route path={routes.main} element={<Main />}>
                    <Route path={routes.home} element={<Home />} />
                    <Route path={routes.profile} element={<Profile />} />
                </Route>
                <Route path={routes.notFound} element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default App
