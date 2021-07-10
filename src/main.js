import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;
import "../public/css/materialdesignicons.min.css";
import 'swiper/swiper-bundle.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from "./services/store";
import moment from 'moment';
import {
  BootstrapVue,
  BootstrapVueIcons
} from 'bootstrap-vue'
var VueScrollTo = require('vue-scrollto');
import Scrollspy from 'vue2-scrollspy';
import VueYoutube from 'vue-youtube'
import vueVimeoPlayer from 'vue-vimeo-player'
import VueMasonry from 'vue-masonry-css'
import Notifications from 'vue-notification';
import VueQuillEditor from 'vue-quill-editor'
import ApiService from "./services/api.service";
import ApiPublicService from "./services/api-public.service";
import VueSignaturePad from 'vue-signature-pad';
import axios from "axios";
import VueAxios from "vue-axios";
import VueSweetalert2 from 'vue-sweetalert2';
import OtpInput from "@bachdgvn/vue-otp-input";
import {
  VERIFY_AUTH
} from "./services/store/auth.module";
import Vuelidate from 'vuelidate';
import VueTippy, { TippyComponent } from "vue-tippy";
import i18n from './i18n'
import VueUppercase from './utility/vue-uppercase'
import VueLowercase from './utility/vue-lowercase'
import VueHead from 'vue-head'


// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import VueMobileDetection from "vue-mobile-detection";
Vue.use(VueMobileDetection);
Vue.use(BootstrapVueIcons)
Vue.component("v-otp-input", OtpInput);
Vue.use(VueSweetalert2);
Vue.use(VueAxios, axios)
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(Vuelidate)

Vue.use(VueScrollTo, {
  duration: 3000,
  easing: "ease"
})

Vue.use(BootstrapVue)
Vue.use(Scrollspy);
Vue.use(VueYoutube)
Vue.use(vueVimeoPlayer)
Vue.use(VueMasonry)
Vue.use(Notifications)
ApiService.init();
ApiPublicService.init();
Vue.use(VueSignaturePad);
Vue.use(VueTippy);

Vue.filter('formatDateTime', function (value) {
  if (value) {
    return moment(String(value)).format('D MMM YY, H:mm')
  }
});

const DebugPrint = {
  install(Vue, options) {
    Vue.prototype.debugPrint = (...content) => {
      if (process.env.VUE_APP_ENVI != 'production')
        console.log(process.env.VUE_APP_ENVI + " debug:", ...content)
    }
  },
}
Vue.use(DebugPrint)

Vue.directive('v-uppercase', VueUppercase)
Vue.directive('v-uppercase', VueUppercase)

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth == true) {
    if (!store.getters.isAuthenticated) {
      next('/');
    } else {
      Promise.all([store.dispatch(VERIFY_AUTH)]).then(next);
      next();
    }
  } else {
    next();
  }
});

Vue.use(VueHead)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')