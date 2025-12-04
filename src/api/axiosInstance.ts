import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios"

import useAuthStore from "@/stores/AuthStore"
import usePageLayoutStore from "@/stores/PageLayoutStore"

// Paths
export const LOGIN_PATH = "/api/users/auth/login/"
export const LOGOUT_PATH = "/api/users/auth/logout/"
export const REFRESH_PATH = "/api/users/auth/token/refresh/"
export const SIGNUP_PATH = "/api/users/auth/registration/"
export const RESEND_EMAIL_PATH = "/api/users/resend-email-confirmation/"
export const CONFIRM_EMAIL_PATH = "/api/users/auth/registration/account-confirm-email/"
export const CHANGE_PASSWORD_PATH = "/api/users/auth/password/change/"
export const RESET_PASSWORD_PATH = "/api/users/auth/password/reset/"
export const RESET_PASSWORD_CONFIRM_PATH = "/api/users/auth/password/reset/confirm/"

// Evidence Paths
export const EVIDENCE_BASE_PATH = "/api/users/startup/evidences/"

// Readiness Level Paths
export const READINESS_LEVEL_BASE_PATH = "/api/users/startup/readiness-levels/"

// Incubator Paths
export const INCUBATOR_BASE_PATH = "/api/users/incubators/"
export const INCUBATOR_MEMBERS_PATH = "/api/users/incubator/members/"
export const INCUBATOR_DATA_PATH = "/api/users/incubator/data/"
export const INCUBATOR_ONBOARDING_PATH = "/api/users/incubator/complete-onboarding/"
export const INCUBATOR_INVESTMENTS_PATH = "/api/users/incubator/investments/"
export const INCUBATOR_PORTFOLIO_CAMPAIGNS_PATH = "/api/users/incubator/portfolio/campaigns/"
export const INCUBATOR_PORTFOLIO_EVIDENCES_PATH = "/api/users/incubator/portfolio/evidences/"

// Challenge Paths
export const CHALLENGES_PATH = "/api/users/challenges/"
export const CHALLENGE_APPLICATIONS_PATH = "/api/users/challenge-applications/"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/",
    // TODO we need this?
    // withCredentials: true,
})

const noAuthRequireApis = [
    LOGIN_PATH,
    REFRESH_PATH,
    SIGNUP_PATH,
    RESEND_EMAIL_PATH,
    CONFIRM_EMAIL_PATH,
    RESET_PASSWORD_PATH,
    RESET_PASSWORD_CONFIRM_PATH,
]


// Extend InternalAxiosRequestConfig to include _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Add the token to the request headers
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        config.headers = config.headers || {}
        // TODO do we need this?
        // config.headers["X-API-LANG"] = localStorage.getItem("language") || "es"

        if (noAuthRequireApis.includes(config.url || "")) return config

        const token = await useAuthStore.getState().getAccessToken()
        if (!token) return config

        config.headers["Authorization"] = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {

        // Set maintenance mode to false
        const setIsMaintenance = usePageLayoutStore.getState().setIsMaintenance
        setIsMaintenance(false)

        // NOTE this is for adding more interceptors

        return response
    },
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig
        const getAccessToken = useAuthStore.getState().getAccessToken
        const logOut = useAuthStore.getState().logOut
        const setIsMaintenance = usePageLayoutStore.getState().setIsMaintenance

        // Handle 503 Service Unavailable errors
        if (error.response?.status === 503) {
            setIsMaintenance(true)
            return Promise.reject(error)
        }

        // Handle authentication errors (401)
        if (error.response?.status === 401) {
            // Check for specific error messages that require logout
            const errorMsg = error.response?.data?.code?.message || ""
            if (["user_not_found", "user_inactive", "token_not_valid"].includes(errorMsg)) {
                logOut()
                return Promise.reject(error)
            }

            // Skip token refresh for auth endpoints and token refresh endpoint itself
            const isAuthEndpoint = noAuthRequireApis.includes(originalRequest.url || "")
            const isTokenRefresh = originalRequest.url === "/auth/token/refresh/"

            if (!isAuthEndpoint && !isTokenRefresh && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const newToken = await getAccessToken()
                    if (newToken) {
                        // Retry the original request with the new token
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`
                        return axiosInstance(originalRequest)
                    }
                } catch (err) {
                    console.log("Token refresh failed", err)
                    logOut()
                }
            } else if (originalRequest._retry) {
                // If we already retried and failed, force logout
                logOut();
            }
        }

        // For all other errors, reject the promise
        return Promise.reject(error)
    }
)

export default axiosInstance
