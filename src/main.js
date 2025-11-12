import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import whiteLabel from './config/whiteLabel'

import ptBR from './locales/pt-BR.json'
import enUS from './locales/en-US.json'

const i18n = createI18n({
  legacy: false,
  locale: whiteLabel.i18n.defaultLocale,
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': ptBR,
    'en-US': enUS
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
