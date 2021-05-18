import Vue from 'vue';
import App from './App.vue';
import store from '@/store/index';
import localizePlugin from '@/utils/localizePlugin';
import '@/index.css';

Vue.use(localizePlugin);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
