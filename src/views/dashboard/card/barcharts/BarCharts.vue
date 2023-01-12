<template>
    <!-- 柱状图的容器 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "BarCharts",
    props: ["payTrend"],
    data() {
        return {
            barCharts: null,
        };
    },
    mounted() {
        // 初始化echarts实例
        this.barCharts = echarts.init(this.$refs.charts);
        // 配置ehcarts数据
        this.barCharts.setOption({
            // x轴
            xAxis: {
                show: false,
                type: "category",
            },
            // y轴
            yAxis: {
                show: false,
            },
            series: [
                // 配置柱状图
                {
                    type: "bar",
                    data: [],
                    color: "#d5372f",
                },
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            tooltip: {},
        });
    },
    watch: {
        payTrend() {
            this.barCharts.setOption({
                series: [
                    // 配置柱状图
                    {
                        data: this.payTrend,
                    },
                ],
            });
        },
    },
};
</script>

<style scoped>
.charts {
    height: 100%;
    width: 100%;
}
</style>
