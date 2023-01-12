import request from "@/utils/request";

// 查看某个角色的权限列表
export const reqToAssign = (roleId) => {
    return request({
        url: `/admin/acl/permission/toAssign/${roleId}`,
        method: "get",
    });
};

// 给某个角色授权
export const reqDoAssign = (roleId, permissionId) => {
    return request({
        url: "/admin/acl/permission/doAssign",
        method: "post",
        params: { roleId, permissionId },
    });
};

// 请求获取权限菜单
export const reqPermissionList = () => {
    return request({
        url: "/admin/acl/permission",
        method: "get",
    });
};

// 请求删除权限列表
export const reqRemovePermission = (id) => {
    return request({
        url: `/admin/acl/permission/remove/${id}`,
        method: "delete",
    });
};

// 更新一个权限项
export const updatePermission = (permission) => {
    return request({
        url: "/admin/acl/permission/update",
        method: "put",
        data: permission,
    });
};

// 新增一个权限项
export const addPermission = (permission) => {
    return request({
        url: "/admin/acl/permission/save",
        method: "post",
        data: permission,
    });
};
