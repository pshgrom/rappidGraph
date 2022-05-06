import { createApp } from 'vue'
import App from './App.vue'
// @ts-ignore
import router from './router'
import store from './store'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'


createApp(App).use(router).use(store).use(Quasar).mount('#app')
