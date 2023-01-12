<template>
    <div>
        <el-form inline>
            <el-form-item>
                <el-input v-model="tempSearchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            <el-button @click="resetSearch">清空</el-button>
        </el-form>

        <div style="margin-bottom: 20px">
            <el-button type="primary" @click="addRole">添加</el-button>
            <el-button type="danger" @click="removeRoles" :disabled="selectedRoles.length == 0">批量删除</el-button>
        </div>

        <!-- 展示角色数据的表格 -->
        <el-table border stripe :data="roles" v-loading="listLoading" style="width: 1000px"
            @selection-change="selectionChange">
            <el-table-column type="selection" width="60" align="center"></el-table-column>

            <el-table-column label="序 号" type="index" width="60" align="center"></el-table-column>

            <el-table-column label="角色名称" align="center">
                <template slot-scope="{row}">
                    <template v-if="row.edit">
                        <el-input v-model="row.roleName" size="small" class="edit-input"></el-input>
                        <el-button type="warning" size="small" icon="el-icon-refresh" class="edit-cancel"
                            @click="cancelEdit(row)">取消</el-button>
                    </template>
                    <span v-else>{{ row.roleName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操 作" align="center" width="300">
                <template slot-scope="{row}">
                    <HintButton size="mini" type="info" icon="el-icon-info" title="分配权限"
                        @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)"></HintButton>
                    <HintButton size="mini" type="primary" icon="el-icon-check" title="确定" v-if="row.edit"
                        @click="updateRole(row)">
                    </HintButton>
                    <HintButton size="mini" type="primary" icon="el-icon-edit" title="修改角色" v-if="!row.edit"
                        @click="row.edit = true">
                    </HintButton>
                    <HintButton size="mini" type="danger" icon="el-icon-delete" title="删除角色" @click="removeRole(row)">
                    </HintButton>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[5, 10, 20, 30, 50]"
            style="text-align: center; padding: 20px 0px" layout="prev, pager, next, jumper, ->, sizes, total"
            @current-change="getRoles" @size-change="handleSizeChange">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: "RoleList",
    data() {
        return {
            roles: [], // 角色列表
            // 收集搜索框中的数据
            tempSearchObj: {
                roleName: "",
            },
            // 发送请求的条件数据
            searchObj: { roleName: "", },
            selectedRoles: [],  // 所有选中的角色列表
            listLoading: false,  // 数据是否在加载
            // 分页器参数
            total: 0,
            page: 1,
            limit: 5,
        };
    },
    mounted() {
        this.getRoles();
    },
    methods: {
        // 异步请求获取分页角色信息
        async getRoles(page = 1) {
            this.page = page;
            this.listLoading = true;
            const { limit, searchObj } = this;
            let result = await this.$API.role.reqRolesList(page, limit, searchObj);
            if (result.code == 20000) {
                const { items, total } = result.data;
                this.roles = items.map((item) => {
                    item.edit = false;
                    item.originRoleName = item.roleName;
                    return item;
                })
                this.total = total;
            }
            this.listLoading = false;
        },
        // 自定义查询角色
        search() {
            this.searchObj = { ...this.tempSearchObj };
            this.getRoles();
        },
        // 重置表单搜索框
        resetSearch() {
            this.tempSearchObj = { roleName: "", };
            this.searchObj = { roleName: "", };
            // 请求获取用户列表信息
            this.getRoles();
        },
        // 添加角色
        addRole() {
            this.$prompt("请输入新角色名称", "添加新角色", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({ value }) => {
                this.$API.role.reqAddRole({ roleName: value }).then(result => {
                    this.$message.success(result.message || "添加成功");
                    this.getRoles();
                })
            });
        },
        // 批量删除
        removeRoles() {
            this.$confirm("此操作将永久删除记录，是否继续？", "提示", {
                type: "warning",
            }).then(async () => {
                const ids = this.selectedRoles.map(item => item.id);
                await this.$API.role.reqRemoveRoles(ids);
                this.getRoles();
                this.$message.success("批量删除成功");
            }).catch(() => {
                this.$message.info("已取消删除");
            })
        },
        // 表格的复选框发生变化
        selectionChange(selection) {
            this.selectedRoles = selection;
        },
        // 取消角色修改
        cancelEdit(role) {
            role.roleName = role.originRoleName;
            role.edit = false;
            this.$message.warning("取消角色修改");
        },
        // 更新角色的修改信息
        async updateRole(role) {
            const result = await this.$API.role.updateRole({ id: role.id, roleName: role.roleName });
            if (result.code == 20000) {
                this.$message.success("修改成功");
                this.getRoles(this.page);
            }
        },
        // 删除单个角色信息
        removeRole(role) {
            this.$confirm(`确定删除 ${role.roleName} 吗？`, "提示", {
                type: "warning"
            }).then(async () => {
                const result = await this.$API.role.reqRemoveRole(role.id);
                this.getRoles(this.roles.length === 1 ? this.page - 1 : this.page);
                this.$message.success(result.message || "删除成功");
            }).catch(() => {
                this.$message.info("已取消删除");
            })
        },
        // 单页显示数量发生变化
        handleSizeChange(limit) {
            this.limit = limit;
            this.getRoles();
        }
    },
}
</script>

<style scoped>
.edit-input {
    padding-right: 100px;
}

.edit-cancel {
    position: absolute;
    right: 20px;
}
</style>