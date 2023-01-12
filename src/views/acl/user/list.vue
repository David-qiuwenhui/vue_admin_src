<template>
    <div>
        <!-- 内联表单 -->
        <el-form inline>
            <el-form-item>
                <el-input placeholder="用户名" v-model="tempSearchObj.username"></el-input>
            </el-form-item>
            <!-- 查询与清空按钮 -->
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="default" @click="resetSearch">清空</el-button>
        </el-form>
        <!-- 添加和批量删除按钮 -->
        <div style="margin-bottom: 20px">
            <el-button type="primary" @click="showAddUser">添 加</el-button>
            <el-button type="danger" @click="removeUsers" :disabled="selectedIds.length === 0">批量删除</el-button>
        </div>
        <!-- 展示用户数据的表格 -->
        <el-table border stripe v-loading="listloading" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" width="150"></el-table-column>
            <el-table-column prop="nickName" label="用户昵称" width="150"></el-table-column>
            <el-table-column prop="roleName" label="权限列表" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" width="180"></el-table-column>
            <el-table-column prop="gmtModified" label="更新时间" width="180"></el-table-column>
            <el-table-column label="操作" width="240" align="center">
                <template slot-scope="{ row }">
                    <HintButton title="分配角色" type="info" icon="el-icon-user-solid" size="mini"
                        @click="showAssignRole(row)">
                    </HintButton>
                    <HintButton title="修改用户" type="primary" icon="el-icon-edit" size="mini"
                        @click="showUpdateUser(row)"></HintButton>
                    <el-popconfirm :title="`确认删除${row.username}吗？`" @onConfirm="removeUser(row.id)">
                        <HintButton title=" 删除用户" slot="reference" type="danger" icon="el-icon-delete" size="mini">
                        </HintButton>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 7, 10]"
            @current-change="getUsers" layout="prev, pager, next, jumper, ->, sizes, total"
            style="text-align: center; padding: 20px 0px" :page-count="7" @size-change="handleSizeChange">
        </el-pagination>

        <!-- 添加用户弹出框 -->
        <el-dialog :title="user.id ? '修改用户' : '添加用户'" :visible.sync="dialogUserVisible">
            <el-form ref="userForm" :model="user" :rules="userRules" label-width="120px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="user.nickName"></el-input>
                </el-form-item>
                <el-form-item v-if="!user.id" label="用户密码" prop="password">
                    <el-input v-model="user.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateUser" :loading="userloading">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 给指定用户分配角色 -->
        <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
            <el-form label-width="80px">
                <el-form-item label="用户名">
                    <el-input disabled :value="user.username"></el-input>
                </el-form-item>

                <el-form-item label="角色列表">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <div style="margin: 10px 0;"></div>
                    <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
                        <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{  role.roleName  }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>

            <div slot="footer">
                <el-button type="primary" :loading="loading" @click="assignRole">保存</el-button>
                <el-button @click="resetRoleData">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import user from '@/store/modules/user';
import cloneDeep from 'lodash/cloneDeep';

