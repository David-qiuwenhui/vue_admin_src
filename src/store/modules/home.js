import { reqDashboardData } from "@/api/mock_api/dashboard";
const state = {
    list: {},
};
const mutations = {
    GETDATA(state, data) {
        state.list = data;
    },
};
const actions = {
    // 发送请求获取首页的mock数据
    async getData({ commit }) {
        let result = await reqDashboardData();
        if (result.code == 200) {
            commit("GETDATA", result.data);
        }
    },
};
const getters = {};

export default {
    state,
    mutations,
    actions,
    getters,
};
