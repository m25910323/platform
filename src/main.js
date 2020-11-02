import Vue from 'vue'
import './assets/css/reset.css'
import './assets/css/index.css'
import ElementUI from 'element-ui';
import xlsx from 'xlsx'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts 
import axios from 'axios'
import qs from 'qs'
import { post,post1, get,get1, upload } from "./utils/http";
// import charts from 'echarts'
// Vue.prototype.$echarts = charts
import {formatTimeToStr} from './utils/date.js'
Vue.prototype.formatTimeToStr = formatTimeToStr;
Vue.prototype.axios = axios;
Vue.prototype.post = post;
Vue.prototype.$post = post1;
Vue.prototype.get = get;
Vue.prototype.$get = get1;
Vue.prototype.upload = upload;
Vue.prototype.qs = qs;
Vue.prototype.xlsx = xlsx;
import regExpUtil from './utils/regExp.js'
Vue.prototype.regExpUtil = regExpUtil;
import rules from "./utils/formValidator.js";
Vue.prototype.$rules = rules;
Vue.config.productionTip = false
Vue.use(ElementUI);


import Vue2OrgTree from 'vue2-org-tree';
Vue.use(Vue2OrgTree);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
