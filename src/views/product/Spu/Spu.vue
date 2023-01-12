<template>
    <div>
        <el-card style="margin: 20px 0px">
            <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
        </el-card>
        <el-card>
            <!-- 主体部分有三种不同界面展示 -->
            <!-- 第一种 展示SPU列表的结构 -->
            <div v-show="scene == 0">
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" style="margin: 0px 0px 5px 0px"
                    @click="addSpu">添加SPU</el-button>
                <el-table style="width: 100%" border :data="spuList">
                    <el-table-column label="序号" type="index" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName" width="width"></el-table-column>
                    <el-table-column label="SPU描述" prop="description" width="width"></el-table-column>
                    <el-table-column label="操作" prop="prop" width="width">
                        <template slot-scope="{ row, $index }">
                            <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku"
                                @click="addSku(row)"></HintButton>
                            <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu"
                                @click="updateSpu(row)"></HintButton>
                            <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu的全部sku列表"
                                @click="handleShow(row)">
                            </HintButton>
                            <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu"
                                    slot="reference"></HintButton>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 10]"
                    @current-change="getSpuList" @size-change="handleSizeChange"
                    layout="prev, pager, next, jumper, ->, sizes, total" style="text-align: center"></el-pagination>
            </div>
            <!-- 添加或修改SPU的页面结构 -->
            <SpuForm v-show="scene == 1" ref="spu" @changeScene="changeScene"></SpuForm>
            <!-- 添加SKU的页面结构 -->
            <SkuForm v-show="scene == 2" ref="sku" @changeSceneSku="changeSceneSku"></SkuForm>
        </el-card>
        <!-- 对话框 sku Table -->
        <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible"
            @before-close="handlerDialogClose">
            <el-table :data="skuList" style="width: 100%" border v-loading="loading">
                <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
                <el-table-column prop="price" label="价格" width="width"></el-table-column>
                <el-table-column prop="weight" label="重量" width="width"></el-table-column>
                <el-table-column label="默认图片" width="width">
                    <template slot-scope="{row, $index}">
                        <img :src="row.skuDefaultImg" style="height: 100px; width: 100px" />
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import SpuForm from "./SpuForm/SpuForm.vue";
import SkuForm from "./SkuForm/SkuForm.vue"
export default {
    name: "Spu",
    components: { SpuForm, SkuForm },
    data() {
        return {
            scene: 0, // 三种结构展示的信号 0代表展示SPU列表数据 1代表添加SPU或修改SPU的结构 2代表添加SKU的结构
            category1Id: "",
            category2Id: "",
            category3Id: "",
            page: 1,
            limit: 3,
            total: 0,
            spuList: [],
            dialogTableVisible: false,  // 控制弹出的表格对话框显示与隐藏
            spu: {},
            skuList: [],
            loading: true, // 控制表格加载的动画
        };
    },
    mounted() { },
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
                this.getSpuList();
            }
        },
        // 获取SPU数据
        async getSpuList(pages = 1) {
            this.page = pages;
            const { page, limit, category3Id } = this;
            let result = await this.$API.spu.reqSpuList(
                page,
                limit,
                category3Id
            );
            if (result.code == 200) {
                this.spuList = result.data.records;
                this.total = result.data.total;
            }
        },
        // 自定义每页显示数量发生改变
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSpuList();
        },
        // 自定义事件的回调 切换显示页面
        changeScene({ scene, flag }) {
            // scene区分目标切换的界面
            // flag是区分修改spu还是添加spu的回调
            this.scene = scene;
            if (flag == "修改") {
                // 再次获取最新的数据进行展示
                this.getSpuList(this.page);
            } else {
                this.getSpuList();
            }
        },
        // 修改Spu
        updateSpu(row) {
            this.scene = 1;
            // 在父组件中通过$refs获取子组件
            this.$refs.spu.initSpuData(row);
        },
        // 点击添加SPU按钮的回调
        addSpu() {
            // 切换为编辑spu场景的界面
            this.scene = 1;
            // 通知子组件SpuForm发送两个请求
            this.$refs.spu.addSpuData(this.category3Id);
        },
        // 删除SPU按钮的回调
        async deleteSpu(row) {
            let result = await this.$API.spu.reqDeleteSpu(row.id);
            if (result.code == 200) {
                this.$message({
                    type: "success",
                    message: "删除成功",
                })
                this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1);
            }
        },
        // 添加sku按钮的回调
        addSku(row) {
            // 切换为sku编辑的场景
            this.scene = 2;
            this.$refs.sku.getData(this.category1Id, this.category2Id, row);
        },
        // 添加sku界面的更改界面回调
        changeSceneSku(scene) {
            this.scene = scene;
        },
        // 查看sku按钮的回调
        async handleShow(spu) {
            // 显示表格弹出框
            this.dialogTableVisible = true
            this.spu = spu;
            // 请求获取spu的skuList数据进行展示
            let result = await this.$API.spu.reqSkuList(spu.id);
            if (result.code == 200) {
                this.skuList = result.data;
                this.loading = false; // 停止表格的加载动画
            }
        },
        // 关闭对话框的回调
        handlerDialogClose(done) {
            // 初始化中间的变量
            this.spu = {};
            this.skuList = [];
            this.loading = true;
            // 关闭弹出框
            done();
        }
    },
};
</script>

<style>
</style>
