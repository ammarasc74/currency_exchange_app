import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    ar,
  },
  supportedLngs: ['ar'],
  lng: 'ar',
})

export default i18n
