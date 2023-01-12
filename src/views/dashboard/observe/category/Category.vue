<template>
    <el-card>
        <div class="header">
            <div class="category-header">
                <span>销售额类别占比</span>
                <el-radio-group v-model="radioValue" size="mini">
                    <el-radio-button label="全部渠道" border></el-radio-button>
                    <el-radio-button label="线上" border></el-radio-button>
                    <el-radio-button label="门店" border></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="charts" ref="charts"></div>
    </el-card>
</template>

<script>
import * as echarts from "echarts"
import { mapState } from "vuex";
export default {
    name: "Category",
    data() {
        return {
            radioValue: "全部渠道",
            categoryData: [], // 暂存需要显示的图标数据
            pieCharts: null,
        }
    },
    mounted() {
        this.pieCharts = echarts.init(this.$refs.charts);
        this.pieCharts.setOption({
            title: {
                text: "全部渠道",
                subtext: null,
                left: "center",
                top: "center",
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: "#fff",
                        borderWidth: 2,
                    },
                    labelLine: {
                        show: true,
                    },
                    data: [{}],
                }
            ]
        });
        this.pieCharts.on('mouseover', (params) => {
            // 获取鼠标移上去的对象数据
            const { name, value } = params.data;
            // 重新设置图表的标题
            this.pieCharts.setOption({
                title: {
                    text: name,
                    subtext: value,
                }
            })
        });
    },
    computed: {
        // 从vuex获取线上和门店的销售数据
        ...mapState({
            saleRank: (state) => {
                return state.home.list.saleRank;
            }
        }),
        // 计算线上的销售数据
        onlineRank() {
            let onlineRank = [];
            const n = this.saleRank.online.name.length;
            for (let i = 0; i < n; i++) {
                onlineRank.push({ value: this.saleRank.online.value[i], name: this.saleRank.online.name[i] });
            }
            return onlineRank;
        },
        // 计算门店的销售数据
        shopRank() {
            let shopRank = [];
            const n = this.saleRank.shop.name.length;
            for (let i = 0; i < n; i++) {
                shopRank.push({ value: this.saleRank.shop.value[i], name: this.saleRank.shop.name[i] });
            }
            return shopRank;
        },
        // 计算全部渠道的销售数据
        shopAndOnlineRank() {
            let shopAndOnlineRank = [];
            let n = this.onlineRank.length;
            for (let i = 0; i < n; i++) {
                shopAndOnlineRank.push({ value: this.onlineRank[i].value + this.shopRank[i].value, name: this.onlineRank[i].name })
            }
            return shopAndOnlineRank;
        }
    },
    watch: {
        // 监测获取到销售数据
        saleRank() {
            this.categoryData = this.shopAndOnlineRank;
        },
        // 监测单选框的值发生变化
        radioValue() {
            if (this.radioValue == "全部渠道") {
                this.categoryData = this.shopAndOnlineRank;
            } else if (this.radioValue == "线上") {
                this.categoryData = this.onlineRank;
            } else {
                this.categoryData = this.shopRank;
            }
        },
        // 监测到categoryData的数据发生变化
        categoryData() {
            this.pieCharts.setOption({
                title: {
                    text: this.radioValue,
                    subtext: null,
                    left: "center",
                    top: "center",
                },
                series: [
                    {
                        data: this.categoryData,
                    }
                ]
            });
        }
    }
}
</script>

<style scoped>
.header {
    border-bottom: 1px solid #eee;
}

.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.charts {
    width: 100%;
    height: 450px;
}
</style>