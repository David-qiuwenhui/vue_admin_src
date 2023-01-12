<template>
    <div>
        <el-card style="margin: 20px 0px">
            <CategorySelect
                @getCategoryId="getCategoryId"
                :show="!isShowTable"
            ></CategorySelect>
        </el-card>
        <el-card>
            <!-- 展示平台属性 -->
            <div v-show="isShowTable">
                <!-- 添加属性按钮 -->
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :disabled="!category3Id"
                    @click="addAttr"
                    >添加属性</el-button
                >
                <!-- 表格展示平台属性 -->
                <el-table border style="width: 100%" :data="attrList">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="attrName"
                        label="属性名称"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        prop="prop"
                        label="属性值列表"
                        width="width"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-tag
                                type="success"
                                v-for="(attrValue, index) in row.attrValueList"
                                :key="attrValue.id"
                                style="margin: 0px 5px"
                                >{{ attrValue.valueName }}</el-tag
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        label="操作"
                        width="200"
                        align="center"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-button
                                type="warning"
                                icon="el-icon-edit"
                                size="mini"
                                @click="updateAttr(row)"
                                >编辑</el-button
                            >
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加或修改平台属性 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input
                            placeholder="请输入属性名"
                            v-model="attrInfo.attrName"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addAttrValue"
                    :disabled="!attrInfo.attrName"
                    >添加属性值
                </el-button>
                <el-button @click="isShowTable = true">取消</el-button>
                <el-table
                    style="width: 100%; margin: 20px 0px"
                    border
                    width="width"
                    :data="attrInfo.attrValueList"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="prop"
                        label="属性值名称"
                        width="width"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-input
                                v-model="row.valueName"
                                placeholder="请输入属性值名称"
                                size="mini"
                                v-if="row.edit"
                                @blur="toWatchMode(row)"
                                @keyup.native.enter="toWatchMode(row)"
                                :ref="$index"
                            ></el-input>
                            <span
                                v-else
                                @click="toEditMode(row, $index)"
                                style="display: block"
                            >
                                {{ row.valueName }}</span
                            >
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{ row, $index }">
                            <el-popconfirm
                                :title="`确定删除${row.valueName}吗？`"
                                @onConfirm="deleteAttrValue($index)"
                            >
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    slot="reference"
                                ></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                    type="primary"
                    @click="addOrUpdateAttr"
                    :disabled="attrInfo.attrValueList.length < 1"
                    >保存</el-button
                >
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "Attr",
    data() {
        return {
            category1Id: "",
            category2Id: "",
            category3Id: "",
            attrList: [], // 平台属性数据
            isShowTable: true,
            attrInfo: {
                attrName: "",
                attrValueList: [],
                categoryId: 0,
                categoryLevel: 3,
            },
        };
    },
    methods: {
        // CategorySelect自定义事件的回调
        getCategoryId({ categoryId, level }) {
            // 区分三级分类的id
            if (level == 1) {
                this.category1Id = categoryId;
                this.category2Id = "";
                this.category3Id = "";
            } else if (level == 2) {
                this.category2Id = categoryId;
                this.category3Id = "";
            } else if (level == 3) {
                this.category3Id = categoryId;
                // 发送请求获取平台属性的数据
                this.getAttrList();
            }
        },
        // 发送请求获取平台属性的数据
        async getAttrList() {
            const { category1Id, category2Id, category3Id } = this;
            let result = await this.$API.attr.reqAttrList(
                category1Id,
                category2Id,
                category3Id
            );
            if (result.code == 200) {
                this.attrList = result.data;
            }
        },
        // 添加属性按钮的回调 跳转至编辑模式
        addAttr() {
            // 切换table显示与隐藏
            this.isShowTable = false;
            // 清除数据 传送三级分类的id
            this.attrInfo = {
                attrName: "",
                attrValueList: [],
                categoryId: this.category3Id,
                categoryLevel: 3,
            };
        },
        // 编辑某一个平台属性按钮的回调
        updateAttr(row) {
            this.isShowTable = false; // 切换至编辑模式页面
            this.attrInfo = cloneDeep(row); // 深拷贝 不影响原本的数据显示
            // this.$set()为对象新增并设置响应式数据
            this.attrInfo.attrValueList.forEach((item) => {
                this.$set(item, "edit", false);
            });
        },
        // 添加属性值 编辑模式
        addAttrValue() {
            this.attrInfo.attrValueList.push({
                attrId: this.attrInfo.id,
                valueName: "",
                edit: true,
            });
            this.$nextTick(() => {
                this.$refs[this.attrInfo.attrValueList.length - 1].focus();
            });
        },
        // 编辑页面的属性值变为浏览模式
        toWatchMode(row) {
            // 检查输入的属性值是否是空格
            if (row.valueName.trim() == "") {
                this.$message("请勿输入空格字符串");
                row.valueName = "";
                return;
            }
            let isReapt = this.attrInfo.attrValueList.some((item) => {
                if (row !== item) {
                    return row.valueName == item.valueName;
                }
            });
            // 检查是否输入重复的属性值
            if (isReapt) {
                this.$message("请勿输入重复的属性值");
                return;
            }
            row.edit = false;
        },
        // 编辑页面的属性值变为编辑模式 点击Span的回调函数
        toEditMode(row, index) {
            row.edit = true;
            // $nextTick等到input节点渲染完成后 执行一次函数
            this.$nextTick(() => {
                // 获取相应的input表单元素实现聚焦
                this.$refs[index].focus();
            });
        },
        // 删除属性值
        deleteAttrValue(index) {
            this.attrInfo.attrValueList.splice(index, 1);
        },
        // 编辑页面的保存按钮回调函数
        async addOrUpdateAttr() {
            // 过滤获取有效的属性值列表 且不携带edit参数发送给服务器
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
                (item) => {
                    // 过滤掉属性值为空的属性
                    if (item.valueName != "") {
                        // 删除edit属性
                        delete item.edit;
                        return true;
                    }
                }
            );
            // 向服务器发送新增或更新属性值的请求
            // 并将更新页面数据 将页面转换至浏览模式
            try {
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                this.isShowTable = true;
                this.$message({
                    type: "success",
                    message: "保存成功",
                });
                // 再次发送请求获取最新的属性列表数据进行展示
                this.getAttrList();
            } catch (error) {
                this.$message({
                    type: "warning",
                    message: "保存失败",
                });
            }
        },
    },
};
</script>

<style></style>
