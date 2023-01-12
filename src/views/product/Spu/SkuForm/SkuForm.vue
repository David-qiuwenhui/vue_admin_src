<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
            <el-form-item label="SKU名称">
                <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input type="number" placeholder="价格(元)" v-model="skuInfo.price"></el-input>
            </el-form-item>
            <el-form-item label="重量(千克)">
                <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form :inline="true" label-width="80px">
                    <el-form-item v-for="(attr, index) in attrInfoList" :key="attr.id" :label="attr.attrName">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                            <el-option v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id"
                                :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form :inline="true" label-width="80px">
                    <el-form-item v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id"
                        :label="saleAttr.saleAttrName">
                        <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
                            <el-option v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                                :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName"
                                :value="`${saleAttr.id}:${saleAttrValue.id}`"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表">
                <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="80px"></el-table-column>
                    <el-table-column label="图片" width="width" prop="prop">
                        <template slot-scope="{row, $index}">
                            <img :src="row.imgUrl" style="width: 100px;height: 100px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" width="width" prop="imgName"></el-table-column>
                    <el-table-column label="操作" width="width" prop="prop">
                        <template slot-scope="{row, $index}">
                            <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认
                            </el-button>
                            <el-button v-else>默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSave">保存</el-button>
                <el-button @click="changeDefault">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "SkuForm",
    data() {
        return {
            // 收集添加的sku数据 将来发给服务器
            skuInfo: {
                // 从父组件获取
                category3Id: 0,
                spuId: 0,
                tmId: 0,
                // 用户输入的属性
                skuName: "",
                price: 0,
                weight: 0,
                skuDesc: "",
                // 根据用户选择再计算得到的属性
                skuDefaultImg: "", // 默认的图片地址
                // 平台属性数据
                skuAttrValueList: [
                    // {
                    //     "attrId": 0,
                    //     "valueId": 0,
                    // }
                ],
                // 收集销售属性的数据
                skuSaleAttrValueList: [
                    // {
                    //     "id": 0,
                    //     "saleAttrId": 0,
                    //     "saleAttrName": "string",
                    //     "saleAttrValueId": 0,
                    //     "saleAttrValueName": "string",
                    //     "skuId": 0,
                    //     "spuId": 0
                    // }
                ],
                // 收集图片的字段
                skuImageList: [
                    // {
                    //     "id": 0,
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "isDefault": "string",
                    //     "skuId": 0,
                    //     "spuImgId": 0
                    // }
                ],
            },
            spuImageList: [], // 存储图片的信息
            spuSaleAttrList: [], // 存储销售属性的信息
            attrInfoList: [], // 存储平台属性的信息
            spu: {}, // 收集父组件传来的spu信息
            imageList: [], // 收集table中选择的图片数据
        }
    },
    methods: {
        // 获取skuForm的数据
        async getData(category1Id, category2Id, spu) {
            // 收集父组件传来的数据
            this.skuInfo.category3Id = spu.category3Id;
            this.skuInfo.spuId = spu.id;
            this.skuInfo.tmId = spu.tmId;
            this.spu = spu;
            // 获取spu图片的数据
            let spuImageListResult = await this.$API.spu.reqSpuImageListSku(spu.id);
            if (spuImageListResult.code == 200) {
                let list = spuImageListResult.data;
                list.forEach((item) => {
                    return item.isDefault = 0;
                });
                this.spuImageList = list;
            }
            // 获取销售属性的数据
            let spuSaleAttrListResult = await this.$API.spu.reqSpuSaleAttrList(spu.id);
            if (spuSaleAttrListResult.code == 200) {
                this.spuSaleAttrList = spuSaleAttrListResult.data;
            }
            // 获取平台属性的数据
            let attrInfoListResult = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id);
            if (attrInfoListResult.code == 200) {
                this.attrInfoList = attrInfoListResult.data;
            }
        },
        // table图片列表中复选框的选择发生变化 传入params参数为当前选择的选项数组
        handleSelectionChange(params) {
            this.imageList = params;
        },
        // 选择唯一的默认图片后的排他操作
        changeDefault(row) {
            // 图片列表的所有元素isDefault字段设置为0
            this.spuImageList.forEach((item) => {
                item.isDefault = 0;
            })
            // 当前选择的图片isDefault字段设置为1
            row.isDefault = 1;
            // 收集默认图片的地址
            this.skuInfo.skuDefaultImg = row.imgUrl;
        },
        // 取消按钮的回调 切换界面至场景0
        handleCancel() {
            this.$emit('changeSceneSku', 0);
            // 清空数据
            Object.assign(this._data, this.$options.data());
        },
        // 提交按钮的回调 整理参数发送添加的sku数据给服务器
        async handleSave() {
            const { attrInfoList, spuSaleAttrList, imageList, skuInfo } = this;
            // 整理平台属性的数据
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
                if (item.attrIdAndValueId) {
                    const [attrId, valueId] = item.attrIdAndValueId.split(":");
                    prev.push({ attrId, valueId });
                }
                return prev;
            }, []);
            // 整理销售属性的数据
            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
                if (item.attrIdAndValueId) {
                    const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(":");
                    prev.push({ saleAttrId, saleAttrValueId });
                }
                return prev;
            }, [])
            // 整理图片的数据
            skuInfo.skuImageList = imageList.map((item) => {
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id,
                }
            })
            // 向服务器发送添加的sku数据
            let result = await this.$API.spu.reqAddSku(skuInfo);
            if (result.code == 200) {
                // 消息提示
                this.$message({
                    type: "success",
                    message: "添加成功"
                });
                // 切换界面是场景0
                this.$emit('changeSceneSku', 0);
                // 清空数据
                Object.assign(this._data, this.$options.data());
            } else {
                this.$message({
                    type: "warning",
                    message: result.message,
                })
            }
        }
    }
};
</script>

<style>
</style>
