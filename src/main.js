import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";
import router from "@/router/index.js";
import i18n from "@/locales/i18n.js";
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './NProgress.css'
import components from '@/components/UI/index.js'
import 'v-calendar/style.css';
import {DatePicker, Calendar} from 'v-calendar'
import VueTheMask from 'vue-the-mask'
import { vMaska } from "maska/vue"

const app = createApp(App)

const options = {
    position: 'top-center',
    timeout: 2000
}

components.forEach(component => {
    app.component(component.name, component.component)
})

app
    .directive("maska", vMaska)
    .component('VDatePicker', DatePicker)
    .component('VCalendar', Calendar)
    .use(router)
    .use(VueTheMask)
    .use(createPinia())
    .use(i18n)
    .use(Toast, options)
    .mount('#app')
