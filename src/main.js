import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'materialize-css/dist/css/materialize.css'
import 'materialize-css/dist/js/materialize.js'
import M from 'materialize-css'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'



Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = process.env.VUE_APP_HOST

Vue.use(VueSweetalert2)

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: function() {
    M.AutoInit();
  }
}).$mount('#app')
