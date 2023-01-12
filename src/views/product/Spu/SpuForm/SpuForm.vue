<template>
    <div>
        <el-form :model="spuInfo" label-width="80px">
            <el-form-item label="SPU名称">
                <el-input v-model="spuInfo.spuName" placeholder="SPU名称"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
                    <el-option v-for="(trademark, index) in trademarkList" :key="trademark.id" :value="trademark.id"
                        :label="trademark.tmName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input v-model="spuInfo.description" placeholder="描述" type="textarea" rows="4"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess"
                    :file-list="spuImageList">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}个属性未被选择`" v-model="attrIdAndArrName">
                    <el-option v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id" :label="unselect.name"
                        :value="`${unselect.id}:${unselect.name}`"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndArrName" @click="addSaleAttr">添加销售属性
                </el-button>
                <el-table :data="spuInfo.spuSaleAttrList" border style="width: 100%">
                    <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                    <el-table-column label="属性名" prop="saleAttrName" width="width"></el-table-column>
                    <el-table-column label="属性值名称列表" prop="prop" width="width"><template slot-scope="{ row, $index }">
                            <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" closable
                                :disable-transitions="false" @close="
                                    row.spuSaleAttrValueList.splice(index, 1)
                                ">{{ tag.saleAttrValueName }}</el-tag>
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                                ref="saveTagInput" size="small" @blur="handleInputConfirm(row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="prop" width="width"><template slot-scope="{ row, $index }">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="
                                spuInfo.spuSaleAttrList.splice($index, 1)
                            "></el-button>
                        </template></el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "SpuForm",
    data() {
        return {
            spuInfo: {
                category3Id: 0,
                description: "",
                spuName: "",
                tmId: "",
                spuImageList: [],
                spuSaleAttrList: [],
            },
            trademarkList: [],
            spuImageList: [],
            saleAttrList: [],
            attrIdAndArrName: "",
            dialogImageUrl: "",
            dialogVisible: false,
        };
    },
    computed: {
        // 计算出还未选择的销售属性
        unSelectSaleAttr() {
            // 采用数组过滤和测试的方式计算出未选择的属性数组
            return this.saleAttrList.filter((item) => {
                return this.spuInfo.spuSaleAttrList.every((item2) => {
                    return item2.saleAttrName != item.name;
                });
            });
        },
    },
    methods: {
        // 点击修改按钮时 客户端向服务器发送四个请求
        async initSpuData(spu) {
            // 获取spu的数据
            let spuResult = await this.$API.spu.reqSpuInfo(spu.id);
            if (spuResult.code == 200) {
                this.spuInfo = spuResult.data;
            }
            // 获取spu品牌的信息
            let trademarkListResult = await this.$API.spu.reqTrademarkList();
            if (trademarkListResult.code == 200) {
                this.trademarkList = trademarkListResult.data;
            }
            // 获取spu图片的数据
            let spuImageListResult = await this.$API.spu.reqSpuImageList(
                spu.id
            );
            if (spuImageListResult.code == 200) {
                let listArr = spuImageListResult.data;
                // 照片墙显示图片的数据是数组 数组里的元素需要name和url字段
                // 需要将服务器返回的数据进行修改
                listArr.forEach((item) => {
                    item.name = item.imgName;
                    item.url = item.imgUrl;
                });
                this.spuImageList = listArr;
            }
            // 获取平台的spu销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data;
            }
        },
        // 添加新的SPU属性
        async addSpuData(category3Id) {
            // 添加SPU时收集category3Id的属性
            this.spuInfo.category3Id = category3Id;
            // 获取spu品牌的信息
            let trademarkListResult = await this.$API.spu.reqTrademarkList();
            if (trademarkListResult.code == 200) {
                this.trademarkList = trademarkListResult.data;
            }
            // 获取平台的spu销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data;
            }
        },
        // 照片墙图片预览的回调
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url; // 将预览图片的url赋值给对话框
            this.dialogVisible = true; // 显示对话框
        },
        // 照片墙删除某个图片的回调
        handleRemove(file, fileList) {
            // 对于照片墙上的图片 由于显示需要 每个图片都有url name的字段
            // 对于服务器而言 不需要url name字段 将来对于有的图片的数据提交给服务器时 需要进行处理
            this.spuImageList = fileList;
        },
        // 照片墙单张图片上传成功的回调
        handleSuccess(response, file, fileList) {
            this.spuImageList = fileList;
        },
        // 给spu添加新的销售属性
        addSaleAttr() {
            // 整理新的销售属性数据
            const [baseSaleAttrId, saleAttrName] = this.attrIdAndArrName.split(":");
            let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
            // 新增到spuSaleAttrList列表进行数据展示
            this.spuInfo.spuSaleAttrList.push(newSaleAttr);
            this.attrIdAndArrName = "";
        },
        // 添加新的属性值按钮的回调
        addSaleAttrValue(row) {
            // inputVisible属性控制button与input框的切换
            this.$set(row, "inputVisible", true);
            // inputValue收集新增的销售属性值
            this.$set(row, "inputValue", "");
        },
        // el-input失焦的事件回调函数
        handleInputConfirm(row) {
            const { baseSaleAttrId, inputValue } = row;
            //  判断输入是否为空格
            if (inputValue.trim() == "") {
                this.$message("属性值不能为空");
                return;
            }
            // 判断是否重复输入
            let result = row.spuSaleAttrValueList.every((item) => {
                return item.saleAttrValueName != inputValue;
            })
            if (!result) {
                this.$message("属性值有重复");
                return;
            }
            // 将新的属性值保存至row.spuSaleAttrValueList
            let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
            row.spuSaleAttrValueList.push(newSaleAttrValue);
            row.inputVisible = false;
        },
        // 保存按钮的回调函数
        async addOrUpdateSpu() {
            this.spuInfo.spuImageList = this.spuImageList.map((item) => {
                return {
                    imageName: item.name,
                    imageUrl: (item.response && item.response.data) || item.url,
                }
            });
            let result = await this.$API.spu.reqAddOrUpdateAttr(this.spuInfo);
            if (result.code == 200) {
                this.$message({
                    type: "success",
                    message: "保存成功"
                })
                this.$emit('changeScene', { scene: 0, flag: this.spuInfo.id ? '修改' : '添加' });
            } else {
                alert(result.message);
            }
            // 清除data响应式数据
            Object.assign(this._data, this.$options.data());
        },
        // 点击取消按钮的回调
        handleCancel() {
            this.$emit('changeScene', { scene: 0, flag: '' });
            // 清除data响应式数据
            Object.assign(this._data, this.$options.data());
        }
    },
};
</script>

<style>
</style>
