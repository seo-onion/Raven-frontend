import { create } from "zustand"
import toast from "react-hot-toast"
import { jwtDecode } from "jwt-decode"
import i18n from "@/i18n"
import axiosInstance from "@/api/axiosInstance"
import usePageLayoutStore from "@/stores/PageLayoutStore"

import { 
    LOGIN_PATH, 
    LOGOUT_PATH,
    REFRESH_PATH, 
    SIGNUP_PATH, 
    RESEND_EMAIL_PATH, 
    CONFIRM_EMAIL_PATH,
    CHANGE_PASSWORD_PATH, 
    RESET_PASSWORD_PATH, 
    RESET_PASSWORD_CONFIRM_PATH 
} from "@/api/axiosInstance";


// Type definitions
interface TokenPayload {
    exp: number;
}

export interface UserDetails {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    actions_freezed_till?: string;
}

/**
 * Login
 */

export interface LoginRequest {
    email: string;
    password: string;
    googlecode?: string;
}

interface LoginSuccessResponse {
    access: string;
    refresh: string;
    user: UserDetails;
    access_expiration?: string;
    refresh_expiration?: string;
}

interface LoginErrorResponse {
    message?: string[];
    type?: string[]; // wrong_data
    token?: string[];
}

// NOTE the only non errors are "success" and "confirm_email"
export type AuthResult = "success" | "error" | "go2fa" | "otp_fail" | "wrong_data" | "reset_psw" | "account_block" | "invalid" | "confirm_email";

/**
 * Logout
 */

export interface LogoutSuccessResponse {
    detail: string;
}

interface LogoutErrorResponse {
    detail?: string;
    code?: string;
    messages?: string[]; // "message": "Token is invalid"
}

/**
 * Refresh token
 */

export interface RefreshRequest {
    refresh: string;
}

interface RefreshSuccessResponse {
    access: string;
    refresh: string;
    access_expiration?: string;
    refresh_expiration?: string;
}
interface RefreshErrorResponse {
    detail?: string;
    code?: string;
}

/**
 * Signup
 */

export interface SignupRequest {
    email: string;
    password1: string;
    password2: string;
    username?: string;
    captcha_response?: string;
}

interface SignupSuccessResponse {
    detail: string;
}
interface SignupErrorResponse {
    // For registering with invalid email
    email?: {
        message?: string;
        type?: string;
    };
    // For password mismatch
    non_field_errors?: string[];
}

/**
 * Re-send email confirmation email 
 */

export interface ResendEmailRequest {
    token: string;
}

interface ResendEmailSuccessResponse {
    Status: boolean;
}

interface ResendEmailErrorResponse {
    Status: boolean;
    code?: string;
}

/**
 * Confirm email
 */

export interface ConfirmEmailRequest {
    key: string;
}

interface ConfirmEmailSuccessResponse {
    detail: string;
    access_token?: string;
    refresh_token?: string;
    user?: UserDetails;
}
interface ConfirmEmailErrorResponse {
    detail?: string;
}

/**
 * Reset password
 */

export interface ResetPasswordRequest {
    email: string;
    captcha?: string;
}

interface ResetPasswordSuccessResponse {
    detail: string;
}
interface ResetPasswordErrorResponse {
    email?: string[];
}

/**
 * Reset password confirm
 */

export interface ResetPasswordConfirmRequest {
    uid: string;
    token: string;
    new_password1: string;
    new_password2: string;
}

interface ResetPasswordConfirmSuccessResponse {
    detail: string;
}
interface ResetPasswordConfirmErrorResponse {
    uid?: string[];
    token?: string[];
}

/**
 * Change password
 */

export interface ChangePasswordRequest {
    old_password: string;
    new_password1: string;
    new_password2: string;
}

interface ChangePasswordSuccessResponse {
    detail: string;
}
interface ChangePasswordErrorResponse {
    detail?: string;
    code?: string;
    messages?: any[];
}

// Local storage keys
export const ACCESS_TOKEN_KEY = "access_token"
export const REFRESH_TOKEN_KEY = "refresh_token"
export const USER_KEY = "user"

/**
 * Auth store interface definition
 */
interface AuthStore {
    // State
    isLogged: boolean;
    isLoading: boolean;
    
    // Authentication methods
    logIn: (credentials: LoginRequest, handleGo2Fa: () => void) => Promise<AuthResult>;
    logOut: () => Promise<void>;
    getAccessToken: () => Promise<string | undefined>;
    getUserDetails: () => UserDetails | undefined;
    
    // Account management
    registerAccount: (data: SignupRequest) => Promise<boolean>;
    resendConfirmationCode: (token: string) => Promise<boolean>; // Called by logIn
    verifyConfirmationCode: (code: string) => Promise<boolean>;
    
    // Password management
    sendResetPasswordRequest: (data: ResetPasswordRequest) => Promise<boolean>;
    resetPassword: (data: ResetPasswordConfirmRequest) => Promise<boolean>;
    changePasswordLogged: (data: ChangePasswordRequest) => Promise<boolean>;
}

