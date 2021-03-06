// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import './../static/font-icon/style.css'
import Msg from 'vue-message'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import './../babel-polyfill'
// import scrollbar from 'malihu-custom-scrollbar-plugin'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.min.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.min.js'
import './assets/icon/iconfont.css'
Vue.use(Msg, {text: 'Hello world', duration: 3000, background: 'rgba(7,17,27,0.6)'})

Vue.use(VueAwesomeSwiper)
Vue.use(ElementUI)

Vue.use(VueLazyload, {
  loading: '',
  error: ''
})

Vue.config.productionTip = false

/* eslint-disable no-new */
const vueExp = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  render: h => h(App)
})

export default vueExp
