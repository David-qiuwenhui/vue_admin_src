<template>
    <el-card>
        <div class="header" slot="header">
            <div class="search-header">
                <span>线上热门搜索</span>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>黄金糕</el-dropdown-item>
                        <el-dropdown-item>狮子头</el-dropdown-item>
                        <el-dropdown-item>螺蛳粉</el-dropdown-item>
                        <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                        <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div>
            <el-row>
                <el-col :span="12">
                    <LineCharts></LineCharts>
                </el-col>
                <el-col :span="12">
                    <LineCharts></LineCharts>
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%" border header-align="center">
                <el-table-column label="排名" type="index" width="80" align="center"></el-table-column>
                <el-table-column label="搜索关键字" prop="word" align="center"></el-table-column>
                <el-table-column label="用户数" prop="user" sortable align="center"></el-table-column>
                <el-table-column label="周涨幅" prop="count" sortable align="center"></el-table-column>
            </el-table>
            <el-pagination :total="total" :current-page="page" :page-size="limit" layout="prev, pager, next"
                style="text-align: center">
            </el-pagination>
        </div>
    </el-card>

</template>

<script>
import LineCharts from './linecharts/LineCharts.vue';
import { mapState } from 'vuex';
export default {
    name: "Search",
    components: { LineCharts },
    data() {
        return {
            tableData: [{}],
            total: 1000,
            page: 1,
            limit: 3,
        }
    },
    computed: {
        ...mapState({
            searchWord: (state) => {
                return state.home.list.searchWord;
            }
        })
    },
    watch: {
        searchWord() {
            this.tableData = this.searchWord.slice(0, 6);
        }
    }
}
</script>

<style scoped>
.header {
    border-bottom: 1px solid #eee;
    padding: 5px 0px;
}

.search-header {
    display: flex;
    justify-content: space-between;
}
</style>