<template>
    <div>
        <!-- 三级联动的表单 -->
        <el-form :inline="true" class="demo-form-inline" :model="categoryForm">
            <el-form-item label="一级分类">
                <el-select
                    placeholder="请选择"
                    v-model="categoryForm.category1Id"
                    @change="handler1"
                    :disabled="show"
                >
                    <el-option
                        v-for="c1 in list1"
                        :key="c1.id"
                        :value="c1.id"
                        :label="c1.name"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select
                    placeholder="请选择"
                    v-model="categoryForm.category2Id"
                    @change="handler2"
                    :disabled="show"
                >
                    <el-option
                        v-for="c2 in list2"
                        :key="c2.id"
                        :label="c2.name"
                        :value="c2.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select
                    placeholder="请选择"
                    v-model="categoryForm.category3Id"
                    @change="handler3"
                    :disabled="show"
                >
                    <el-option
                        v-for="c3 in list3"
                        :key="c3.id"
                        :label="c3.name"
                        :value="c3.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "CategorySelect",
    data() {
        return {
            // 三级分类的数据
            list1: [],
            list2: [],
            list3: [],
            // 对象收集三级分类选择的id
            categoryForm: {
                category1Id: "",
                category2Id: "",
                category3Id: "",
            },
        };
    },
    props: ["show"],
    mounted() {
        // 组件挂载完毕 获取一级分类的数据
        this.getCategory1List();
    },
    methods: {
        // 请求获取一级分类的数据
        async getCategory1List() {
            let result = await this.$API.attr.reqCategory1List();
            if (result.code == 200) {
                this.list1 = result.data;
            }
        },
        // 一级分类change事件的回调函数
        async handler1() {
            // 清除数据
            this.list2 = [];
            this.list3 = [];
            this.categoryForm.category2Id = "";
            this.categoryForm.category3Id = "";
            const { category1Id } = this.categoryForm;
            this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
            // 请求获取二级分类数据
            let result = await this.$API.attr.reqCategory2List(category1Id);
            if (result.code == 200) {
                this.list2 = result.data;
            }
        },
        // 二级分类change事件的回调函数
        async handler2() {
            // 清除数据
            this.list3 = [];
            this.categoryForm.category3Id = "";
            const { category2Id } = this.categoryForm;
            this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
            // 请求获取三级分类数据
            let result = await this.$API.attr.reqCategory3List(category2Id);
            if (result.code == 200) {
                this.list3 = result.data;
            }
        },
        // 三级分类change事件的回调函数
        handler3() {
            const { category3Id } = this.categoryForm;
            this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
        },
    },
};
</script>

<style></style>
