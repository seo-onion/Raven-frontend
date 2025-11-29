const routes = {
    main: "/",
    home: "/home",

    // Auth
    login: "/login",
    startupLogin: "/startup-login",
    incubatorLogin: "/incubator-login",
    register: "/register",
    verifyEmail: "/verify-email",
    forgotPassword: "/forgot-password",
    changePassword: "/change-password",

    // Onboarding
    onboarding: "/onboarding",
    onboardingWizard: "/onboarding/wizard",

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

    // Main
    profile: "/profile",
    notFound: "*",
};

export default routes;