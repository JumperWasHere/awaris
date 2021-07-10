import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/services/jwt.service";
import store from "./store";
import { LOADING } from "@/services/store/loader.module";

/**
 * Service to call HTTP request via Axios
 */

const ApiPublicService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL;
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    var localization = window.localStorage.getItem("LOCALIZATION") ?? 'ms';
    Vue.axios.defaults.headers.common["Authorization"] = `Bearer ${JwtService.getPublicToken()}`;
    Vue.axios.defaults.headers.common["Accept"] = "application/json";
    Vue.axios.defaults.headers.common["Type"] = "api-public";
    Vue.axios.defaults.headers.common['X-localization'] = localization;
  },

  query(resource, params) {
    this.setHeader();
    return Vue.axios.get(resource, params).catch(error => {
      // console.log(error);
      throw new Error(`[KT] ApiPublicService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, slug = "") {
    this.setHeader();
    store.dispatch(LOADING, true);
    return Vue.axios.get(`${resource}`).then((response) => {
      store.dispatch(LOADING, false);
      return Promise.resolve(response)
    }).catch(error => {
      if (error.response.data.errors) {
        var errors = error.response.data.errors
        if (Object.values(errors).length > 0) {
          var errorMessage = Object.values(errors)[0][0]
        } else {
          var errorMessage = error.response.message;
        }

        Vue.notify({
          group: 'full-noti',
          title: 'Ralat',
          text: errorMessage,
          type: 'warn'
        });
      }
      store.dispatch(LOADING, false);
      return Promise.reject(error.response);
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    this.setHeader();
    // return new Promise((resolve, reject) => {
    //   return Vue.axios.post(`${resource}`, params).catch((error) => {
    //     console.log('api.service', error.response);
    //     var errors = error.response.data.errors
    //     console.log("AD", error.response.status)
    //     if (errors === undefined) {
    //       var errorMessage = error.response.data.message;
    //     } else {
    //       var errorMessage = Object.values(errors)[0][0]
    //     }
    //     Vue.notify({
    //       group: 'full-noti',
    //       title: 'Ralat',
    //       text: errorMessage,
    //       type: error.response.status == 401 ? 'error' : 'warn'
    //     });
    //     return reject(error.response);
    //   });
    // })
    store.dispatch(LOADING, true);
    return Vue.axios.post(`${resource}`, params).then((response) => {
      store.dispatch(LOADING, false);
      return Promise.resolve(response)
    }).catch(error => {
      var errors = error.response.data.errors
      if (errors === undefined) {
        var errorMessage = error.response.data.message;
      } else {
        var errorMessage = Object.values(errors)[0][0]
      }
      Vue.notify({
        group: 'full-noti',
        duration: 50000,
        text: errorMessage,
        type: 'warn'
      });
      Vue.swal({
        icon: "error",
        html: errorMessage,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: "Tutup",
      });
      store.dispatch(LOADING, false);
      return Promise.reject(error.response);
    });
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    this.setHeader();
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    this.setHeader();
    return Vue.axios.put(`${resource}`, params);
  },

  patch(resource, params) {
    this.setHeader();
    params.append("_method", "PATCH");
    return Vue.axios.post(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    this.setHeader();
    return Vue.axios.delete(resource).catch(error => {
      // console.log(error);
      throw new Error(`[RWV] ApiPublicService ${error}`);
    });
  },

  downloadPDF(resource, mimeType) {
    return Vue.axios.get(`${resource}`, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Accept: mimeType,
      },
    }).catch(error => {
      var errors = error.response.data.errors
      if (Object.values(errors).length > 0) {
        var errorMessage = Object.values(errors)[0][0]
      } else {
        var errorMessage = error.response.message;
      }
      Vue.notify({
        group: 'full-noti',
        title: 'Ralat',
        text: errorMessage,
        type: 'warn'
      });
      throw new Error(error);
    });
  },
};

export default ApiPublicService;