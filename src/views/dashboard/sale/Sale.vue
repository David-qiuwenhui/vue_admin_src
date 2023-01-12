<template>
    <el-card style="margin: 10px 0px">
        <div class="clearfix" slot="header">
            <el-tabs class="tab" v-model="activeName">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visited"></el-tab-pane>
            </el-tabs>
            <!-- 右上角的功能栏 -->
            <div class="right">
                <span @click="setDay">今日</span>
                <span @click="setWeek">本周</span>
                <span @click="setMonth">本月</span>
                <span @click="setYear">本年</span>
                <!-- 日期选择器 -->
                <el-date-picker class="data" v-model="dataValue" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" size="mini">
                </el-date-picker>
            </div>
        </div>
        <div>
            <el-row :gutter="10">
                <el-col :span="18">
                    <div class="charts" ref="charts"></div>
                </el-col>
                <el-col :span="6" class="rightContent">
                    <h3>门店{{ title }}排名</h3>
                    <ul>
                        <li v-for="orderItem in rankList" :key="orderItem.no">
                            <span :class="orderItem.no <= 3 ? 'rindex' : null">{{ orderItem.no }}</span>
                            <span>{{ orderItem.name }}</span>
                            <span class="rvalue">￥{{ orderItem.money }}</span>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>

    </el-card>
</template>

<script>
import * as echarts from "echarts"
import dayjs from "dayjs"
import { mapState } from "vuex"
export default {
    name: "Sale",
    data() {
        return {
            activeName: "sale", // 收集动态的tab名称
            dataValue: [], // 收集日历的数据
            barCharts: null, // 柱状图
            rankList: [{}],
        }
    },
    mounted() {
        // 配置柱状图实例
        this.barCharts = echarts.init(this.$refs.charts);
        this.barCharts.setOption({
            title: {
                text: this.title + "趋势",
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }
            ]
        })
    },
    computed: {
        // 标题（计算属性）
        title() {
            return this.activeName == "sale" ? "销售额" : "访问量";
        },
        /** 
        title: {
            get() {
                return this.activeName == "sale" ? "销售额" : "访问量";
            },
            set(value) {
                console.log(value);
            }
        },
        */
        // 向服务器请求图表的数据
        ...mapState({
            listState: (state) => {
                return state.home.list;
            }
        }),
        // 门店销售额排名
        orderRank() {
            return this.listState.orderRank;
        },
        // 门店访问量排名
        userRank() {
            return this.listState.userRank
        }
    },
    methods: {
        setDay() {
            const day = dayjs().format("YYYY-MM-DD");
            this.dataValue = [day, day];
            // console.log(day.js())
            console.log(day);
        },
        setWeek() {
            const start = dayjs().day(1).format("YYYY-MM-DD");
            const end = dayjs().day(7).format("YYYY-MM-DD");
            this.dataValue = [start, end];
        },
        setMonth() {
            const start = dayjs().startOf("month").format("YYYY-MM-DD");
            const end = dayjs().endOf("month").format("YYYY-MM-DD");
            this.dataValue = [start, end];
        },
        setYear() {
            const start = dayjs().startOf("year").format("YYYY-MM-DD");
            const end = dayjs().endOf("year").format("YYYY-MM-DD");
            this.dataValue = [start, end];
        },
    },
    watch: {
        // tab标签栏发生变化
        activeName() {
            // 更新ranklist数据
            this.rankList = this.activeName == "sale" ? this.orderRank : this.userRank;
            // 更新柱状图的数据
            this.barCharts.setOption({
                title: {
                    text: this.title + "趋势",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.activeName == "sale" ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.activeName == "sale" ? this.listState.orderFullYear : this.listState.userFullYear,
                    }
                ]
            })
        },
        // 监听mock数据listState是否接收到
        listState() {
            this.barCharts.setOption({
                title: {
                    text: this.title + "趋势",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.listState.orderFullYearAxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.listState.orderFullYear,
                    }
                ]
            })
        },
        orderRank() {
            this.rankList = this.orderRank;
        }
    },

}
</script>

<style scoped>
.clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
}

.tab {
    width: 100%;
}

.right {
    position: absolute;
    right: 0px;
}

.data {
    width: 250px;
    margin: 0px 20px;
}

.right span {
    margin: 0px 10px;
}

.charts {
    width: 100%;
    height: 300px;
}

ul {
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0px;
}

ul li {
    height: 8%;
    margin: 10px 0px;
}

ul li span {
    margin: 0px 10px;
}

.rindex {
    float: left;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: black;
    color: white;
    text-align: center;
}

.rvalue {
    float: right;
}
</style>