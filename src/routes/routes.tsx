const routes = {
    main: "/",
    home: "/home",

    // Auth
    login: "/login",
    register: "/register",
    preRegister: "/pre-register",
    verifyEmail: "/verify-email",
    forgotPassword: "/forgot-password",
    changePassword: "/change-password",

    // Onboarding
    onboarding: "/onboarding",
    onboardingWizard: "/onboarding/wizard",
    incubatorOnboardingWizard: "/incubator/onboarding/wizard",

    // Dashboard - Unified for both startup and incubator
    dashboard: "/dashboard",
    dashboardOverview: "/dashboard/overview",
    dashboardPipeline: "/dashboard/pipeline",
    dashboardTRLCRL: "/dashboard/trl-crl",
    dashboardFinanzas: "/dashboard/finanzas",
    dashboardInversores: "/dashboard/inversores",
    dashboardDesafios: "/dashboard/desafios",
    dashboardMentoring: "/dashboard/mentoring",
    dashboardMiProgreso: "/dashboard/mi-progreso",
    dashboardMetrics: "/dashboard/metrics",

    // Main
    profile: "/profile",
    notFound: "*",
};

export default routes;