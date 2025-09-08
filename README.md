<div align="center">
  <img src="public/mommy.png" alt="Mommy React Logo" width="120" height="120">
</div>


# Mommy React

A modern, production-ready React template built with TypeScript, Vite, and a comprehensive component library. This template provides a complete foundation for building scalable web applications with best practices, internationalization, state management, and a beautiful UI system.

## 🚀 Features

- **Modern Stack**: React 19 + TypeScript + Vite for fast development
- **State Management**: Zustand for lightweight, scalable state management
- **Routing**: React Router DOM v7 with type-safe navigation
- **Internationalization**: React i18next for multi-language support
- **Data Fetching**: TanStack Query for server state management
- **UI Components**: Comprehensive component library with consistent design
- **Styling System**: CSS variables with light/dark theme support
- **Form Handling**: Advanced form components with validation
- **Icons**: React Icons + Phosphor Icons for extensive icon library
- **File Uploads**: UploadThing integration for file management
- **Charts**: Chart.js integration for data visualization
- **Development Tools**: ESLint, TypeScript, Hot Reload

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Base components (Button, Card, Table, etc.)
│   ├── forms/           # Form components (Input, Select, DatePicker, etc.)
│   └── general/         # General components (ThemeToggle, LanguageToggle)
├── pages/               # Page components
│   └── Home/           # Example showcase page
├── stores/              # Zustand state stores
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── locales/             # Internationalization files
├── api/                 # API configuration and utilities
├── routes/              # Route definitions
├── utils/               # Utility functions and constants
└── theme.css           # CSS variables and theme system
```

## 🎨 Component Architecture

### File Organization Rules
- **Pages**: `src/pages/PageName/PageName.tsx` + `src/pages/PageName/PageName.css`
- **Components**: `src/components/ComponentName/ComponentName.tsx` + `src/components/ComponentName/ComponentName.css`
- **Page-specific components**: `src/components/pagename/ComponentName/ComponentName.tsx`

### CSS Naming Convention
- **Unique class names**: Each CSS class must be unique across the entire project
- **Format**: `pagename_element` or `componentname_element`
- **Examples**: `home_banner`, `login_form`, `button_primary`

### Example: Home Page Structure

```tsx
// src/pages/Home/Home.tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Common Components
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import Input from '@/components/forms/Input/Input'

import './Home.css'

const Home = () => {
    const { t } = useTranslation('common')
    const [textInput, setTextInput] = useState('')
    
    return (
        <div className="home_container">
            <section className="home_header">
                <div className="home_header_content">
                    <h1 className="home_title">{t('home_hero_title')}</h1>
                    <p className="home_subtitle">{t('home_hero_subtitle')}</p>
                </div>
            </section>
            
            <section className="home_section">
                <Card className="home_showcase_card">
                    <div className="home_component_grid">
                        <div className="home_component_group">
                            <h4>{t('home_button_variants')}</h4>
                            <div className="home_button_group">
                                <Button variant="primary">{t('primary')}</Button>
                                <Button variant="secondary">{t('secondary')}</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    )
}

export default Home
```

## 🎯 Component Library

### Common Components
- **Button**: Multiple variants (primary, secondary, danger, success)
- **Card**: Container component with consistent styling
- **Table**: Full-featured data table with sorting and pagination
- **Spinner**: Loading indicators in multiple sizes
- **UserAvatar**: User profile display component
- **Paginator**: Navigation component for paginated data

### Form Components
- **Input**: Text inputs with floating labels and validation
- **Select**: Dropdown selection with search capabilities
- **DatePicker**: Calendar-based date selection
- **DateTimePicker**: Combined date and time selection
- **FileUpload**: Drag-and-drop file upload component
- **PasswordEyeInput**: Password input with visibility toggle

### General Components
- **ThemeToggle**: Light/dark mode switcher
- **LanguageToggle**: Multi-language selector
- **Navbar**: Navigation bar with responsive design
- **Footer**: Site footer with social links

## 🎨 Styling System

### CSS Variables Theme
```css
/* Primary Colors */
--main-primary: #e73c7e
--main-secondary: #23a6d5

/* Text Colors */
--text-primary: #2a3f5a
--text-secondary: #6b7280
--text-inverse: #ffffff

/* Background Colors */
--background-primary: #ffffff
--background-secondary: #f8fafc

/* Spacing */
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
```

### Component Styling Example
```css
/* src/pages/Home/Home.css */
.home_container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.home_header {
    text-align: center;
    padding: 2rem 0;
    background: linear-gradient(135deg, var(--main-primary), var(--main-secondary));
    border-radius: 16px;
    color: var(--text-inverse);
}

.home_component_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mommy-react
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Internationalization

The template includes full i18n support with React i18next:

```tsx
// Using translations in components
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
    const { t } = useTranslation('common')
    
    return (
        <div>
            <h1>{t('welcome_message')}</h1>
            <p>{t('description')}</p>
        </div>
    )
}
```

Translation files are located in `src/locales/` with support for multiple languages.

## 🔧 State Management

Using Zustand for lightweight state management:

```tsx
// src/stores/AuthStore.tsx
import { create } from 'zustand'

interface AuthState {
    isLogged: boolean
    user: UserDetails | null
    login: (user: UserDetails) => void
    logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
    isLogged: false,
    user: null,
    login: (user) => set({ isLogged: true, user }),
    logout: () => set({ isLogged: false, user: null })
}))

export default useAuthStore
```

## 📱 Responsive Design

The template includes responsive design patterns:

- **Mobile-first approach** with progressive enhancement
- **Flexible grid systems** using CSS Grid and Flexbox
- **Responsive typography** with CSS clamp() functions
- **Touch-friendly interactions** for mobile devices

## 🎨 Theme System

Built-in light/dark theme support:

```tsx
// Theme toggle component
import useThemeStore from '@/stores/ThemeStore'

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore()
    
    return (
        <Button onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
        </Button>
    )
}
```

## 🔍 Development Guidelines

### Code Style
- **4 spaces indentation** - Always use 4 spaces, never tabs
- **Consistent naming** - Use PascalCase for components, camelCase for variables
- **Unique CSS classes** - Each class name must be unique across the project
- **Component co-location** - Keep component files with their CSS files

### Best Practices
- Use existing components from `src/components/common/` when possible
- Follow the established file structure and naming conventions
- Implement proper TypeScript types for all props and state
- Use CSS variables for colors and spacing
- Include proper internationalization for all user-facing text

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Router](https://reactrouter.com/)
- [React i18next](https://react.i18next.com/)

## 🤝 Contributing

1. Follow the established code style and architecture
2. Ensure all components have proper TypeScript types
3. Add CSS classes following the naming convention
4. Include internationalization for new text content
5. Test components across different screen sizes
6. Update documentation for new features

This template provides a solid foundation for building modern React applications with TypeScript, following industry best practices and maintaining code quality standards.
