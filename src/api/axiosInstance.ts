import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios"

import useAuthStore from "@/stores/AuthStore"
import usePageLayoutStore from "@/stores/PageLayoutStore"

// Paths
export const LOGIN_PATH = "/auth/login/"
export const LOGOUT_PATH = "/auth/logout/"
export const REFRESH_PATH = "/auth/token/refresh/"
export const SIGNUP_PATH = "/auth/registration/"
export const RESEND_EMAIL_PATH = "/resend-email-confirmation/"
export const CONFIRM_EMAIL_PATH = "/auth/registration/account-confirm-email/"
export const CHANGE_PASSWORD_PATH = "/auth/password/change/"
export const RESET_PASSWORD_PATH = "/auth/password/reset/"
export const RESET_PASSWORD_CONFIRM_PATH = "/auth/password/reset/confirm/"

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
        const originalRequest = error.config
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
            
            if (!isAuthEndpoint && !isTokenRefresh) {
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
            }
        }
        
        // For all other errors, reject the promise
        return Promise.reject(error)
    }
)

export default axiosInstance
