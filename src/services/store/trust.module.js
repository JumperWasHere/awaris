import ApiService from "@/services/api.service";
export const PREFERENCE = "preference";
export const TRUST = "trust";
export const IS_EKYC_COMPLETE = "isEkycComplete";
export const FAILED_COUNT = "failedCount";
export const SELFIE = "selfie";
export const MYKAD_FRONT = "mykadFront";
export const AMENDMENT = 'amendment';
export const WITNESS_SIGN ='witness_sign';

export const SET_WITNESS_SIGN ="setwitness_sign";
export const SET_PREFERENCE = "setPreference";
export const SET_AMENDMENT = 'setAmendment';
export const SET_TRUST = "setTrust";
export const SET_IS_EKYC_COMPLETE = "setIsEkycComplete";
export const INCREMENT_FAILED_COUNT = "incrementFailedCount";
export const SET_SELFIE = "selfie";
export const SET_MYKAD_FRONT = "mykadFront";
export const SET_TRUST_EMPTY = "setTrustEmpty";
export const CLEAR_TRUST = "clearTrust";

const state = {
  preference: null,
  trust: null,
  isEkycComplete: false,
  failedCount: 0,
  selfie: null,
  mykadFront: null,
  amendment:null,
  witness_sign:null,
};

const getters = {
  preference(state) {
    return state.preference;
  },
  trust(state) {
    return state.trust;
  },
  isEkycComplete(state) {
    if (state.trust) {
      if (state.trust.ekyc_verified_at) {
        return true;
      }
    }
    return state.isEkycComplete;
  },
  failedCount(state) {
    if (state.trust) {
      if (state.trust.face_verification_count > state.failedCount) {
        state.failedCount = state.trust.face_verification_count;
        return state.trust.face_verification_count;
      }
    }
    return state.failedCount

  },
  selfie(state) {
    return state.selfie;
  },
  mykadFront(state) {
    return state.mykadFront;
  },
  amendment(){
    return state.amendment;
  },
  witness_sign(){
    return state.witness_sign;
  }
}

const actions = {
  [WITNESS_SIGN](context, trustId) {
    //     if(this.trust.organization_id  != null){
    // organizationId = this.trust.organization_id;
    //     }
        return new Promise((resolve, reject) => {
          ApiService.get(`hibah/${trustId}/receiver/validate-signature`).then((response) => {
            console.log('WITNESS_SIGN',response.data);
            context.commit(SET_WITNESS_SIGN, response.data);
            resolve(response.data);
          }).catch((error) => {
            reject(error.data);
          });
        });
      },
  [PREFERENCE](context, organizationId) {
//     if(this.trust.organization_id  != null){
// organizationId = this.trust.organization_id;
//     }
    return new Promise((resolve, reject) => {
      ApiService.get(`organization/${organizationId}/preference`).then((response) => {
        // console.log('PREFERENCE- ',response.data);
        context.commit(SET_PREFERENCE, response.data.preference);
        resolve(response.data);
      }).catch((error) => {
        reject(error.data);
      });
    });
  },
  [TRUST](context, trustId) {
    if (!trustId) {
      return;
    }
    return new Promise((resolve, reject) => {
      ApiService.get(`hibah/${trustId}`).then((response) => {
        context.commit(SET_TRUST, response.data.hibah);
        // console.log('TRUST',response.data.hibah);
        resolve(response.data);
      }).catch((error) => {
        reject(error.data);
      });
    });
  },
  [AMENDMENT](context, trustId){
    if(!trustId){
      return;
    }
    return new Promise((resolve, reject) => {
      ApiService.get(`/amendment?hibah_id=${trustId}`).then((response) => {
        context.commit(SET_AMENDMENT, response.data.amendments.data[0]);
        resolve(response.data);
      }).catch((error) => {
        reject(error.data);
      });
    });
  },
  [SET_TRUST_EMPTY](context) {
    context.commit(SET_TRUST, null);
  },
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
  [CLEAR_TRUST](context) {
    context.commit(CLEAR_TRUST);
  }
}

const mutations = {
  [SET_PREFERENCE](state, preference) {
    state.preference = preference;
  },
  [SET_WITNESS_SIGN](state, witness) {
    state.witness_sign = witness;
  },
  [SET_TRUST](state, trust) {
    state.trust = trust;
  },
  [SET_AMENDMENT](state, amendment) {
    state.amendment = amendment;
  },
  [SET_IS_EKYC_COMPLETE](state, isEkycComplete) {
    state.isEkycComplete = isEkycComplete;
  },
  [INCREMENT_FAILED_COUNT](state) {
    state.failedCount++;
  },
  [SET_SELFIE](state, selfie) {
    state.selfie = selfie;
  },
  [SET_MYKAD_FRONT](state, mykadFront) {
    state.mykadFront = mykadFront;
  },
  [CLEAR_TRUST](state) {
    state.trust = null;
    state.isEkycComplete = false;
    state.failedCount = 0;
  },
}

export default {
  state,
  actions,
  mutations,
  getters
};