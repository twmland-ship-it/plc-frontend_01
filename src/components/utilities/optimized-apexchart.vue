<template>
  <div :id="chartId" :style="{ height: height }"></div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import ApexCharts from 'apexcharts';

export default defineComponent({
  name: 'OptimizedApexChart',
  props: {
    type: {
      type: String,
      required: true
    },
    height: {
      type: [String, Number],
      default: '300'
    },
    id: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    series: {
      type: Array,
      default: () => []
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const chart = ref(null);
    const chartId = ref(`apex-${props.id}-${Date.now()}`);
    const lastDataHash = ref('');
    const isInitialized = ref(false);

    // 計算資料雜湊值
    const getDataHash = () => {
      return JSON.stringify({
        series: props.series,
        options: props.options
      });
    };

    // 檢查資料是否有變化
    const hasDataChanged = () => {
      const currentHash = getDataHash();
      if (currentHash !== lastDataHash.value) {
        lastDataHash.value = currentHash;
        return true;
      }
      return false;
    };

    // 初始化圖表
    const initChart = () => {
      if (isInitialized.value) return;

      nextTick(() => {
        const element = document.getElementById(chartId.value);
        if (!element || chart.value) return;

        try {
          // 確保 series 是有效的陣列
          const series = Array.isArray(props.series) ? props.series : [];
          
          // 創建 ApexCharts 實例
          chart.value = new ApexCharts(element, {
            chart: {
              type: props.type,
              height: props.height,
              animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 300,
                animateGradually: {
                  enabled: true,
                  delay: 50
                },
                dynamicAnimation: {
                  enabled: true,
                  speed: 300
                }
              },
              events: {
                click: (event, chartContext, config) => {
                  emit('click', event, chartContext, config);
                }
              }
            },
            series: series,
            ...props.options
          });

          chart.value.render();
          isInitialized.value = true;
          lastDataHash.value = getDataHash();
        } catch (error) {
          console.error('ApexChart initialization failed:', error);
          console.error('Chart props:', {
            type: props.type,
            height: props.height,
            series: props.series,
            options: props.options
          });
        }
      });
    };

    // 平滑更新圖表
    const updateChart = () => {
      if (!chart.value || !hasDataChanged()) return;

      try {
        // 更新系列資料（無動畫，避免閃爍）
        chart.value.updateSeries(props.series, false);
        
        // 如果選項有變化，也更新選項
        chart.value.updateOptions(props.options, false, false);
      } catch (error) {
        console.warn('ApexChart update failed:', error);
        // 更新失敗時重新初始化
        if (chart.value) {
          chart.value.destroy();
          chart.value = null;
          isInitialized.value = false;
          initChart();
        }
      }
    };

    // 組件掛載時初始化
    onMounted(() => {
      initChart();
    });

    // 監聽資料變化
    watch(() => props.series, () => {
      if (isInitialized.value) {
        updateChart();
      } else {
        initChart();
      }
    }, { deep: true });

    // 監聽選項變化
    watch(() => props.options, () => {
      if (isInitialized.value) {
        updateChart();
      }
    }, { deep: true });

    // 監聽高度變化
    watch(() => props.height, (newHeight, oldHeight) => {
      console.log(`ApexChart height changed from ${oldHeight} to ${newHeight}`);
      if (chart.value && isInitialized.value) {
        nextTick(() => {
          try {
            console.log('Triggering ApexChart resize...');
            chart.value.updateDimensions();
          } catch (error) {
            console.warn('ApexChart resize failed:', error);
            // 如果 resize 失敗，重新初始化圖表
            if (chart.value) {
              chart.value.destroy();
              chart.value = null;
              isInitialized.value = false;
              initChart();
            }
          }
        });
      }
    });

    // 組件卸載時清理
    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value.destroy();
        chart.value = null;
      }
    });

    return {
      chartId
    };
  }
});
</script>

<style scoped>
.apexcharts-canvas {
  margin: 0 auto;
}
</style>
