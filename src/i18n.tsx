import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import common from './locales/common'

i18n
    .use(initReactI18next)
    .init({
        resources: {
            es: {
                common: common.es,
            },
            en: {
                common: common.en,
            },
        },
        lng: localStorage.getItem("language") || "es",
        fallbackLng: "es",
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
  })

// Add language change listener to refresh project data
i18n.on('languageChanged', () => {
    // We can't directly access the store here as this is outside React
    // The components will handle refreshing their data on language change
    localStorage.setItem("language", i18n.language)
})

export default i18n
