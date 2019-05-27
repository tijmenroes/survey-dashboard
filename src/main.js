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
      source: null
    }
  },
  beforeMount(){
    this.source = this.$el.attributes['source'].value;
  },
  components:{App},
  template: '<App :source="source"/>',
  // render: h => h(App, {
  //   props:{},
  // }), //Render normally

})
