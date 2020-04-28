import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

//2020-4-11
import vuetify from '@/plugins/vuetify' // path to vuetify export
//import vuetify from 'vuetify'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import request from '@/utils/request'

import '@/icons' // icon
import '@/permission' // permission control


// set ElementUI lang to EN
Vue.use(ElementUI, { locale })   //2020-4-15 formCreate替换


Vue.prototype.req = request

Vue.config.productionTip = false

//2020-4-15 动态表单 form-create
import formCreate from '@form-create/element-ui';
import { maker } from '@form-create/element-ui'
Vue.use(formCreate)

//2020-4-15 动态表单vue-form-maker
import VueFormMaker from 'vue-form-maker'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
// 如需使用城市数据 可以这样引用
// 省 市 县
import 'vue-form-maker/dist/cityData3Level'
// 省 市
import 'vue-form-maker/dist/cityData2Level'
// 城市数据文件定义了一个全局变量cityData 在项目里直接使用cityData即可
Vue.use(ViewUI)
Vue.use(VueFormMaker)

//2020-4-16  基于Vue的markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)


//2020-4-16 小程序解析markdown 
//Vue.prototype.towxml = require('./plugins/towxml/index.js')
//import towxml from 'towxml';
//import {towxml} from 'towxml';
//Vue.use(towxml)
//console.log('main.towxml:',towxml)

//2020-4-11 
/**
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
 */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,  //2020-4-11
  render: h => h(App)
  
}).$mount('#app')