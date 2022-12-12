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
import * as Echarts from 'echarts'
// axios.defaults.withCredentials=true;
import { createStore } from 'vuex'
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers!.token = localStorage.getItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
const app = createApp(App)
app.use(store)
app.config.globalProperties.$echarts = Echarts
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
