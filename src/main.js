import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import 'bootstrap';

import VueSocketIOExt from 'vue-socket.io-extended'
import { io } from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.css'

const socket = io(process.env.VUE_APP_HOST)

createApp(App)
    .use(VueSocketIOExt, socket)
    .mount('#app')
