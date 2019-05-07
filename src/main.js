import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueHtml2Canvas from 'vue-html2canvas';
import babelPolyfill from 'babel-polyfill';
import {store} from './store/store';
//import VueAnalytics from 'vue-analytics'
Vue.use(VueHtml2Canvas);
Vue.use(babelPolyfill);
// Vue.use(VueAnalytics, {
//   id: 'UA-139626788-1',
//   checkDuplicatedScript: true
// });
Vue.config.productionTip = true

new Vue({
  el: '#app',
  store,
  render: h => h(App, {
    props:{},
  }),

})
