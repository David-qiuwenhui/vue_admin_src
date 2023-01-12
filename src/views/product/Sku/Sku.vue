<template>
  <div>
    <el-table :data="records" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column label="名称" prop="skuName" width="width"></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110px">
        <template slot-scope="{row, $index}">
          <img :src="row.skuDefaultImg" style="width:80px; height:80px;" />
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="80px"></el-table-column>
      <el-table-column label="价格" prop="price" width="80px"></el-table-column>
      <el-table-column label="操作" prop="prop" width="width">
        <template slot-scope="{row, $index}">
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-if="row.isSale == 0" @click="itemSale(row)">
          </el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-else @click="itemCancelSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination :total="total" :current-page="page" :page-size="pages" :page-sizes="[3, 5, 10]" :pager-count="7"
      layout="prev, pager, next, jumper, ->, sizes, total" style="text-align: center"
      @current-change="handleCurrentChange" @size-change="handleSizeChange">
    </el-pagination>
    <el-drawer :visible.sync="drawer" direction="rtl" size="50%" :show-close="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="(attrValue, index) in skuInfo.skuAttrValueList" :key="attrValue.id">
              {{ attrValue.attrId }} -- {{ attrValue.valueId }}
            </el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, // 当前页码
      limit: 3, // 每页显示数据的数量
      total: 0, // 总共的数据数量
      pages: 0, // 总共的页数
      records: [], // skuList
      skuInfo: {},  // sku的详细信息
      drawer: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 请求获取sku列表数据
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
        this.pages = result.data.pages;
      }
    },
    // 当前页改变的回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList(page);
    },
    // 每页显示条数变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // sku上架按钮的回调
    async itemSale(row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({
          type: "success",
          message: "上架成功"
        })
      }
    },
    // sku下架的回调
    async itemCancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result == 200) {
        row.isSale = 0;
        this.$message({
          type: "success",
          message: "下架成功"
        })
      }
    },
    // edit编辑按钮的回调
    handleEdit() {
      this.$message("正在开发中");
    },
    // 获取skuInfo数据
    async getSkuInfo(row) {
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
        // 展示skuInfo抽屉
        this.drawer = true;
      }
    },

  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}

.el-tag {
  margin: 5px;
}

>>>.el-carousel__button {
  width: 10px;
  height: 10px;
  background: blue;
  border-radius: 50%;
}
</style>
