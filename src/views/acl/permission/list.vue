<template>
    <div>
        <el-table border style="margin-bottom: 20px" :data="menuPermissionList" :expand-row-keys="expandKeys"
            row-key="id">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="权限值" prop="code"></el-table-column>
            <el-table-column label="跳转权限值" prop="toCode"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <HintButton :disabled="row.level === 4" type="primary" icon="el-icon-plus" size="mini"
                        :title="getAddTitle(row.level)" @click="toAddPermission(row)"></HintButton>
                    <HintButton :disabled="row.level === 1" type="primary" icon="el-icon-edit" size="mini"
                        :title="row.level === 4 ? '修改功能' : '修改菜单'" @click="toUpdatePermission(row)"></HintButton>
                    <HintButton :disabled="row.level === 1" type="danger" icon="el-icon-delete" size="mini" title="删除"
                        @click="removePermission(row)">
                    </HintButton>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogPermissionVisible" @close="resetDialog">
            <el-form ref="permission" :model="permission" :rules="permissionRules" label-width="120px">
                <el-form-item label="父级名称" v-if="permission.level > 2 && !permission.id">
                    <el-input :value="permission.pname" disabled></el-input>
                </el-form-item>

                <el-form-item label="名称" prop="name">
                    <el-input v-model="permission.name"></el-input>
                </el-form-item>

                <el-form-item label="功能权限值" prop="code">
                    <el-input v-model="permission.code"></el-input>
                </el-form-item>

                <el-form-item label="跳转路由权限值" prop="toCode" v-if="permission.level === 4">
                    <el-input v-model="permission.toCode"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="addOrUpdatePermission">确定</el-button>
                <el-button @click="resetDialog">取消</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
// 菜单权限校验规则
const menuRules = {
    name: [{ required: true, message: "名称必须输入" }],
    code: [{ required: true, message: "权限值必须输入" }],
}

// 按钮功能权限校验规则
const btnRules = {
    name: [{ required: true, message: "名称必须输入" }],
    code: [{ required: true, trigger: "blur", message: "功能权限值必须输入" }],
}

export default {
    name: "PermissionList",
    data() {
        return {
            menuPermissionList: [],  // 权限菜单列表
            expandKeys: [],  // 需要自动展开的项
            dialogPermissionVisible: false, // 显示菜单权限的对话框
            // 要操作的菜单权限对象
            permission: {
                level: 0,
                name: "",
                code: "",
                toCode: "",
            }
        };
    },
    mounted() {
        this.fetchPermissionList();
    },
    computed: {
        // 动态计算得到Dialog的标题
        dialogTitle() {
            const { id, level } = this.permission;
            if (id) {
                return level === 4 ? "修改功能" : "修改菜单";
            } else {
                return level === 4 ? "添加功能" : `添加${level === 2 ? "一级" : "二级"}菜单`;
            }
        },
        // 根据权限的等级来计算确定校验规则
        permissionRules() {
            return this.permission.level === 4 ? btnRules : menuRules;
        }
    },
    methods: {
        // 请求获取权限菜单列表数据
        async fetchPermissionList() {
            let result = await this.$API.permission.reqPermissionList();
            if (result.code === 20000) {
                this.menuPermissionList = result.data.children;
                this.expandKeys = [this.menuPermissionList[0].id];
            }
        },
        // 获取添加按钮的title
        getAddTitle(level) {
            if (level === 1 || level === 2) {
                return "添加菜单";
            } else if (level === 3) {
                return "添加功能";
            }
        },
        // 显示添加权限的界面（菜单或功能）
        toAddPermission(row) {
            this.dialogPermissionVisible = true;
            this.permission.pid = row.id;
            this.permission.level = row.level + 1;
            this.permission.type = this.permission.level === 4 ? 2 : 1;
            // 显示父名称
            this.permission.pname = row.name;

            // 移除表单项的校验结果（在页面更新之后）
            this.$nextTick(() => this.$refs.permission.clearValidate());
        },
        // 显示菜单添加或更新的dialog
        toUpdatePermission(row) {
            this.dialogPermissionVisible = true;
            this.permission = { ...row };
            this.permission.type = this.permission.level === 4 ? 2 : 1;
            // 移除表单验证的校验结果（在页面更新之后）
            this.$nextTick(() => this.$refs.permission.clearValidate());
        },
        // 删除某个权限节点
        removePermission(permission) {
            this.$confirm("此操作将永久删除该记录，是否继续？", "提示", {
                type: 'warning'
            }).then(async () => {
                const result = await this.$API.permission.reqRemovePermission(permission.id);
                this.$message.success(result.message || '删除成功');
                this.fetchPermissionList();
            }).catch((error) => {
                if (error == "cancel") {
                    this.$message.info("已取消删除");
                }
            })
        },
        // 添加或更新权限功能
        addOrUpdatePermission() {
            this.$refs.permission.validate(async (valid) => {
                if (valid) {
                    const { pname, ...perm } = this.permission;
                    const result = await this.$API.permission[perm.id ? "updatePermission" : "addPermission"](perm);
                    this.$message.success(result.message || `${perm.id ? "修改" : "添加"}成功`);
                    this.resetDialog();
                    this.fetchPermissionList();
                }
            })
        },
        // 重置对话框的数据
        resetDialog() {
            this.dialogPermissionVisible = false;
            this.permission = {
                level: 0,
                name: "",
                code: "",
                toCode: "",
            }
        },
    }
}
</script>

<style>
</style>