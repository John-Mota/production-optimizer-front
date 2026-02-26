import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ptBR from './locales/pt-BR.json'

const i18n = createI18n({
  legacy: false, // Set to false to use Composition API
  locale: 'pt-BR', // Default locale
  fallbackLocale: 'en',
  messages: {
    en,
    'pt-BR': ptBR
  }
})

export default i18n
