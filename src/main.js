import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import * as VeeValidate from 'vee-validate'

import BootstrapVue from 'bootstrap-vue'

import globals from './globals'
import Popper from 'popper.js'

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VeeValidate)
Vue.use(require('vue-moment'))

// Global RTL flag
Vue.mixin({
  data: globals
})

new Vue({
  router,
  render: h => h(App),
  mounted () {
    axios.defaults.baseURL = `https://backend-atende-facil.azurewebsites.net/api/`
    axios.interceptors.request.use(config => {
      const token = localStorage.getItem('access-token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }, error => Promise.reject(error))
  }
}).$mount('#app')