/**
 * Check if a JWT token is valid and not expired
 */
const isTokenValid = (token: string): boolean => {
    if (!token) return false;
    
    try {
        const decodedToken = jwtDecode<TokenPayload>(token);
        return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
}

/**
 * Authentication store using Zustand
 */
const useAuthStore = create<AuthStore>()((set, get) => {
    // Get UI-related functions from other stores
    const setSidebarPosition = usePageLayoutStore.getState().setSidebarPosition;

    return {
        // State initialization
        isLogged: isTokenValid(localStorage.getItem(REFRESH_TOKEN_KEY) || ""),
        isLoading: false,
        
        /**
         * Log in a user with credentials
         */
        logIn: async (credentials: LoginRequest, handleGo2Fa: () => void): Promise<AuthResult> => {

            set({ isLoading: true });
            toast.dismiss();

            try {
                const res = await axiosInstance.post(LOGIN_PATH, credentials);
                const res_payload: LoginSuccessResponse = res.data;
                            
                localStorage.setItem(ACCESS_TOKEN_KEY, res_payload.access);
                localStorage.setItem(REFRESH_TOKEN_KEY, res_payload.refresh);
                localStorage.setItem(USER_KEY, JSON.stringify(res_payload.user));

                set({ isLogged: true, isLoading: false });
                return "success";
                
            } catch (error: any) {
                set({ isLoading: false });
                if (credentials?.googlecode) return "otp_fail";

                const res_payload: LoginErrorResponse = error?.response?.data;
                if (res_payload) {

                    if (res_payload.token && res_payload.token?.length > 0) {
                        const token = res_payload.token[0];
                        const { resendConfirmationCode } = get();
                        const resend = await resendConfirmationCode(token);
                        if (!resend) return "error";
                        return "confirm_email";
                    }
                    
                    const err_msg = res_payload.type && res_payload.type?.length > 0 ? res_payload.type[0] : 
                        res_payload.message && res_payload.message?.length > 0 ? res_payload.message[0] : "error"

                    if (err_msg == "two_fa_failed") {
                        handleGo2Fa();
                        return "go2fa";
                    }
                    
                    if (!["go2fa", "otp_fail", "wrong_data", "reset_psw", "account_block", "invalid"].includes(err_msg)) return "error"
                    toast.error(i18n.t(err_msg));
                    return err_msg as AuthResult
                }
            }
            
            return "error";
        },
        
        /**
         * Log out the current user
         */
        logOut: async (): Promise<void> => {
            set({ isLoading: true });
            toast.dismiss();
            try {
                const res = await axiosInstance.post(LOGOUT_PATH);
                const res_payload: LogoutSuccessResponse = res.data;
                if ('detail' in res_payload) console.log("Logout Success")
            } catch (error: any) {
                const res_payload: LogoutErrorResponse = error?.response?.data;
                console.error("Logout Failed", res_payload?.detail);
            }
            
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);

            setSidebarPosition(false);            
            set({ isLogged: false, isLoading: false });
        },
        
        /**
         * Get a valid access token, refreshing if necessary
         */
        getAccessToken: async (): Promise<string | undefined> => {
            const { logOut } = get();
            const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
            const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (!access_token) return;
            
            // Check if auth token is valid
            try {
                const payload: TokenPayload = jwtDecode(access_token);
                const expTime = payload.exp * 1000;
                const curTime = new Date().getTime();
                const timeToExpire = expTime - curTime;
                
                // Token is still valid for more than 10 minutes
                if (timeToExpire > 600000) return access_token;

            } catch (error) {
                console.error("Access token invalid", error);
            }
            
            // Refresh auth token
            try {
                if (!refresh_token) throw Error("Refresh token not found")
                const res = await axiosInstance.post(REFRESH_PATH, { refresh: refresh_token } as RefreshRequest);
                const res_payload: RefreshSuccessResponse = res.data;

                localStorage.setItem(ACCESS_TOKEN_KEY, res_payload.access);
                localStorage.setItem(REFRESH_TOKEN_KEY, res_payload.refresh);
                return res_payload.access;
                
            } catch (error: any) {
                const res_payload: RefreshErrorResponse = error?.response?.data;
                console.error("Refresh Failed", res_payload?.detail);
                logOut();
                return;
            }
        },

        /**
         * Get user details from localStorage (synchronous)
         */
        getUserDetails: (): UserDetails | undefined => {
            const user_details = localStorage.getItem(USER_KEY);
            return user_details ? JSON.parse(user_details) : undefined;
        },
        
        /**
         * Register a new user account
         */
        registerAccount: async (data: SignupRequest): Promise<boolean> => {
            if (data.password1 !== data.password2) throw new Error('Passwords do not match');
            toast.dismiss();
            set({ isLoading: true });
            
            try {
                const res = await axiosInstance.post(SIGNUP_PATH, data);
                const res_payload: SignupSuccessResponse = res.data;
                if (!('detail' in res_payload)) throw Error("Invalid response format")
                toast.success(i18n.t('register_success'));
                set({ isLoading: false });
                return true;
            } catch (error: any) {
                const res_payload: SignupErrorResponse = error?.response?.data;
                if ('email' in res_payload) toast.error(i18n.t('bad_email'));
                if ('non_field_errors' in res_payload) toast.error(i18n.t('bad_data'));
                console.error("Registration failed", error);
                set({ isLoading: false });
                return false;
            }
        },
        
        /**
         * Resend email confirmation code
         */
        resendConfirmationCode: async (token: string): Promise<boolean> => {
            set({ isLoading: true });
            toast.dismiss();
            
            try {
                const res = await axiosInstance.post(RESEND_EMAIL_PATH, { token } as ResendEmailRequest);
                const res_payload: ResendEmailSuccessResponse = res.data;
                set({ isLoading: false });
                if (!res_payload.Status) throw Error("Resend email failed")
                toast.success(i18n.t('resent_code'));
                return true;
            } catch (error: any) {
                set({ isLoading: false });
                const res_payload: ResendEmailErrorResponse = error?.response?.data;
                const err_msg = res_payload.code || "error";
                console.error("Failed to resend confirmation code:", err_msg);
                return false;
            }
        },
        
        /**
         * Verify email confirmation code
         */
        verifyConfirmationCode: async (code: string): Promise<boolean> => { 
            set({ isLoading: true });
            toast.dismiss();
            
            try {
                // Call verify email API
                const response = await axiosInstance.post(CONFIRM_EMAIL_PATH, { key: code } as ConfirmEmailRequest);
                const res_payload: ConfirmEmailSuccessResponse = response.data;
                set({ isLoading: false });
                
                if (res_payload?.access_token && res_payload?.refresh_token && res_payload?.user) {
                    localStorage.setItem(ACCESS_TOKEN_KEY, res_payload.access_token);
                    localStorage.setItem(REFRESH_TOKEN_KEY, res_payload.refresh_token);
                    
                    set({ isLogged: true });
                    toast.success(i18n.t('email_confirmed_and_logged_in'));
                    return true;
                }
                toast.success(i18n.t('email_confirmed'));
                return true;
            } catch (error: any) {
                set({ isLoading: false });
                const res_payload: ConfirmEmailErrorResponse = error?.response?.data;
                console.error("Email verification failed:", res_payload?.detail);
                toast.error(i18n.t('error'));
                return false;
            }
        },
        
        /**
         * Send password reset request
         */
        sendResetPasswordRequest: async (data: ResetPasswordRequest): Promise<boolean> => {
            set({ isLoading: true });
            toast.dismiss();
            
            try {
                const res = await axiosInstance.post(RESET_PASSWORD_PATH, data);
                const res_payload: ResetPasswordSuccessResponse = res.data;
                if (!('detail' in res_payload)) throw Error("Password reset failed");
                set({ isLoading: false });
                toast.success(i18n.t('email_sent'));
                return true;
            } catch (error: any) {
                set({ isLoading: false });
                const res_payload: ResetPasswordErrorResponse = error?.response?.data;
                if ('email' in res_payload) toast.error(i18n.t('bad_email'));
                console.error("Failed to send reset password request:", res_payload?.email?.[0]);
                return false;
            }
        },
        
        /**
         * Reset password with token
         */
        resetPassword: async (data: ResetPasswordConfirmRequest): Promise<boolean> => {
            set({ isLoading: true });
            toast.dismiss();
            
            try {
                const res = await axiosInstance.post(RESET_PASSWORD_CONFIRM_PATH, data);
                const res_payload: ResetPasswordConfirmSuccessResponse = res.data;
                if (!('detail' in res_payload)) throw Error("Password reset failed");
                set({ isLoading: false });
                toast.success(i18n.t('password_reset_request_success'));
                return true;
            } catch (error: any) {
                set({ isLoading: false });
                const res_payload: ResetPasswordConfirmErrorResponse = error?.response?.data;
                if ('uid' in res_payload || 'token' in res_payload) toast.error(i18n.t('invalid_data'));
                toast.error(i18n.t('error'));
                console.error("Password reset failed");
                return false;
            }
        },
        
        /**
         * Change password while logged in
         */
        changePasswordLogged: async (data: ChangePasswordRequest): Promise<boolean> => {
            set({ isLoading: true });
            toast.dismiss();
            
            try {
                const res = await axiosInstance.post(CHANGE_PASSWORD_PATH, data);
                const res_payload: ChangePasswordSuccessResponse = res.data;
                if (!('detail' in res_payload)) throw Error("Password change failed");
                set({ isLoading: false });
                toast.success(i18n.t('password_reset_success'));
                return true;
            } catch (error: any) {
                const res_payload: ChangePasswordErrorResponse = error?.response?.data; 
                const err_msg = res_payload.code || "error";
                console.error("Password change failed:", error);
                set({ isLoading: false });
                toast.error(i18n.t(err_msg)); // TODO this could have a key that is not translated
                return false;
            }
        }
    }
})

export default useAuthStore
export { useAuthStore }
