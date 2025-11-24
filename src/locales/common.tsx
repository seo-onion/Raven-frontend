const common = {
    es: {
        // General
        backToHome: "Volver a Inicio",
        days: "Días",
        country: "Pais",
        configuration: "Configuración",
        security: "Seguridad",
        description: "Descripcion",
        section: "Sección",
        start: "Comenzar",
        view: "Ver",
        share: "Compartir",
        loading: "Cargando...",

        // Auth
        login: "Iniciar Sesión",
        logout: "Cerrar Sesión",
        signup: "Registrarse",
        profile: "Perfil",
        role: "Rol",
        account_settings: "Configuración de Cuenta",
        personal_information: "Información Personal",
        invalid_email: "Correo electrónico inválido",
        bad_email: "Correo electrónico inválido",
        go2fa: "Continuar a Autenticación de dos pasos",
        otp_fail: "OTP fallido",
        reset_psw: "Restablecer contraseña",
        account_block: "Cuenta bloqueada",
        invalid_data: "Datos inválidos",
        confirm_email: "Confirmar correo electrónico",
        register_success: "Registro exitoso",
        resent_code: "Código reenviado",
        email_confirmed: "Correo electrónico confirmado",
        login_confirm_email: "Por favor confirma tu correo electrónico",
        password_reset_request_success: "Solicitud de restablecimiento de contraseña enviada",
        password_reset_success: "Contraseña restablecida exitosamente",
        missing_fields: "Por favor completa todos los campos",
        passwords_do_not_match: "Las contraseñas no coinciden",
        change_password: "Cambiar contraseña",
    
        // Forms
        add: "Agregar",
        cancel: "Cancelar",
        save: "Guardar",
        edit: "Editar",
        change: "Cambiar",
        setup: "Configurar",
        delete: "Eliminar",
        noResults: "Sin resultados",
        required: "Requerido",
        optional: "Opcional",
        submit: "Enviar",

        // Navigation
        back: "Volver",
        next: "Siguiente",
        previous: "Anterior",
        search: "Buscar",
        filter: "Filtrar",
        view_all: "Ver Todos",
        current_page: "Página actual",
        total_pages: "Total de páginas",

        // Statuses
        error: "Error",
        success: "Éxito",
        approved: "Aprobado",
        rejected: "Rechazado",
        pending: "Pendiente",
        active: "Activo",
        completed: "Completado",
        inReview: "En revisión",
        processing: "Procesando",

        // Social
        website: "Sitio Web",
        twitter: "Twitter",
        linkedin: "LinkedIn",
        
        // Languages
        english: "Inglés",
        spanish: "Español",
        english_short: "EN",
        spanish_short: "ES",
        
        // Toast error keys
        invalid: "Invalido",
        wrong_data: "Datos incorrectos",
        email_sent: "Correo enviado",

        // Form Fields
        select_label: "Selección",
        select_placeholder: "Selecciona una opción",
        date_label: "Fecha",
        date_placeholder: "Selecciona una fecha",
        datetime_label: "Fecha y hora",
        datetime_placeholder: "Selecciona una fecha y hora",
        text_label: "Texto",
        text_placeholder: "Ingrese un texto",
        file_label: "Archivo",
        file_placeholder: "Selecciona un archivo",
        username_label: "Nombre de usuario",
        username_placeholder: "Ingrese su nombre de usuario",
        email_label: "Correo electrónico",
        email_placeholder: "Ingrese su correo electrónico",
        name_label: "Nombre",
        name_placeholder: "Ingrese su nombre",
        first_name_label: "Nombre",
        first_name_placeholder: "Ingrese su nombre",
        last_name_label: "Apellido",
        last_name_placeholder: "Ingrese su apellido",
        old_password_label: "Contraseña actual",
        old_password_placeholder: "Ingrese su contraseña actual",
        password_label: "Contraseña",
        password_placeholder: "Ingrese su contraseña",
        password1_label: "Nueva contraseña",
        password1_placeholder: "Ingrese su nueva contraseña",
        password2_label: "Confirmar contraseña",
        password2_placeholder: "Confirme su nueva contraseña",

        // Color variants
        primary: "Primario",
        secondary: "Secundario",
        danger: "Peligro",
        warning: "Advertencia",
        info: "Información",

        // Sizes
        small: "Pequeño",
        medium: "Mediano",
        large: "Grande",
        extra_large: "Extra Grande",
        
        /**
         * PAGES
         */
        
        // Home Page
        home_hero_title: "Componentes disponibles",
        home_hero_subtitle: "Explora todos los componentes disponibles en esta plantilla de react",
        home_button_components: "Botones",
        home_button_variants: "Variantes de Botones",
        home_button_sizes: "Tamaños de Botones",
        home_form_components: "Formularios",
        home_data_components: "Datos y Carga",
        home_user_avatar: "Avatar de usuario",
        home_spinner: "Spinner",
        home_toggle_loading: "Activar Carga",
        home_table_components: "Tablas",
        home_paginator_components: "Paginadores",
        
        // Login Page
        login_welcome: "Bienvenido",
        login_back_to_profile_button: "Volver al perfil",
        login_back_to_login_button: "Volver a inicio de sesión",
        login_with_google: "Continuar con Google",
        login_forgot_password_title: "Reestablecer contraseña",
        login_new_user: "¿No tienes una cuenta?",
        login_old_user: "¿Ya tienes una cuenta?",
        login_forgot_password: "¿Olvidaste tu contraseña?",
        login_reset_password: "Enivar solicitud",

        // Raven CRM Login
        raven_crm_title: "Raven CRM",
        raven_crm_subtitle: "Plataforma de Gestión de Incubación y Escalamiento Comercial",
        im_a_startup: "Soy una Startup",
        im_an_incubator: "Soy una Incubadora",
        startup_description: "Gestiona tu proceso de incubación y escalamiento con herramientas especializadas.",
        incubator_description: "Supervisa y acompaña tu portafolio de startups con análisis consolidados.",
        login_as_startup: "Ingresar como Startup",
        login_as_incubator: "Ingresar como Incubadora",
        no_account: "¿No tienes cuenta?",
        register_here: "Regístrate aquí",
        back_to_type_selection: "Volver a selección de tipo",
        demo_note: "Demo: usa cualquier email y contraseña",

        login_verify_email: "Verificar correo electrónico",
        login_verify_email_message: "Hemos enviado un link de confirmación a: {{email}}. Por favor ingrese a ese link para confirmar su correo electrónico.",
        login_verify_email_loading: "Verificando su cuenta...",
        login_verify_email_success: "Cuenta verificada exitosamente",
        login_verify_email_invalid: "El link de verificación es inválido o ha expirado",
        login_verify_email_sent: "Correo de verificación enviado",
        login_verify_resend_email: "Reenviar correo",
        
        // Profile Page
        profile_change_password: "Cambiar Contraseña",
        profile_change_password_description: "Actualizar la contrseña de su cuenta",
        profile_two_factor_authentication: "Autenticación en dos pasos",
        profile_two_factor_authentication_description: "Añade una capa adicional de seguridad",
        
        // NotFound Page
        notFound_title: "Página No Encontrada",
        notFound_message: "La página que estás buscando no existe o ha sido eliminada.",

        // Signup Page
        signup_success: "Registro exitoso",
        signup_error: "Ocurrió un error durante el registro",
        create_your_account: "Crea tu cuenta",
        select_account_type: "Selecciona el tipo de cuenta",
        startup: "Startup",
        incubator: "Incubadora",
        back_to_login: "Volver al inicio de sesión",

        // Email Verification
        verify_your_email: "Verifica tu correo electrónico",
        email_verification: "Verificación de Email",
        verify_email_description: "Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.",
        verification_code_label: "Código de Verificación",
        verify_email_button: "Verificar Email",
        verify_code_6_digits: "Por favor ingresa un código de 6 dígitos",
        verify_code_numbers_only: "El código debe contener solo números",
        email_verified_success: "Email verificado exitosamente",
        verification_failed: "Verificación fallida",
        verification_email_resent: "Email de verificación reenviado",
        sending: "Enviando...",
        resend_verification_code: "Reenviar código de verificación",

        

        /**
         * COMPONENTS
         */

        // Navigation
        nav_home: "Inicio",
        nav_profile: "Perfil",
        nav_login: "Iniciar Sesión",

        // Footer
        footer_tagline: "Financiando la innovación con tecnología blockchain",
        footer_navigation: "Navegación",
        footer_community: "Comunidad",
        footer_rights: "Todos los derechos reservados",
        footer_made_with: "Hecho con",
        footer_in: "en",
        footer_location: "Lima, Perú",

        // Auth Required
        auth_required: "Autenticación Requerida",
        auth_required_message: "Necesitas iniciar sesión para continuar.",        

        // Language Toggle
        language_toggle: "Cambiar idioma",
        language_toggle_aria: "Botón para cambiar entre inglés y español",
        
        // File Upload
        clickToUpload: "Haz clic para subir archivo",
        dragAndDrop: "o arrastra y suelta aquí",
        supportedFormats: "Formatos soportados",
        maxSize: "Tamaño máximo",
        removeFile: "Eliminar archivo",

    },
    en: {
        // General
        backToHome: "Back to Home",
        days: "Days",
        country: "Country",
        configuration: "Configuration",
        security: "Security",
        description: "Description",
        section: "Section",
        start: "Start",
        view: "View",
        share: "Share",
        loading: "Loading...",

        // Auth
        login: "Log In",
        logout: "Log Out",
        signup: "Sign Up",
        profile: "Profile",
        role: "Role",
        account_settings: "Account Settings",
        personal_information: "Personal Information",
        invalid_email: "Invalid email",
        bad_email: "Invalid email",
        go2fa: "Continue to Two-Factor Authentication",
        otp_fail: "OTP failed",
        reset_psw: "Reset password",
        account_block: "Account blocked",
        invalid_data: "Invalid data",
        confirm_email: "Confirm email",
        register_success: "Registration successful",
        resent_code: "Code resent",
        email_confirmed: "Email confirmed",
        login_confirm_email: "Please confirm your email",
        password_reset_request_success: "Password reset request sent",
        password_reset_success: "Password reset successfully",
        missing_fields: "Please complete all fields",
        passwords_do_not_match: "Passwords do not match",
        change_password: "Change password",
    
        // Forms
        add: "Add",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        change: "Change",
        setup: "Setup",
        delete: "Delete",
        noResults: "No results",
        required: "Required",
        optional: "Optional",
        submit: "Submit",

        // Navigation
        back: "Back",
        next: "Next",
        previous: "Previous",
        search: "Search",
        filter: "Filter",
        view_all: "View All",
        current_page: "Current Page",
        total_pages: "Total Pages",

        // Statuses
        error: "Error",
        success: "Success",
        approved: "Approved",
        rejected: "Rejected",
        pending: "Pending",
        active: "Active",
        completed: "Completed",
        inReview: "Under review",
        processing: "Processing",

        // Social
        website: "Website",
        twitter: "Twitter",
        linkedin: "LinkedIn",
        
        // Languages
        english: "English",
        spanish: "Spanish",
        english_short: "EN",
        spanish_short: "ES",
        
        // Toast error keys
        invalid: "Invalid",
        wrong_data: "Wrong data",
        email_sent: "Email sent",

        // Form Fields
        select_label: "Select",
        select_placeholder: "Select an option",
        date_label: "Date",
        date_placeholder: "Select a date",
        datetime_label: "Date and time",
        datetime_placeholder: "Select a date and time",
        text_label: "Text",
        text_placeholder: "Enter text",
        file_label: "File",
        file_placeholder: "Select a file",
        username_label: "Username",
        username_placeholder: "Enter your username",
        email_label: "Email",
        email_placeholder: "Enter your email",
        name_label: "Name",
        name_placeholder: "Enter your name",
        first_name_label: "First Name",
        first_name_placeholder: "Enter your first name",
        last_name_label: "Last Name",
        last_name_placeholder: "Enter your last name",
        old_password_label: "Current password",
        old_password_placeholder: "Enter your current password",
        password_label: "Password",
        password_placeholder: "Enter your password",
        password1_label: "New password",
        password1_placeholder: "Enter your new password",
        password2_label: "Confirm password",
        password2_placeholder: "Confirm your new password",

        // Color variants
        primary: "Primary",
        secondary: "Secondary",
        danger: "Danger",
        warning: "Warning",
        info: "Info",

        // Sizes
        small: "Small",
        medium: "Medium",
        large: "Large",
        extra_large: "Extra Large",
        
        /**
         * PAGES
         */
        
        // Home Page
        home_hero_title: "Component Showcase",
        home_hero_subtitle: "Explore all available components in this React template",
        home_button_components: "Button Components",
        home_button_variants: "Button Variants",
        home_button_sizes: "Button Sizes",
        home_form_components: "Form Components",
        home_data_components: "Data Display Components",
        home_user_avatar: "User Avatar",
        home_spinner: "Spinner",
        home_toggle_loading: "Toggle Loading",
        home_table_components: "Table Components",
        home_paginator_components: "Paginator Components",
        
        // Login Page
        login_welcome: "Welcome to KuskaPay",
        login_back_to_profile_button: "Back to profile",
        login_back_to_login_button: "Back to login",
        login_with_google: "Continue with Google",
        login_forgot_password_title: "Reset password",
        login_new_user: "Don't have an account?",
        login_old_user: "Already have an account?",
        login_forgot_password: "Forgot your password?",
        login_reset_password: "Send request",

        // Raven CRM Login
        raven_crm_title: "Raven CRM",
        raven_crm_subtitle: "Incubation and Commercial Scaling Management Platform",
        im_a_startup: "I'm a Startup",
        im_an_incubator: "I'm an Incubator",
        startup_description: "Manage your incubation and scaling process with specialized tools.",
        incubator_description: "Monitor and support your startup portfolio with consolidated analytics.",
        login_as_startup: "Login as Startup",
        login_as_incubator: "Login as Incubator",
        no_account: "Don't have an account?",
        register_here: "Register here",
        back_to_type_selection: "Back to type selection",
        demo_note: "Demo: use any email and password",

        login_verify_email: "Verify email",
        login_verify_email_message: "We have sent a confirmation link to: {{email}}. Please click on that link to confirm your email.",
        login_verify_email_loading: "Verifying your account...",
        login_verify_email_success: "Account verified successfully",
        login_verify_email_invalid: "The verification link is invalid or has expired",
        login_verify_email_sent: "Verification email sent",
        login_verify_resend_email: "Resend email",
        
        // Profile Page
        profile_change_password: "Change Password",
        profile_change_password_description: "Update your account password",
        profile_two_factor_authentication: "Two-Factor Authentication",
        profile_two_factor_authentication_description: "Add an additional layer of security",
        
        // NotFound Page
        notFound_title: "Page Not Found",
        notFound_message: "The page you are looking for does not exist or has been removed.",

        // Signup Page
        signup_success: "Registration successful",
        signup_error: "An error occurred during registration",
        create_your_account: "Create your account",
        select_account_type: "Select account type",
        startup: "Startup",
        incubator: "Incubator",
        back_to_login: "Back to login",

        // Email Verification
        verify_your_email: "Verify your email",
        email_verification: "Email Verification",
        verify_email_description: "Enter the 6-digit code we sent to your email address.",
        verification_code_label: "Verification Code",
        verify_email_button: "Verify Email",
        verify_code_6_digits: "Please enter a 6-digit code",
        verify_code_numbers_only: "Code must contain only numbers",
        email_verified_success: "Email verified successfully",
        verification_failed: "Verification failed",
        verification_email_resent: "Verification email resent",
        sending: "Sending...",
        resend_verification_code: "Resend verification code",



        /**
         * COMPONENTS
         */

        // Navigation
        nav_home: "Home",
        nav_profile: "Profile",
        nav_login: "Log In",

        // Footer
        footer_tagline: "Financing innovation with blockchain technology",
        footer_navigation: "Navigation",
        footer_community: "Community",
        footer_rights: "All rights reserved",
        footer_made_with: "Made with",
        footer_in: "in",
        footer_location: "Lima, Peru",

        // Auth Required
        auth_required: "Authentication Required",
        auth_required_message: "You need to log in to continue.",        

        // Language Toggle
        language_toggle: "Change language",
        language_toggle_aria: "Button to switch between English and Spanish",

        // File Upload
        clickToUpload: "Click to upload file",
        dragAndDrop: "or drag and drop here",
        supportedFormats: "Supported formats",
        maxSize: "Maximum size",
        removeFile: "Remove file",
        
    }
}

export default common