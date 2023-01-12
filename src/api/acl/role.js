import request from "@/utils/request";
const api_name = "/admin/acl/role";

// 获取角色分页列表
export const reqRolesList = (page, limit, searchObj) => {
    return request({
        url: `${api_name}/${page}/${limit}`,
        method: "get",
        params: searchObj,
    });
};

// 请求添加角色
export const reqAddRole = (role) => {
    return request({
        url: `${api_name}/save`,
        method: "post",
        data: role,
    });
};

// 请求批量删除角色
export const reqRemoveRoles = (ids) => {
    return request({
        url: `${api_name}/batchRemove`,
        method: "delete",
        data: ids,
    });
};

// 请求更新角色信息
export const updateRole = (role) => {
    return request({
        url: `${api_name}/update`,
        method: "put",
        data: role,
    });
};

// 请求删除某个角色
export const reqRemoveRole = (id) => {
    return request({
        url: `${api_name}/remove/${id}`,
        method: "delete",
    });
};
