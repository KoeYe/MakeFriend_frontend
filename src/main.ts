import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@arco-design/web-vue/dist/arco.css';
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueSocketIO from 'vue-socket.io'
import './assets/main.css'
import axios from 'axios';
import ArcoVue from '@arco-design/web-vue';
import naive from 'naive-ui'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// axios.defaults.withCredentials=true;

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ArcoVueIcon);
app.use(naive)
app.use(ArcoVue);
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// app.config.globalProperties.$socket = socket;
