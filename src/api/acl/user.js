import request from "@/utils/request";
const api_name = "/admin/acl/user";

// 获取后台用户分页列表（带搜索）
export const getPageList = (page, limit, searchObj) => {
    return request({
        url: `${api_name}/${page}/${limit}`,
        method: "get",
        params: searchObj,
    });
};

// 请求添加用户数据
export const reqAddUser = (data) => {
    return request({
        url: "/admin/acl/user/save",
        method: "post",
        data: data,
    });
};

// 请求更新用户数据
export const reqUpdateUser = (user) => {
    return request({
        url: "/admin/acl/user/update",
        method: "put",
        data: user,
    });
};

// 请求批量删除用户
export const reqRemoveUsers = (userList) => {
    return request({
        url: `${api_name}/batchRemove`,
        method: "delete",
        data: userList,
    });
};

// 请求删除单个用户
export const reqRemoveUserById = (userId) => {
    return request({
        url: `${api_name}/remove/${userId}`,
        method: "delete",
    });
};

// 获取某个用户的所有角色
export const getRoles = (userId) => {
    return request({
        url: `${api_name}/toAssign/${userId}`,
        method: "get",
    });
};

// 请求修改指定用户的角色信息
export const reqAssignRole = (userId, roleId) => {
    return request({
        url: `${api_name}/doAssign`,
        method: "post",
        params: { userId, roleId },
    });
};
