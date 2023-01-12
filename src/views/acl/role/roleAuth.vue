<template>
    <div>
        <el-input disabled v-model="$route.query.roleName" placeholder=""></el-input>
        <el-tree ref="tree" style="margin: 20px 0;" :data="allPermissions" node-key="id" show-checkbox
            default-expand-all :props="defaultProps"></el-tree>
        <el-button type="primary" :loading="loading" @click="save">保存</el-button>
        <el-button @click="$router.replace({ name: 'Role' })">取消</el-button>
    </div>
</template>

<script>
export default {
    name: "RoleAuth",
    data() {
        return {
            allPermissions: [],
            loading: false,
            // 树形控件默认配置选项
            defaultProps: {
                children: "children",
                label: "name",
            }
        }
    },
    created() {
        this.initTree();
    },
    methods: {
        // 初始化
        initTree() {
            const roleId = this.$route.params.id;
            this.getPermissions(roleId);
        },
        // 获取指定角色的权限列表
        async getPermissions(roleId) {
            let result = await this.$API.permission.reqToAssign(roleId);
            if (result.code == 20000) {
                const allPermissions = result.data.children;
                this.allPermissions = allPermissions;
                const checkedIds = this.getCheckedKeys(allPermissions);
                this.$refs.tree.setCheckedKeys(checkedIds);
            }
        },
        // 得到所有选中的id列表
        getCheckedKeys(auths, initArr = []) {
            return auths.reduce((pre, item) => {
                if (item.select && item.level == 4) {
                    pre.push(item.id);
                } else if (item.children) {
                    this.getCheckedKeys(item.children, initArr);
                }
                return pre;
            }, initArr)
        },
        // 保存对角色权限的编辑
        async save() {
            const ids = this.$refs.tree.getCheckedKeys().join(",");
            this.loading = true;
            let result = await this.$API.permission.reqDoAssign(this.$route.params.id, ids);
            if (result.code == 20000) {
                this.loading = false;
                this.$message.success(result.message || "分配权限成功");

                const roleName = this.$route.query.roleName;
                const roles = this.$store.getters.name;
                // 替换路由
                this.$router.replace({ name: "Role" }, () => {
                    console.log("replace onComplete");
                    // 验证当前修改的角色是不是当前用户的角色
                    // 如果是 则重新加载页面
                    if (roles.includes(roleName)) {
                        console.log("reload");
                        window.location.reload();
                    }
                })
            }
        }
    }
}
</script>

<style>
</style>