import ApiService from "@/services/api.service";
export const WASIAT = "wasiat";
// export const AMENDMENT = "amendment";
export const IS_EKYC_COMPLETE = "isEkycCompleteWasiat";
export const FAILED_COUNT = "failedCountWasiat";
export const SELFIE = "selfieWasiat";
export const MYKAD_FRONT = "mykadFrontWasiat";

export const SET_WASIAT = "setWasiat";
// export const SET_AMENDMENT = "setAmendment";
export const SET_IS_EKYC_COMPLETE = "setIsEkycCompleteWasiat";
export const INCREMENT_FAILED_COUNT = "incrementFailedCountWasiat";
export const SET_SELFIE = "selfieWasiat";
export const SET_MYKAD_FRONT = "mykadFrontWasiat";
export const SET_WASIAT_EMPTY = "setWasiatEmpty";
export const CLEAR_WASIAT = "clearWasiat";
// export const SET_TRUST_EMPTY = "setTrustEmptyWas";

const state = {
  wasiat: null,
  isEkycCompleteWasiat:false,
  failedCountWasiat:0,
  selfieWasiat: null,
  mykadFrontWasiat: null,
};

const getters = {
  wasiat(state) {
    return state.wasiat;
  },
  // amendment(state) {
  //   return state.amendment;
  // },
  isEkycCompleteWasiat(state) {
    if (state.wasiat) {
      if (state.wasiat.ekyc_verified_at) {
        return true;
      }
    }
    return state.isEkycCompleteWasiat;
  },
  failedCountWasiat(state) {
    if (state.wasiat) {
      if (state.wasiat.face_verification_count > state.failedCountWasiat) {
        state.failedCountWasiat = state.wasiat.face_verification_count;
        return state.wasiat.face_verification_count;
      }
    }
    return state.failedCountWasiat

  },
  selfieWasiat(state) {
    return state.selfieWasiat;
  },
  mykadFrontWasiat(state) {
    return state.mykadFrontWasiat;
  }
}

const actions = {
  [WASIAT](context, wasiatId) {
    if (!wasiatId) {
      return;
    }
    return new Promise((resolve, reject) => {
      ApiService.get(`wasiat/${wasiatId}`).then((response) => {
        context.commit(SET_WASIAT, response.data.wasiat);
        resolve(response.data);
      }).catch((error) => {
        reject(error.data);
      });
    });
  },
  // [AMENDMENT](context, amendmentId) {
  //   if (!amendmentId) {
  //     return;
  //   }
  //   return new Promise((resolve, reject) => {
  //     ApiService.get(`amendment/${amendmentId}`).then((response) => {
  //       context.commit(SET_AMENDMENT, response.data.amendment);
  //       resolve(response.data);
  //     }).catch((error) => {
  //       reject(error.data);
  //     });
  //   });
  // },
  [IS_EKYC_COMPLETE](context, isEkycComplete) {
    context.commit(SET_IS_EKYC_COMPLETE, isEkycComplete);
  },
  [FAILED_COUNT](context) {
    context.commit(INCREMENT_FAILED_COUNT);
  },
  [SELFIE](context, selfie) {
    context.commit(SET_SELFIE, selfie);
  },
  [MYKAD_FRONT](context, mykadFront) {
    context.commit(SET_MYKAD_FRONT, mykadFront);
  },
  [SET_WASIAT_EMPTY](context) {
    context.commit(SET_WASIAT, null);
  },
  [CLEAR_WASIAT](context) {
    context.commit(CLEAR_WASIAT);
  }
}

const mutations = {
  [SET_WASIAT](state, wasiat) {
    state.wasiat = wasiat;
  },
  // [SET_AMENDMENT](state, amendment) {
  //   state.amendment = amendment;
  // },
  [SET_IS_EKYC_COMPLETE](state, isEkycCompleteWasiat) {
    state.isEkycCompleteWasiat = isEkycCompleteWasiat;
  },
  [INCREMENT_FAILED_COUNT](state) {
    state.failedCountWasiat++;
  },
  [SET_SELFIE](state, selfieWasiat) {
    state.selfieWasiat = selfieWasiat;
  },
  [SET_MYKAD_FRONT](state, mykadFrontWasiat) {
    state.mykadFrontWasiat = mykadFrontWasiat;
  },
  [CLEAR_WASIAT](state) {
    state.wasiat = null;
    state.isEkycCompleteWasiat = false;
    state.failedCountWasiat = 0;
  },
}

export default {
  state,
  actions,
  mutations,
  getters
};