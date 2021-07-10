import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import loader from "./loader.module";
import trust from "./trust.module";
import amanahPusaka from "./amanah-pusaka.module";
import wasiat from "./wasiat.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    loader,
    trust,
    amanahPusaka,
    wasiat,
  }
});
