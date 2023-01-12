import request from "@/utils/request";

// 登录接口函数
export function login(data) {
    return request({
        url: "/admin/acl/index/login",
        method: "post",
        data,
    });
}

// 获取用户信息的函数
export function getInfo(token) {
    return request({
        url: "/admin/acl/index/info",
        method: "get",
        params: { token },
    });
}

// 退出登录的接口函数
export function logout() {
    return request({
        url: "/admin/acl/index/logout",
        method: "post",
    });
}
