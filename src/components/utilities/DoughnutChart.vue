<template>
  <div class="doughnutchart-inner">
    <!-- 若 datasets[0] 提供 centerText/centerTextLabel，chartjs.vue 會在 canvas 內繪製中心文字。
         這裡就不要再用 HTML 疊一層，避免看起來重疊。 -->
    <div v-if="shouldRenderInnerText" class="doughnutchart-inner-text">
      <span
        v-if="centerTextDisplay === ''"
        class="doughnutchart-inner-content"
        >{{ dataSum }}%</span
      >

      <span v-else class="doughnutchart-inner-content">{{
        centerTextDisplay
      }}</span>

      <span class="doughnutchart-inner-label">{{
        centerTextLabelDisplay
      }}</span>
    </div>

    <DashboardChart
      :tooltip="tooltip"
      type="doughnut"
      :datasets="datasets"
      :id="id"
      :className="className"
      :labels="labels"
      :height="height"
      :options="options"
      :legend="legend"
      :layout="layout"
      :elements="elements"
      :scales="scales"
    />
  </div>
</template>
<script>
import { defineComponent, computed, watch } from "vue";
import PropTypes from "vue-types";
import DashboardChart from "./chartjs.vue";
import { getItem } from "@/utility/localStorageControl";

export default defineComponent({
  components: {
    DashboardChart,
  },
  props: {
    height: PropTypes.number.def(479),
    labels: PropTypes.arrayOf(PropTypes.string).def([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]),
    datasets: PropTypes.arrayOf(PropTypes.object).def([
      {
        data: [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30],
        borderColor: "#001737",
        borderWidth: 1,
        fill: false,
      },
      {
        data: [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20],
        borderColor: "#1ce1ac",
        borderWidth: 1,
        fill: false,
      },
    ]),
    id: PropTypes.string.def("myChart"),
    className: PropTypes.string.def("myChart"),
    legend: PropTypes.object.def({
      display: false,
      labels: {
        display: false,
      },
    }),
    layout: PropTypes.object.def({}),
    elements: PropTypes.object.def({
      line: {
        tension: 0.5,
        borderCapStyle: "round",
        borderJoinStyle: "round",
        capBezierPoints: true,
      },
      point: {
        radius: 0,
        z: 5,
      },
    }),
    scales: PropTypes.object.def({
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    }),
    tooltip: PropTypes.object.def({}),
    options: PropTypes.object.def({}),
  },
  setup(props) {
    const isChartDebugEnabled = () => {
      const flag = getItem("debug_chart_log");
      return flag === true || flag === "true" || flag === 1 || flag === "1";
    };
    // 使用 computed 來避免重複計算，確保穩定性
    const dataSum = computed(() => {
      if (!props.datasets || !props.datasets[0] || !props.datasets[0].data) {
        return 0;
      }
      return props.datasets[0].data.reduce((a, b) => Number(a) + Number(b), 0);
    });

    const centerTextDisplay = computed(() => {
      if (!props.datasets || !props.datasets[0]) {
        return '';
      }
      return props.datasets[0].centerText || '';
    });

    const centerTextLabelDisplay = computed(() => {
      if (!props.datasets || !props.datasets[0]) {
        return '';
      }
      return props.datasets[0].centerTextLabel || '';
    });

    const shouldRenderInnerText = computed(() => {
      // chartjs.vue 內建 centerDoughnut plugin 會讀取 datasets[0].centerText/centerTextLabel 來畫中心文字，
      // 若這兩個值有任一存在，代表會由 canvas 繪製，這裡就不要再 render HTML 版本。
      const ds0 = props.datasets && props.datasets[0];
      const hasCanvasCenterText =
        ds0 && (ds0.centerText != null || ds0.centerTextLabel != null);
      return !hasCanvasCenterText;
    });

    // 監聽高度變化，確保圖表能正確響應
    watch(() => props.height, (newHeight, oldHeight) => {
      if (isChartDebugEnabled()) {
        console.debug(`DoughnutChart height changed from ${oldHeight} to ${newHeight}`);
      }
    });

    // 監聽數據變化，確保圖表穩定
    watch(() => props.datasets, (newDatasets) => {
      if (isChartDebugEnabled()) {
        console.debug('DoughnutChart datasets changed:', newDatasets);
      }
      // 檢查數據是否有效
      if (!newDatasets || newDatasets.length === 0) {
        if (isChartDebugEnabled()) {
          console.warn('DoughnutChart: datasets are empty, keeping existing data');
        }
        return;
      }
      
      const hasValidData = newDatasets.some(dataset => 
        dataset.data && Array.isArray(dataset.data) && dataset.data.length > 0
      );
      
      if (!hasValidData) {
        if (isChartDebugEnabled()) {
          console.warn('DoughnutChart: no valid data in datasets, keeping existing data');
        }
      }
    }, { deep: true });

    // 監聽標籤變化，確保圖表穩定
    watch(() => props.labels, (newLabels) => {
      if (isChartDebugEnabled()) {
        console.debug('DoughnutChart labels changed:', newLabels);
      }
      // 檢查標籤是否有效
      if (!newLabels || newLabels.length === 0) {
        if (isChartDebugEnabled()) {
          console.warn('DoughnutChart: labels are empty');
        }
      }
    }, { deep: true });

    return {
      dataSum,
      centerTextDisplay,
      centerTextLabelDisplay
      ,shouldRenderInnerText
    };
  },
});
</script>

<style scoped>
/* 讓 DoughnutChart 在 Modal/非 Main 容器也能正確定位置中內容 */
.doughnutchart-inner {
  position: relative;
}

.doughnutchart-inner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 200px;
  line-height: 1;
  margin-bottom: 0;
  display: inline-block;
}

.doughnutchart-inner-content {
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
  display: block;
}

.doughnutchart-inner-label {
  font-size: 15px;
}

.doughnutchart-inner canvas {
  margin: 0 auto;
}
</style>
