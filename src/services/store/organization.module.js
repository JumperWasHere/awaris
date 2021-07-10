import ApiService from "@/services/api.service";
export const ORGANIZATION = "organization";
export const SET_ORGANIZATION = "setOrganization";


const state = {
  organization: {},
};

const getters = {
  organization(state) {
    return state.organization;
  },
}

const actions = {
  [ORGANIZATION](context, organizationId) {
    if (!organizationId) {
      return;
    }
    return new Promise((resolve, reject) => {
      ApiService.get(`organization/${organizationId}`).then((response) => {
        context.commit(SET_ORGANIZATION, response.data.organization);
        console.log("ASD")
        resolve(response.data);
      }).catch((error) => {
        reject(error.data);
      });
    });
  },
}

const mutations = {
  [SET_ORGANIZATION](state, organization) {
    state.organization = organization;
  },
}

export default {
  state,
  actions,
  mutations,
  getters
};