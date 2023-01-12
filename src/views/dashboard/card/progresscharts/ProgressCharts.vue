<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts"
export default {
    name: "ProgressCharts",
    props: ["activityRate"],
    data() {
        return {
            progressCharts: null,
        }
    },
    mounted() {
        // 初始化echarts实例
        this.progressCharts = echarts.init(this.$refs.charts);
        // 配置echarts数据
        this.progressCharts.setOption({
            // x轴
            xAxis: {
                show: false,
                // 最小值和最大值设置
                min: 0,
                max: 100,
            },
            // y轴
            yAxis: {
                show: false,
                type: "category",
            },
            series: [
                // 配置柱状图
                {
                    type: "bar",
                    data: [],
                    color: "green",
                    barWidth: 10,
                    showBackground: true,
                    backgroundStyle: {
                        color: "#eeeeee",
                    },
                    label: {
                        show: true,
                        formatter: "|",
                        position: "right",
                        distance: "0",
                    }
                }
            ],
            // 配置布局
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            }
        })
    },
    watch: {
        activityRate() {
            this.progressCharts.setOption({
                series: [
                    // 配置柱状图
                    {
                        data: [this.activityRate],
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