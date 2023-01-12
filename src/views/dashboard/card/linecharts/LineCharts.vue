<template>
    <!-- 绘图容器 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts"
export default {
    name: "LineChart",
    props: ["visitTrend"],
    data() {
        return {
            lineCharts: null,
        }
    },
    mounted() {
        this.lineCharts = echarts.init(this.$refs.charts);
        this.lineCharts.setOption({
            // 配置绘图的x轴和y轴
            xAxis: {
                show: false,
                type: "category",
            },
            yAxis: {
                show: false,
            },
            // 配置绘图的类型和参数
            series: [
                {
                    type: "line",
                    data: this.visitTrend,
                    itemStyle: {
                        opacity: 0,
                    },
                    lineStyle: {
                        color: "purple",
                    },
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "purple",
                                },
                                {
                                    offset: 1,
                                    color: "#fff",
                                }
                            ],
                            global: false,
                        }
                    },
                }
            ],
            // 配置绘图的大小
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            }
        })
    },
    watch: {
        // 监视获取到visitTrend数据后进行展示
        visitTrend() {
            this.lineCharts.setOption({
                // 配置绘图的类型和参数
                series: [
                    {
                        data: this.visitTrend,
                    }
                ],
            })
        }
    }
}
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>