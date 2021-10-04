import Vue from 'vue';
import App from './App.vue';
import VueKonva from "vue-konva";

Vue.use(VueKonva);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
