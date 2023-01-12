<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="dialogShow"
      >添加</el-button
    >
    <!-- 表单 -->
    <el-table style="width: 100%" border :data="tradeList">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }"
          ><img
            :src="row.logoUrl"
            style="width: 100px; height: 100px" /></template
      ></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getTradeMarkList"
      @size-change="handleSizeChange"
    ></el-pagination>

    <!-- 对话框表单 -->
    <el-dialog
      :title="tradeForm.id != undefined ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogVisible"
    >
      <el-form
        :model="tradeForm"
        style="width: 80%"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tradeForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tradeForm.logoUrl"
              :src="tradeForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // tmName的自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      page: 1, // 分页器当前页数
      limit: 3, // 当前页数展示的数据数量
      total: 0, // 数据的总数量
      tradeList: [], // 展示的品牌数据列表
      dialogVisible: false,
      tradeForm: {
        tmName: "",
        logoUrl: "",
      },
      // 弹出框表单的校验规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌的名称", trigger: "blur" },
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  mounted() {
    // 挂载完成后获取品牌列表数据
    this.getTradeMarkList();
  },
  methods: {
    // 异步请求获取品牌列表数据
    async getTradeMarkList(pager = 1) {
      this.page = pager;
      // 结构发送请求的参数
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.tradeList = result.data.records;
      } else {
        alert(result.message);
      }
    },
    // 处理分页器当前显示数据的数量改变
    handleSizeChange(size) {
      this.limit = size;
      this.getTradeMarkList();
    },
    // 点击添加品牌的按钮
    dialogShow() {
      this.dialogVisible = true;
      this.tradeForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      // 验证图片的类型和大小
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 <= 2;
      if (!isJPG) this.$message.error("上传的图片只是能JPG/PNG格式");
      if (!isLt2M) this.$message.error("上传的图片大小不能超过2MB");
      return isJPG && isLt2M;
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.tradeForm.logoUrl = res.data; // 更改成服务器返回的图片链接
    },
    // 请求发送新增或修改的信息到服务器
    async addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tradeForm
          );
          if (result.code == 200) {
            this.$message({
              message: this.tradeForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            this.getTradeMarkList(this.tradeForm.id ? this.page : 1);
          }
        } else {
          console.log("Error Submit!");
          return false;
        }
      });
    },
    // 修改某一个品牌的信息
    updateTradeMark(row) {
      this.dialogVisible = true;
      this.tradeForm = { ...row }; // 浅拷贝品牌信息给弹出框的表单 若修改表单信息不提交 页面信息不会改变
    },
    // 删除某个品牌的信息
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getTradeMarkList(
              // 如果原本当前页只剩下一个数据 删除后请求获取上一页的数据
              this.tradeList.length > 1 ? this.page : this.page - 1
            );
          }
        })
        .catch(() => {
          // 用户点击取消删除按钮
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
