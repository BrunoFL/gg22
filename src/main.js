import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import BootstrapVue3 from 'bootstrap-vue-3'

import VueSocketIOExt from 'vue-socket.io-extended'
import {io} from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const socket = io(process.env.VUE_APP_HOST)

createApp(App)
    .use(BootstrapVue3)
    .use(VueSocketIOExt, socket)
    .mount('#app')
