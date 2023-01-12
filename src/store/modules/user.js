import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { constantRoutes, asyncRoutes, anyRoutes, resetRouter } from "@/router";
import cloneDeep from "lodash/cloneDeep";
import router from "@/router";

const getDefaultState = () => {
    return {
        // 获取token
        token: getToken(),
        // 存储用户名
        name: "",
        // 存储用户头像
        avatar: "",
        // 服务器返回的菜单信息【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
        routes: [],
        // 角色信息
        roles: [],
        // 按钮权限的信息
        buttons: [],
        // 对比之后计算出来的异步路由结果  对比【项目中完整的异步路由】与【服务器返回的标记信息】 计算最终需要展示的异步路由
        resultAsyncRoutes: [],
        // 用户最终需要展示的全部路由
        resultAllRoutes: [],
    };
};

const state = getDefaultState();

const mutations = {
    // 初始化state
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    // 登录后存储token
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    // 存储用户信息
    SET_USERINFO: (state, userInfo) => {
        // 用户名
        state.name = userInfo.name;
        // 用户头像
        state.avatar = userInfo.avatar;
        // 菜单权限标记
        state.routes = userInfo.routes;
        // 用户角色
        state.roles = userInfo.roles;
        // 按钮权限标记
        state.buttons = userInfo.buttons;
    },
    // 计算出当前用户的完整路由
    SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
        // Vuex保存当前用户的异步路由
        // 用户需要展示完整的路由：常量、异步、任意路由
        state.resultAsyncRoutes = asyncRoutes;
        // 计算出当前用户需要展示的所有路由
        state.resultAllRoutes = constantRoutes.concat(
            state.resultAsyncRoutes,
            anyRoutes
        );
        // 给router添加新的路由
        router.addRoutes(state.resultAllRoutes);
    },
};

// 递归查找asyncRoutes和routes相同的路由标记
// 生成新的asyncRoutes 当前用户显示哪些路由信息
const computedAsyncRoutes = (asyncRoutes, routes) => {
    return asyncRoutes.filter((item) => {
        // 继续搜索子路由
        if (routes.indexOf(item.name) != -1) {
            if (item.children && item.children.length) {
                item.children = computedAsyncRoutes(item.children, routes);
            }
            return true;
        }
    });
};

const actions = {
    // 客户端请求用户登录
    async login({ commit }, userInfo) {
        // 解构出用户信息和密码
        const { username, password } = userInfo;
        let result = await login({
            username: username.trim(),
            password: password,
        });
        if (result.code == 20000) {
            commit("SET_TOKEN", result.data.token);
            setToken(result.data.token);
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token)
                .then((response) => {
                    const { data } = response;
                    commit("SET_USERINFO", data);
                    commit(
                        "SET_RESULTASYNCROUTES",
                        computedAsyncRoutes(cloneDeep(asyncRoutes), data.routes)
                    );
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // 用户退出登录
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    removeToken(); // must remove  token  first
                    resetRouter();
                    commit("RESET_STATE");
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            removeToken(); // must remove  token  first
            commit("RESET_STATE");
            resolve();
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
