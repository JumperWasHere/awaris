import ApiService from "@/services/api.service";
export const CHECK_USER = 'CHECK_USER';
export const CREATE_USER = 'CREATE_USER';
export const SET_USER = 'SET_USER';
export const UPDATE_USER_DETAIL = 'UPDATE_USER_DETAIL';
export const SET_USER_DETAIL = 'SET_USER_DETAIL';
export const SET_HIBAH = 'SET_HIBAH';
export const GET_HIBAH = 'GET_HIBAH';
export const GET_HIBAH_BY_ID = 'GET_HIBAH_BY_ID';
export const CREATE_HIBAH = 'CREATE_HIBAH';
export const UPDATE_HIBAH = 'UPDATE_HIBAH';
export const CREATE_CARETAKER = 'CREATE_CARETAKER';
export const RESET = 'RESET';
export const CLEAR_DATA = 'CLEAR_DATA';

const state = {
    hibah: null,
    user: null,
    userDetail: null,
}

const getters = {
    user(state) {
        return state.user;
    },
    userDetail(state) {
        return state.userDetail;
    },
    hibah(state) {
        return state.hibah;
    },
}

const actions = {
    [CHECK_USER](context, myKad) {
        return new Promise((resolve, reject) => {
            ApiService.get(`user?ic_number=${myKad}`).then((response) => {
                context.commit(SET_USER, response.data.users.data[0]);
                resolve(response.data.users.data[0]);
            }).catch((error) => {
                reject(error.data);
            });
        });
    },
    [CREATE_USER](context, payload) {
        return new Promise((resolve, reject) => {
            ApiService.post(`user`, payload).then((response) => {
                context.commit(SET_USER, response.data.user);
                resolve(response.data.user);
            }).catch((error) => {
                reject(error.data);
            });
        });
    },
    [UPDATE_USER_DETAIL](context, { hibahId, payload }) {
        return new Promise((resolve, reject) => {
            ApiService.post(`hibah/${hibahId}/user-detail`, payload).then((response) => {
                context.commit(SET_USER_DETAIL, response.data.user_detail);
                resolve(response.data.user_detail);
            }).catch((error) => {
                reject(error.data);
            });
        });
    },
    [GET_HIBAH](context, userId) {
        return new Promise((resolve, reject) => {
            ApiService.get(`hibah?user_id=${userId}&hibah_type=14`).then((response) => {
                try {
                    context.commit(SET_HIBAH, response.data.hibahs.data[0]);
                    context.commit(SET_USER_DETAIL, response.data.hibahs.data[0].user_detail ?? {});
                } catch (error) {
                }
                resolve(response.data.hibahs.data);
            }).catch((error) => {
                reject(error.data);
            });
        });
    },
    [GET_HIBAH_BY_ID](context, hibahId) {
        return new Promise((resolve, reject) => {
            ApiService.get(`hibah/${hibahId}?load_with=userDetail`).then((response) => {
                context.commit(SET_HIBAH, response.data.hibah);
                try {
                    context.commit(SET_USER_DETAIL, response.data.hibah.user_detail ?? {});
                } catch (error) {

                }
                resolve(response.data.hibah);
            }).catch((error) => {
                reject(error.data);
            });
        });
    },
    [CREATE_HIBAH](context, payload) {
        return new Promise((resolve, reject) => {
            ApiService.post(`hibah`, payload).then((response) => {
                context.commit(SET_HIBAH, response.data.hibah);
                resolve(response.data.hibah);
            }).catch((error) => {
                reject(error.data);
            });
        });
    },
    [UPDATE_HIBAH](context, { hibahId, payload }) {
        return new Promise((resolve, reject) => {
            ApiService.post(`hibah/${hibahId}`, payload).then((response) => {
                context.commit(SET_HIBAH, response.data.hibah);
                resolve(response.data.hibah);
            }).catch((error) => {
                reject(error.data);
            });
        });
    },
    [CREATE_CARETAKER](context, { hibahId, payload }) {
        return new Promise((resolve, reject) => {
            ApiService.post(`hibah/${hibahId}/caretaker`, payload).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error.data);
            });
        });
    },
    [RESET](context) {
        context.commit(CLEAR_DATA);
    },
}

const mutations = {
    [SET_USER](state, user) {
        state.user = user;
    },
    [SET_USER_DETAIL](state, userDetail) {
        state.userDetail = userDetail;
    },
    [SET_HIBAH](state, hibah) {
        state.hibah = hibah;
    },
    [CLEAR_DATA](state) {
        state.hibah = null;
        state.user = null;
        state.userDetail = null;
    },
}


export default {
    state,
    actions,
    mutations,
    getters
};