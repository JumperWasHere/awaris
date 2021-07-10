export const LOADING = "loading";
export const SET_LOADING = "setLoading";


const state = {
  isLoading: false
};

const getters = {
  isLoading(state) {
    return state.isLoading;
  },
}

const actions = {
  [LOADING](context, isLoading) {
    if (!isLoading) {
      setTimeout(function () {
        context.commit(SET_LOADING, isLoading)
      }, 700);
    } else {
      context.commit(SET_LOADING, isLoading)
    }
  },
}

const mutations = {
  [SET_LOADING](state, isLoading) {
    state.isLoading = isLoading;
  },
}

export default {
  state,
  actions,
  mutations,
  getters
};