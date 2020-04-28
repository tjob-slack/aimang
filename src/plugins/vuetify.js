// src/plugins/vuetify.js

import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
//如果使用了 vuetify-loader，修改import 'vuetify/dist/vuetify.min.css'为此
//import Vuetify from 'vuetify/lib'   

Vue.use(Vuetify)

const opts = {}

export default new Vuetify(opts)