export default {
    name: "User",
    data() {
        return {
            // 分页器
            page: 1,
            limit: 5,
            pager: 0,
            total: 0,

            // 用户数据
            searchObj: {
                username: "",
            },
            tempSearchObj: {
                username: "",
            },
            // 展示的用户数据
            userList: [],
            listloading: false, // 显示列表加载的提示

            // 添加或修改用户弹出框
            dialogUserVisible: false,
            user: {},
            userloading: false,
            // 添加或修改用户表单校验规则
            userRules: {
                username: [
                    { required: true, message: "用户必须输入" },
                    { min: 4, message: "用户名不能小于4位" },
                ],
                password: [
                    { required: true, validator: this.passwordValidator },
                ],
            },
            // 收集选中的用户
            selectedIds: [],

            /****** 设置用户角色 ******/
            dialogRoleVisible: false, // 显示用户角色
            user: {},  // 当前编辑的用户状态
            allRoles: [],  // 全部角色
            userRoleIds: [],  // 用户的角色状态
            checkAll: false,  // 全选状态
            isIndeterminate: false,  // 全选按钮的不确定状态
            loading: false, // 保存按钮的加载状态
        };
    },
    mounted() {
        this.getUsers();
    },
    methods: {
        // 获取用户的信息
        async getUsers(pager = 1) {
            // 默认返回首页
            this.page = pager;
            const { page, limit, searchObj } = this;
            let result = await this.$API.user.getPageList(
                page,
                limit,
                searchObj
            );
            if (result.code == 20000) {
                this.listloading = false;
                const { items, total } = result.data;
                // 过滤admin超级管理员
                this.userList = items.filter((item) => {
                    return item.username != "admin";
                });
                this.total = total - 1;
                this.selectedIds = [];
            }
        },
        // 搜索按钮的回调
        search() {
            this.searchObj = { ...this.tempSearchObj };
            // 获取用户信息
            this.getUsers();
        },
        // 清空按钮的回调
        resetSearch() {
            this.tempSearchObj = { username: "" };
            this.searchObj = { username: "" };
            this.getUsers();
        },
        // 每页显示数据数量的回调
        handleSizeChange(limit) {
            this.limit = limit;
            this.getUsers();
        },
        // 显示添加用户表单
        showAddUser() {
            this.user = {};
            this.dialogUserVisible = true;
            // 清除表单验证结果
            this.$nextTick(() => this.$refs.userForm.clearValidate());
        },
        // 添加或修改用户信息的表单确定按钮回调
        addOrUpdateUser() {
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    const { user } = this;
                    this.userloading = true;
                    let result = await this.$API.user[
                        user.id ? "reqUpdateUser" : "reqAddUser"
                    ](user);
                    if (result.code == 20000) {
                        this.userloading = false;
                        this.$message({
                            type: "success",
                            message: "保存成功",
                        });
                        this.getUsers(user.id ? this.page : 1);
                    } else {
                        this.userloading = false;
                        this.$message({
                            type: "error",
                            message: "保存失败：" + result.message,
                        });
                    }
                    // 初始化当前用户信息 隐藏弹出框
                    this.user = {};
                    this.dialogUserVisible = false;
                }
            });
        },
        // 添加或修改用户信息的表单取消按钮回调
        cancel() {
            this.dialogUserVisible = false;
            this.user = {};
        },
        // 自定义密码校验
        passwordValidator(rule, value, callback) {
            if (!value) {
                callback("用户密码不能为空");
            } else if (!value || value.length < 6) {
                callback("密码长度不能小于6位");
            } else {
                callback();
            }
        },
        // 列表选择项目发生变化的回调
        handleSelectionChange(selection) {
            this.selectedIds = selection.map((item) => item.id);
        },
        // 批量删除用户
        removeUsers() {
            this.$confirm("确定删除吗？")
                .then(async () => {
                    await this.$API.user.reqRemoveUsers(this.selectedIds);
                    this.$message({
                        type: "success",
                        message: "删除成功",
                    });
                    this.getUsers();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消删除",
                    });
                });
        },
        // 显示指定角色的页面
        showAssignRole(row) {
            this.user = row;
            this.dialogRoleVisible = true;
            this.getRoles();
        },
        // 修改某个用户
        showUpdateUser(user) {
            this.user = cloneDeep(user);
            this.dialogUserVisible = true;
        },
        // 删除某个用户
        async removeUser(userid) {
            await this.$API.user.reqRemoveUserById(userid);
            this.$message({
                type: "success",
                message: "删除成功",
            });
            this.getUsers(
                this.userList.length == 1 ? this.page - 1 : this.page
            );
        },
        // 获取指定用户的角色信息
        async getRoles() {
            const result = await this.$API.user.getRoles(this.user.id);
            const { allRolesList, assignRoles } = result.data;
            this.allRoles = allRolesList;
            this.userRoleIds = assignRoles.map(item => item.id);

            this.checkAll = allRolesList.length === assignRoles.length;
            this.isIndeterminate = assignRoles.length > 0 && assignRoles.length < allRolesList.length
        },
        // 全选按钮状态改变
        handleCheckAllChange(value) {
            this.userRoleIds = value ? this.allRoles.map(item => item.id) : [];
            this.isIndeterminate = false;
        },
        // 角色复选按钮状态改变
        handleCheckedChange() {
            const { userRoleIds, allRoles } = this;
            this.checkAll = userRoleIds.length == allRoles.length && allRoles.length > 0;
            this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRoles.length;
        },
        // 请求给用户进行角色授权
        async assignRole() {
            const userId = this.user.id;
            const roleIds = this.userRoleIds.join(",");
            this.loading = true;
            const result = await this.$API.user.reqAssignRole(userId, roleIds);
            this.loading = false;
            this.$message.success(result.message || "角色分配成功");
            this.resetRoleData();
            // 如果修改的是当前登录用户的角色信息 刷新页面
            if (this.$store.getters.name === this.user.username) {
                window.location.reload();
            }
        },
        // 重置弹出框中的角色信息
        resetRoleData() {
            this.dialogRoleVisible = false;
            this.allRoles = [];
            this.userRoleIds = [];
            this.checkAll = false;
            this.isIndeterminate = false;
        },
    },
};
</script>

<style>
</style>
