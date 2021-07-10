import ApiService from "@/services/api.service";
import JwtService from "@/services/jwt.service";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const FACE_VERIFICATION = "faceVerification";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_USER = "updateUser";
export const USER_ACCESS = "userAccess";
export const SIGNATURE = "signature";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_ERROR = "setError";
export const SET_SIGNATURE = "setSignature";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken(),
  userRole: null,
  userAccess: null,
  currentUser: {},
  signature: null,
};

const getters = {
  currentUser(state) {
    if (state.currentUser.id !== undefined) {
      return state.currentUser;
    } else {
      var user = window.localStorage.getItem("LOGGED_USER");
      state.user = JSON.parse(user)
      state.signature = state.user.signature
      return JSON.parse(user);
    }
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  userRole(state) {
    var user = JSON.parse(window.localStorage.getItem("LOGGED_USER"));
    if (state.userRole) {
      return state.userRole;
    } else if (user != null) {
      if (user.roles) {
        if (user.roles.length > 0) {
          return user.roles[0].name
        }
      }
    }
    return null;
  },
  userAccess(state) {
    var user = JSON.parse(window.localStorage.getItem("LOGGED_USER"));
    if (state.userAccess) {
      return state.userAccess;
    } else if (user) {
      var access = user.user_access
      return access;
    }
    return null;
  },
  signature(state) {
    if (state.user.signature) {
      return state.user.signature
    }
    return state.signature;
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post("/login", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [USER_ACCESS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post(`/user/`, credentials)
        .then(({
          data
        }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post("users", {
        user: credentials
      })
        .then(({
          data
        }) => {
          if (data != null) {
            context.commit(SET_AUTH, data);
          }
          resolve(data);
        })
        .catch(({
          response
        }) => {
          context.commit(SET_ERROR, errors);
          reject(response);
        });
    });
  },
  async [VERIFY_AUTH](context) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      return await ApiService.get("/authenticate")
        .then((response) => {

          if (response != null) {
            context.commit(SET_AUTH, response.data);
          }
          return response.data;
        })
        .catch(response => {
          if (response.status == 401) {
            context.commit(PURGE_AUTH);
            this.$router.push({
              name: "login"
            })
          }
          return response;
        });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [UPDATE_USER](context, payload) {
    const {
      email,
      username,
      password,
      image,
      bio
    } = payload;
    const user = {
      email,
      username,
      bio,
      image
    };
    if (password) {
      user.password = password;
    }

    return ApiService.put("user", user).then(({
      data
    }) => {
      context.commit(SET_AUTH, data);
      return data;
    });
  },
  async [FACE_VERIFICATION]({ commit, getters }, payload) {
    return await ApiService.get(`/user/${getters.currentUser.id}/face-verification?return_first=true&min_verification_score=70`)
      .then((response) => {
        return response.data;
      })
      .catch(error => {
        return error.response;
      });
  },
  [SIGNATURE](context, signature) {
    context.commit(SET_SIGNATURE, signature);
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.user = data.user;
    state.currentUser = data.user;
    state.signature = data.user.signature;
    state.userAccess = data.user.user_access;
    if (data.user !== undefined) {
      window.localStorage.setItem("LOGGED_USER", JSON.stringify(data.user));
      if (data.user.roles) {
        if (data.user.roles.length > 0) {
          state.userRole = data.user.roles ? data.user.roles[0].name : null;
        } else {
          state.userRole = null;
        }
      } else {
        state.userRole = null;
      }
    }
    state.errors = {};
    if (data.token) {
      JwtService.saveToken(data.token);
    }
  },
  [PURGE_AUTH](state) {
    window.localStorage.setItem("LOGGED_USER", "");
    JwtService.destroyToken();
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
  },
  [SET_SIGNATURE](state, signature) {
    state.signature = signature;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};