import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueHtml2Canvas from 'vue-html2canvas';
import babelPolyfill from 'babel-polyfill';
import {store} from './store/store';
Vue.use(VueHtml2Canvas);
Vue.use(babelPolyfill);

Vue.config.productionTip = true

new Vue({
  el: '#app',
  store,
  data(){
    return{
      supertof: null
    }
  },
  beforeMount(){
    this.supertof = this.$el.attributes['source'].value;
  },
  //components:{App},
//  template: '<App :source="supertof"/>',
  render: h => h(App, {
    props:{},
  }),

})
